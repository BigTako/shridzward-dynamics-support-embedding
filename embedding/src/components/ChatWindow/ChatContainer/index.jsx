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

  const [chatHistory, setChatHistory] = useState([
    {
      content:
        'Hey there! How can i help you today? Please,feel free to ask any question about our company 😊',
      sentAt: new Date(),
      role: 'assistant',
      animate: false,
    },
  ]);

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

    const evtSource = new SSE(`${import.meta.env.VITE_API_URL}/gpt-responce`, {
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify({ prompt: message }),
    });

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

    evtSource.addEventListener('done', () => {
      evtSource.close();
    });

    evtSource.addEventListener('error', (e) => {
      console.error('Stream error', e);
      evtSource.close();
    });
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
