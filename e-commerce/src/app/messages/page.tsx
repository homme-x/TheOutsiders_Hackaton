'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Types pour les messages
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const MessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkLoginStatus = () => {
      if (typeof window !== 'undefined') {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(isLoggedIn);
      }
    };
    
    checkLoginStatus();
  }, []);

  // Charger les conversations (simulées)
  useEffect(() => {
    // Simulation de chargement des données
    setTimeout(() => {
      const mockConversations: Conversation[] = [
        {
          id: '1',
          participantId: 'vendor1',
          participantName: 'Boutique Fournitures ENSPY',
          participantAvatar: '/images/vendors/vendor1.jpg',
          lastMessage: 'Bonjour, avez-vous reçu votre commande ?',
          lastMessageTime: '2025-05-03T14:30:00',
          unreadCount: 2
        },
        {
          id: '2',
          participantId: 'vendor2',
          participantName: 'Librairie Universitaire',
          participantAvatar: '/images/vendors/vendor2.jpg',
          lastMessage: 'Merci pour votre achat !',
          lastMessageTime: '2025-05-02T09:15:00',
          unreadCount: 0
        },
        {
          id: '3',
          participantId: 'admin',
          participantName: 'Support ENSPY E-Commerce',
          participantAvatar: '/images/enspy.jpg',
          lastMessage: 'Comment pouvons-nous vous aider aujourd\'hui ?',
          lastMessageTime: '2025-05-01T16:45:00',
          unreadCount: 1
        }
      ];
      
      setConversations(mockConversations);
      setIsLoading(false);
      
      // Si des conversations existent, sélectionner la première par défaut
      if (mockConversations.length > 0) {
        setActiveConversation(mockConversations[0].id);
        loadMessages(mockConversations[0].id);
      }
    }, 1000);
  }, []);

  // Charger les messages d'une conversation
  const loadMessages = (conversationId: string) => {
    setIsLoading(true);
    
    // Simulation de chargement des messages
    setTimeout(() => {
      const mockMessages: { [key: string]: Message[] } = {
        '1': [
          {
            id: 'm1',
            senderId: 'vendor1',
            senderName: 'Boutique Fournitures ENSPY',
            senderAvatar: '/images/vendors/vendor1.jpg',
            receiverId: 'user',
            content: 'Bonjour, nous avons bien reçu votre commande de fournitures.',
            timestamp: '2025-05-03T10:15:00',
            isRead: true
          },
          {
            id: 'm2',
            senderId: 'user',
            senderName: 'Vous',
            senderAvatar: '/images/avatar.jpg',
            receiverId: 'vendor1',
            content: 'Super ! Quand est-ce que je pourrai la récupérer ?',
            timestamp: '2025-05-03T10:20:00',
            isRead: true
          },
          {
            id: 'm3',
            senderId: 'vendor1',
            senderName: 'Boutique Fournitures ENSPY',
            senderAvatar: '/images/vendors/vendor1.jpg',
            receiverId: 'user',
            content: 'Votre commande sera prête demain à partir de 14h.',
            timestamp: '2025-05-03T10:25:00',
            isRead: true
          },
          {
            id: 'm4',
            senderId: 'vendor1',
            senderName: 'Boutique Fournitures ENSPY',
            senderAvatar: '/images/vendors/vendor1.jpg',
            receiverId: 'user',
            content: 'Bonjour, avez-vous reçu votre commande ?',
            timestamp: '2025-05-03T14:30:00',
            isRead: false
          }
        ],
        '2': [
          {
            id: 'm5',
            senderId: 'vendor2',
            senderName: 'Librairie Universitaire',
            senderAvatar: '/images/vendors/vendor2.jpg',
            receiverId: 'user',
            content: 'Votre commande de livres a été expédiée.',
            timestamp: '2025-05-02T09:00:00',
            isRead: true
          },
          {
            id: 'm6',
            senderId: 'vendor2',
            senderName: 'Librairie Universitaire',
            senderAvatar: '/images/vendors/vendor2.jpg',
            receiverId: 'user',
            content: 'Merci pour votre achat !',
            timestamp: '2025-05-02T09:15:00',
            isRead: true
          }
        ],
        '3': [
          {
            id: 'm7',
            senderId: 'admin',
            senderName: 'Support ENSPY E-Commerce',
            senderAvatar: '/images/enspy.jpg',
            receiverId: 'user',
            content: 'Bienvenue sur ENSPY E-Commerce ! N\'hésitez pas à nous contacter si vous avez des questions.',
            timestamp: '2025-05-01T16:30:00',
            isRead: true
          },
          {
            id: 'm8',
            senderId: 'admin',
            senderName: 'Support ENSPY E-Commerce',
            senderAvatar: '/images/enspy.jpg',
            receiverId: 'user',
            content: 'Comment pouvons-nous vous aider aujourd\'hui ?',
            timestamp: '2025-05-01T16:45:00',
            isRead: false
          }
        ]
      };
      
      setMessages(mockMessages[conversationId] || []);
      setIsLoading(false);
      
      // Marquer les messages comme lus
      const updatedConversations = conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
    }, 500);
  };

  // Envoyer un nouveau message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;
    
    // Créer un nouveau message
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: 'user',
      senderName: 'Vous',
      senderAvatar: '/images/avatar.jpg',
      receiverId: conversations.find(c => c.id === activeConversation)?.participantId || '',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true
    };
    
    // Ajouter le message à la conversation
    setMessages([...messages, newMsg]);
    
    // Mettre à jour la dernière conversation
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          lastMessage: newMessage,
          lastMessageTime: new Date().toISOString()
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setNewMessage('');
    
    // Simuler une réponse automatique après 2 secondes
    setTimeout(() => {
      const autoReply: Message = {
        id: `m${Date.now() + 1}`,
        senderId: conversations.find(c => c.id === activeConversation)?.participantId || '',
        senderName: conversations.find(c => c.id === activeConversation)?.participantName || '',
        senderAvatar: conversations.find(c => c.id === activeConversation)?.participantAvatar || '',
        receiverId: 'user',
        content: 'Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.',
        timestamp: new Date().toISOString(),
        isRead: true
      };
      
      setMessages(prev => [...prev, autoReply]);
      
      // Mettre à jour la dernière conversation
      const updatedConvs = conversations.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            lastMessage: autoReply.content,
            lastMessageTime: autoReply.timestamp
          };
        }
        return conv;
      });
      
      setConversations(updatedConvs);
    }, 2000);
  };

  // Formater la date pour l'affichage
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatConversationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
  };

  // Si l'utilisateur n'est pas connecté, afficher un message
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Connexion requise</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à vos messages.</p>
          <Link href="/auth/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-orange-300 mb-1">Messagerie</h1>
        <p className="text-orange-300 mb-6">Communiquez avec les vendeurs et le support</p>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row h-[calc(100vh-200px)]">
            {/* Liste des conversations */}
            <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
              </div>
              
              {isLoading && conversations.length === 0 ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Aucune conversation pour le moment
                </div>
              ) : (
                conversations.map(conversation => (
                  <div 
                    key={conversation.id}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${activeConversation === conversation.id ? 'bg-blue-50' : ''}`}
                    onClick={() => {
                      setActiveConversation(conversation.id);
                      loadMessages(conversation.id);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
                        <Image 
                          src={conversation.participantAvatar || '/images/placeholder.jpg'} 
                          alt={conversation.participantName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.participantName}</h3>
                          <span className="text-xs text-gray-500">{formatConversationTime(conversation.lastMessageTime)}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Zone de messages */}
            <div className="w-full md:w-2/3 flex flex-col">
              {activeConversation ? (
                <>
                  {/* En-tête de la conversation */}
                  <div className="p-4 border-b border-gray-200 flex items-center">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                      <Image 
                        src={conversations.find(c => c.id === activeConversation)?.participantAvatar || '/images/placeholder.jpg'} 
                        alt={conversations.find(c => c.id === activeConversation)?.participantName || ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {conversations.find(c => c.id === activeConversation)?.participantName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {conversations.find(c => c.id === activeConversation)?.participantId === 'admin' 
                          ? 'Support' 
                          : 'Vendeur'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-10">
                        Aucun message dans cette conversation
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map(message => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] ${message.senderId === 'user' ? 'bg-blue-500 text-white' : 'bg-white'} rounded-lg px-4 py-2 shadow`}>
                              <div className="flex items-center mb-1">
                                {message.senderId !== 'user' && (
                                  <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
                                    <Image 
                                      src={message.senderAvatar || '/images/placeholder.jpg'} 
                                      alt={message.senderName}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <span className={`text-xs font-medium ${message.senderId === 'user' ? 'text-blue-100' : 'text-gray-700'}`}>
                                  {message.senderName}
                                </span>
                                <span className={`text-xs ml-2 ${message.senderId === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                  {formatMessageTime(message.timestamp)}
                                </span>
                              </div>
                              <p className={`text-sm ${message.senderId === 'user' ? 'text-white' : 'text-gray-800'}`}>
                                {message.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Zone de saisie */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={sendMessage} className="flex">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez votre message..."
                        className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Vos messages</h3>
                  <p className="text-gray-500 max-w-md">
                    Sélectionnez une conversation pour voir les messages ou commencez une nouvelle conversation avec un vendeur.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
