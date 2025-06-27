import React, { createContext, useContext, useState } from 'react';

// Create the ChatContext
const ChatContext = createContext();

// Provider component
export function ChatProvider({ children }) {
  const [supportAgent, setSupportAgent] = useState('bot'); // 'bot' or 'human'
  const [isChangingAgent, setIsChangingAgent] = useState(false); // 'bot' or 'human'

  return (
    <ChatContext.Provider
      value={{
        supportAgent,
        setSupportAgent,
        isChangingAgent,
        setIsChangingAgent,
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
