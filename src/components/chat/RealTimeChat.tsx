import React from 'react';
import { SimplifiedRealTimeChat } from './SimplifiedRealTimeChat';

// Use the simplified version to avoid database table errors
export const RealTimeChat = SimplifiedRealTimeChat;

// Export a simplified useChat hook
export const useChat = () => {
  return {
    chats: [],
    activeChat: null,
    setActiveChat: () => {},
    loadChats: () => Promise.resolve()
  };
};

export default RealTimeChat;