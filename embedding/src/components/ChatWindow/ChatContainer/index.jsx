import React, { useState, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import PromptInput from './PromptInput';
import { SSE } from 'sse.js';
import { useChatContext } from '@/context/ChatContext';
import { socket } from '@/socketClient';
export const SEND_TEXT_EVENT = 'anythingllm-embed-send-prompt';

export default function ChatContainer({ settings }) {
  const [message, setMessage] = useState('');
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [prevResponseId, setPrevResponseId] = useState(null);
  const {
    supportAgent,
    isChangingAgent,
    setIsChangingAgent,
    chatHistory,
    setChatHistory,
    saveChatHistory,
  } = useChatContext();
  const [humanAgentChatId, setHumanAgentChatId] = useState(null);
  const [isJoiningChat, setIsJoiningChat] = useState(false);
  const [isGettingClientData, setIsGettingClientData] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [user, setUser] = useState(null);
  const streamBotAsnwer = (message, prevResponseId, saveMessage = true) => {
    const prevChatHistory = [...chatHistory];

    saveMessage &&
      prevChatHistory.push({
        content: message,
        role: 'user',
        sentAt: Math.floor(Date.now() / 1000),
      });
    prevChatHistory.push({
      content: '',
      role: 'assistant',
      pending: true,
      userMessage: message,
      animate: true,
      sentAt: Math.floor(Date.now() / 1000),
    });
    setChatHistory(() => prevChatHistory);

    const evtSource = new SSE(
      `${import.meta.env.VITE_API_URL}/gpt-response/sse`,
      {
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify({
          prompt: message,
          previous_response_id: prevResponseId,
        }),
      }
    );

    evtSource.onmessage = (e) => {
      const chunk = e.data.replaceAll('\\n', '\n');
      // console.log({ raw: e.data });
      setChatHistory((prev) => {
        // Append delta to last assistant message
        const updated = [...prev];
        const idx = updated.length - 1;
        const chatMessage = updated[idx];
        if (chatMessage) {
          chatMessage.content += chunk;
          chatMessage.pending = false;
        }
        saveChatHistory(updated);
        return updated;
      });
    };

    evtSource.addEventListener('done', (e) => {
      const responceId = e.data.replaceAll('\\n', '\n');
      setPrevResponseId(responceId);
      evtSource.close();
    });

    evtSource.addEventListener('error', (e) => {
      console.error('Stream error', e);
      evtSource.close();
    });
  };

  const launchChatBot = () => {
    setPrevResponseId(null);
    setMessage('');
    setLoadingResponse(false);
    const prevChatHistory = [
      {
        content: '',
        role: 'assistant',
        pending: true,
        userMessage: message,
        animate: true,
        sentAt: Math.floor(Date.now() / 1000),
      },
    ];
    setChatHistory(prevChatHistory);
    setLoadingResponse(true);
    setMessage('');
    // call /api/gpt_responce/sse with message
    // stream and answer
    streamBotAsnwer(
      'In your response: greet, tell a little bit that user can ask any question about Shridzward Dynamics company and you will help. Ask user how should you call him/her in a polite form, memorize this,this is username.',
      undefined,
      false
    );

    setLoadingResponse(false);
  };

  useEffect(() => {
    try {
      if (!chatHistory.length) {
        launchChatBot();
      }
    } catch (error) {
      console.log('Unable to set chat history from local storage: ', error);
    }

    socket.on('message', (data) => {
      setChatHistory((chatHistory) => {
        const newHistory = [
          ...chatHistory,
          {
            content: data?.text,
            role: 'assistant',
            pending: false,
            userMessage: message,
            animate: false,
            sentAt: Math.floor(Date.now() / 1000),
          },
        ];

        saveChatHistory(newHistory);
        return newHistory;
      });
    });
  }, []);

  useEffect(() => {
    if (humanAgentChatId) {
      socket
        .emitWithAck('join-chat', {
          chatId: humanAgentChatId,
          user: { type: 'user', username: 'User' },
        })
        .then(() => {
          console.log('User joined the chat!');
          const newHistory = [
            ...chatHistory,
            {
              content:
                'The conversation was transfered to human agent, please wait until agent joins',
              role: 'assistant',
              pending: false,
              userMessage: message,
              animate: false,
              sentAt: Math.floor(Date.now() / 1000),
            },
          ];
          setChatHistory(newHistory);
          saveChatHistory(newHistory);
        })
        .finally(() => setIsJoiningChat(false));

      socket
        .emitWithAck('get-client-data', { chatId: humanAgentChatId })
        .then((data) => {
          setUser(data);
        })
        .finally(() => {
          setIsGettingClientData(false);
        });
    }
  }, [humanAgentChatId]);

  useEffect(() => {
    console.log('switch agent', supportAgent);
    async function setupAgent() {
      if (supportAgent === 'human') {
        setIsChangingAgent(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/gpt-response`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: `User wants to switch conversation to human agent mode. \
                       Call redirect_to_support tool of MCP server and return chat.id (NOTE: Return ONLY chat.id, so just string number, without any formatting or markdown, just plain string).
                       Please use username, question and context grabbed from the current conversation.`,
              previous_response_id: prevResponseId,
            }),
          }
        ).finally(() => setIsChangingAgent(false));
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            setHumanAgentChatId(data?._meta?.message);
            setPrevResponseId(data?._meta?.response_id);
          }
        }
        // send request and get room id
      } else if (supportAgent === 'bot') {
        setHumanAgentChatId(null);
      }
    }
    setupAgent();
  }, [supportAgent]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessageToSupport = async (message) => {
    setIsSendingMessage(true);
    const newChatHistory = [
      ...chatHistory,
      { content: message, role: 'user', sentAt: Math.floor(Date.now() / 1000) },
    ];
    setChatHistory(() => newChatHistory);
    saveChatHistory(newChatHistory);
    await socket.emitWithAck('message', {
      type: 'user',
      text: message,
      senderId: user.id,
      chatId: humanAgentChatId,
    });
    setIsSendingMessage(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message || message === '') return false;

    setLoadingResponse(true);
    setMessage('');

    supportAgent === 'bot'
      ? streamBotAsnwer(message, prevResponseId)
      : await sendMessageToSupport(message);

    setLoadingResponse(false);
  };

  const noMessagesFromUser = !Boolean(
    chatHistory.some((m) => m.role === 'user')
  );

  const isLoading =
    isJoiningChat ||
    loadingResponse ||
    isChangingAgent ||
    isGettingClientData ||
    isSendingMessage;

  return (
    <div className='allm-h-full allm-w-full allm-flex allm-flex-col'>
      <div className='allm-flex-1 allm-min-h-0 allm-mb-8'>
        <ChatHistory settings={settings} history={chatHistory} />
      </div>
      <div className='allm-flex-shrink-0 allm-mt-auto'>
        <PromptInput
          settings={settings}
          message={message}
          submit={handleSubmit}
          onChange={handleMessageChange}
          inputDisabled={isLoading}
          buttonDisabled={isLoading}
        />
      </div>
    </div>
  );
}
