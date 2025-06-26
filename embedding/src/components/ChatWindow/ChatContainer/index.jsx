import React, { useState, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import PromptInput from './PromptInput';
import { SSE } from 'sse.js';
export const SEND_TEXT_EVENT = 'anythingllm-embed-send-prompt';

export default function ChatContainer({
  sessionId,
  settings,
  knownHistory = [],
}) {
  const [message, setMessage] = useState('');
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [prevResponseId, setPrevResponseId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const streamBotAsnwer = (message, prevResponseId) => {
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
      const message = e.data.replaceAll('\\n', '\n');
      // console.log({ raw: e.data });
      setChatHistory((prev) => {
        // Append delta to last assistant message
        const updated = [...prev];
        const idx = updated.length - 1;
        const chatMessage = updated[idx];
        chatMessage.content += message;
        chatMessage.pending = false;
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
      'In your response: greet, tell a little bit that user can ask any question about Shridzward Dynamics company and you will help. Ask user how should you call him/her in a polite form, memorize this,this is username.'
    );

    setLoadingResponse(false);
  };

  useEffect(() => {
    // create empty chat response message
    launchChatBot();
  }, []);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message || message === '') return false;

    const prevChatHistory = [
      ...chatHistory,
      { content: message, role: 'user', sentAt: Math.floor(Date.now() / 1000) },
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

    streamBotAsnwer(message, prevResponseId);

    setLoadingResponse(false);
  };

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
          inputDisabled={loadingResponse}
          buttonDisabled={loadingResponse}
        />
      </div>
    </div>
  );
}
