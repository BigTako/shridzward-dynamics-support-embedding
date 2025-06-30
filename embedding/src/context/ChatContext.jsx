import React, { createContext, useContext, useEffect, useState } from 'react';

// Create the ChatContext
const ChatContext = createContext();

// Provider component
export function ChatProvider({ children }) {
  const [supportAgent, setSupportAgent] = useState(null); // 'bot' or 'human'
  const [isChangingAgent, setIsChangingAgent] = useState(false); // 'bot' or 'human'
  const [chatHistory, setChatHistory] = useState(null);

  useEffect(() => {
    const currentSupportAgent = localStorage.getItem('supportAgent') || 'bot';
    setSupportAgent(currentSupportAgent);
  }, []);

  useEffect(() => {
    const currentChatHistory = JSON.parse(
      localStorage.getItem('chatHistory') || '[]'
    );

    setChatHistory(() => currentChatHistory);
  }, []);

  const saveChatHistory = (newHistory) => {
    const stringifiedHistory = JSON.stringify(newHistory);
    localStorage.setItem('chatHistory', stringifiedHistory);
  };

  const saveSupportAgent = (agent) => {
    localStorage.setItem('supportAgent', agent);
  };

  return (
    <ChatContext.Provider
      value={{
        supportAgent,
        setSupportAgent,
        isChangingAgent,
        setIsChangingAgent,
        chatHistory,
        setChatHistory,
        saveChatHistory,
        saveSupportAgent,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook for consuming the context
export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
