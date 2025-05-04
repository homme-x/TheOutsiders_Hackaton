'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatbotMessage from './ChatbotMessage';
import { ChatbotMessage as ChatbotMessageType, faqs, greetings, fallbackResponses, suggestions } from './chatbotData';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatbotMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialiser le chatbot avec un message de bienvenue
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      const botMessage: ChatbotMessageType = {
        id: Date.now().toString(),
        type: 'bot',
        text: randomGreeting,
        timestamp: new Date()
      };
      
      setIsTyping(true);
      setTimeout(() => {
        setMessages([botMessage]);
        setIsTyping(false);
      }, 1000);
    }
  }, [messages.length, isOpen]);
  
  // Faire défiler vers le bas lorsque de nouveaux messages sont ajoutés
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Rechercher une réponse à la question de l'utilisateur
  const findAnswer = (question: string): string => {
    const normalizedQuestion = question.toLowerCase();
    
    // Rechercher dans les FAQs
    for (const faq of faqs) {
      // Vérifier si la question contient des mots-clés
      const hasKeywords = faq.keywords.some(keyword => 
        normalizedQuestion.includes(keyword.toLowerCase())
      );
      
      if (hasKeywords) {
        return faq.answer;
      }
    }
    
    // Réponse par défaut si aucune correspondance n'est trouvée
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  };
  
  // Envoyer un message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Ajouter le message de l'utilisateur
    const userMessage: ChatbotMessageType = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simuler la réponse du bot
    setIsTyping(true);
    setTimeout(() => {
      const answer = findAnswer(inputValue);
      const botMessage: ChatbotMessageType = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: answer,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Utiliser une suggestion
  const handleSuggestionClick = (suggestion: string) => {
    // Ajouter le message de l'utilisateur
    const userMessage: ChatbotMessageType = {
      id: Date.now().toString(),
      type: 'user',
      text: suggestion,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simuler la réponse du bot
    setIsTyping(true);
    setTimeout(() => {
      const answer = findAnswer(suggestion);
      const botMessage: ChatbotMessageType = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: answer,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Bouton du chatbot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-300 hover:bg-orange-400 text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center justify-center"
        aria-label="Ouvrir le chatbot"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
      
      {/* Fenêtre du chatbot */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 animate-fade-in">
          {/* En-tête */}
          <div className="bg-orange-300 text-white p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Assistant ENSPY</h3>
                <p className="text-xs text-white/80">Disponible 24/7</p>
              </div>
            </div>
          </div>
          
          {/* Corps du chat */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {messages.map(message => (
              <ChatbotMessage key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="p-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Questions fréquentes :</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Formulaire de saisie */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-orange-300 hover:bg-orange-400 text-white px-4 py-2 rounded-r-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
