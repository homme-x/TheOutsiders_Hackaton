import React from 'react';
import { ChatbotMessage as ChatbotMessageType } from './chatbotData';

interface ChatbotMessageProps {
  message: ChatbotMessageType;
}

const ChatbotMessage: React.FC<ChatbotMessageProps> = ({ message }) => {
  // Formatter l'heure du message
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div 
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.type === 'user' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {message.type === 'bot' && (
          <div className="flex items-center mb-1">
            <div className="h-6 w-6 rounded-full bg-orange-300 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </div>
            <span className="text-xs font-medium">Assistant ENSPY</span>
          </div>
        )}
        <p className="text-sm">{message.text}</p>
        <div className={`text-xs mt-1 text-right ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatbotMessage;
