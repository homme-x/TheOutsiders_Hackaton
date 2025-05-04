'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Interface pour les messages
interface Message {
  id: string;
  sender: string;
  senderId: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isFromVendor: boolean;
}

// Interface pour les conversations
interface Conversation {
  id: string;
  customer: {
    id: string;
    name: string;
    avatar: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
  };
  messages: Message[];
  unreadCount: number;
}

export default function VendorMessages() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/auth/login?redirect=/vendor/messages');
      } else {
        // Charger les conversations (simulé)
        setTimeout(() => {
          setConversations(mockConversations);
          setIsLoading(false);
        }, 1000);
      }
    };
    
    checkAuth();
  }, [router]);

  // Faire défiler automatiquement vers le bas lors de l'envoi ou de la réception de messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation, conversations]);

  // Marquer les messages comme lus lorsqu'une conversation est sélectionnée
  useEffect(() => {
    if (activeConversation) {
      setConversations(prevConversations => 
        prevConversations.map(conv => {
          if (conv.id === activeConversation) {
            return {
              ...conv,
              unreadCount: 0,
              messages: conv.messages.map(msg => ({
                ...msg,
                isRead: true
              })),
              lastMessage: {
                ...conv.lastMessage,
                isRead: true
              }
            };
          }
          return conv;
        })
      );
    }
  }, [activeConversation]);

  // Envoyer un nouveau message
  const sendMessage = () => {
    if (newMessage.trim() === '' || !activeConversation) return;
    
    const timestamp = new Date().toISOString();
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'Vendeur',
      senderId: 'vendor-1',
      senderAvatar: '/images/enspy.jpg',
      content: newMessage,
      timestamp,
      isRead: true,
      isFromVendor: true
    };
    
    // Créer une copie des conversations pour la mise à jour
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          lastMessage: {
            content: newMessage,
            timestamp,
            isRead: true
          }
        };
      }
      return conv;
    });
    
    // Mettre à jour l'état avec les nouvelles conversations
    setConversations(updatedConversations);
    
    // Réinitialiser le champ de saisie
    setNewMessage('');
    
    // Forcer le défilement vers le bas après l'ajout du message
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Trouver la conversation active
  const activeConv = conversations.find(conv => conv.id === activeConversation);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* En-tête */}
      <div className="bg-primary text-white py-6">
        <div className="enspy-container">
          <h1 className="text-2xl font-bold text-orange-300">Messagerie</h1>
          <p className="text-orange-300 font-medium">Gérez vos conversations avec les clients</p>
        </div>
      </div>
      
      <div className="enspy-container mt-6">
        {/* Navigation du tableau de bord */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <nav className="flex flex-wrap space-x-1 md:space-x-4">
            <Link href="/vendor/dashboard" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Tableau de bord
            </Link>
            <Link href="/vendor/products" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Produits
            </Link>
            <Link href="/vendor/orders" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Commandes
            </Link>
            <Link href="/vendor/inventory" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Inventaire
            </Link>
            <Link href="/vendor/promotions" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Promotions
            </Link>
            <Link href="/vendor/messages" className="px-3 py-2 rounded-md bg-white text-secondary font-medium relative">
              Messagerie
              <span className="absolute bottom-0 left-0 w-full h-1 bg-secondary-dark"></span>
            </Link>
            <Link href="/vendor/availability" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Disponibilité
            </Link>
            <Link href="/vendor/reports" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Rapports
            </Link>
            <Link href="/vendor/settings" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Paramètres
            </Link>
          </nav>
        </div>
        
        {/* Interface de messagerie */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
            {/* Liste des conversations */}
            <div className="col-span-1 border-r border-gray-200 overflow-y-auto h-full">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Rechercher une conversation..." 
                    className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                {conversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p className="text-gray-500">Aucune conversation</p>
                  </div>
                ) : (
                  conversations.map(conv => (
                    <button
                      key={conv.id}
                      className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${activeConversation === conv.id ? 'bg-gray-100' : ''}`}
                      onClick={() => setActiveConversation(conv.id)}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="relative h-12 w-12 rounded-full overflow-hidden">
                            <Image 
                              src={conv.customer.avatar} 
                              alt={conv.customer.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {conv.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {conv.unreadCount}
                            </div>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">{conv.customer.name}</h3>
                            <span className="text-xs text-gray-500">{formatDate(conv.lastMessage.timestamp)}</span>
                          </div>
                          <p className={`text-sm truncate ${conv.lastMessage.isRead ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>
                            {conv.lastMessage.content}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
            
            {/* Zone de conversation */}
            <div className="col-span-2 flex flex-col h-full">
              {activeConversation ? (
                <>
                  {/* En-tête de la conversation */}
                  <div className="p-4 border-b border-gray-200 flex items-center">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-300">
                      <Image 
                        src={activeConv?.customer.avatar || '/images/avatar-placeholder.jpg'} 
                        alt={activeConv?.customer.name || 'Client'}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-800">{activeConv?.customer.name}</h3>
                      <p className="text-xs text-gray-500">Client</p>
                    </div>
                  </div>
                  
                  {/* Messages - hauteur fixe avec défilement */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ height: 'calc(100% - 140px)' }}>
                    <div className="space-y-4">
                      {activeConv?.messages.map(msg => (
                        <div 
                          key={msg.id} 
                          className={`flex ${msg.isFromVendor ? 'justify-end' : 'justify-start'}`}
                        >
                          {/* Message container */}
                          <div className={`flex ${msg.isFromVendor ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[80%]`}>
                            {/* Avatar */}
                            <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0 mx-2 bg-gray-300">
                              <Image 
                                src={msg.senderAvatar} 
                                alt={msg.sender}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                            {/* Message bubble */}
                            <div 
                              className={`px-4 py-3 rounded-lg ${
                                msg.isFromVendor 
                                  ? 'bg-orange-500 text-white rounded-tr-none' 
                                  : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                              <p className={`text-xs mt-1 ${msg.isFromVendor ? 'text-orange-200' : 'text-gray-500'}`}>
                                {formatDate(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                  
                  {/* Zone de saisie - hauteur fixe */}
                  <div className="p-4 border-t border-gray-200 bg-white" style={{ height: '80px' }}>
                    <div className="flex h-full">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Tapez votre message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            sendMessage();
                          }
                        }}
                      />
                      <button
                        onClick={sendMessage}
                        className="px-4 py-2 bg-orange-500 text-white rounded-r-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                        aria-label="Envoyer le message"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune conversation sélectionnée</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Sélectionnez une conversation dans la liste pour afficher les messages ou attendez qu&apos;un client vous contacte.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Données fictives pour la démonstration
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    customer: {
      id: 'cust1',
      name: 'Thomas Kameni',
      avatar: '/images/enspy.jpg'
    },
    lastMessage: {
      content: 'Bonjour, est-ce que le produit est toujours disponible ?',
      timestamp: '2025-05-03T10:30:00',
      isRead: false
    },
    messages: [
      {
        id: 'msg1',
        sender: 'Thomas Kameni',
        senderId: 'cust1',
        senderAvatar: '/images/enspy.jpg',
        content: 'Bonjour, je suis intéressé par votre calculatrice scientifique.',
        timestamp: '2025-05-03T10:15:00',
        isRead: true,
        isFromVendor: false
      },
      {
        id: 'msg2',
        sender: 'Vendeur',
        senderId: 'vendor-1',
        senderAvatar: '/images/enspy.jpg',
        content: 'Bonjour Thomas, merci pour votre intérêt ! La calculatrice est parfaite pour les cours d\'ingénierie.',
        timestamp: '2025-05-03T10:20:00',
        isRead: true,
        isFromVendor: true
      },
      {
        id: 'msg3',
        sender: 'Thomas Kameni',
        senderId: 'cust1',
        senderAvatar: '/images/enspy.jpg',
        content: 'Bonjour, est-ce que le produit est toujours disponible ?',
        timestamp: '2025-05-03T10:30:00',
        isRead: false,
        isFromVendor: false
      }
    ],
    unreadCount: 1
  },
  {
    id: 'conv2',
    customer: {
      id: 'cust2',
      name: 'Marie Durand',
      avatar: '/images/enspy.jpg'
    },
    lastMessage: {
      content: 'Merci pour votre réponse rapide !',
      timestamp: '2025-05-02T16:45:00',
      isRead: true
    },
    messages: [
      {
        id: 'msg4',
        sender: 'Marie Durand',
        senderId: 'cust2',
        senderAvatar: '/images/enspy.jpg',
        content: 'Bonjour, j\'ai une question concernant la livraison des T-shirts ENSPY.',
        timestamp: '2025-05-02T15:30:00',
        isRead: true,
        isFromVendor: false
      },
      {
        id: 'msg5',
        sender: 'Vendeur',
        senderId: 'vendor-1',
        senderAvatar: '/images/enspy.jpg',
        content: 'Bonjour Marie, nous livrons sur le campus sous 24h et en ville sous 48h. Avez-vous besoin d\'autres informations ?',
        timestamp: '2025-05-02T16:00:00',
        isRead: true,
        isFromVendor: true
      },
      {
        id: 'msg6',
        sender: 'Marie Durand',
        senderId: 'cust2',
        senderAvatar: '/images/enspy.jpg',
        content: 'Merci pour votre réponse rapide !',
        timestamp: '2025-05-02T16:45:00',
        isRead: true,
        isFromVendor: false
      }
    ],
    unreadCount: 0
  },
  {
    id: 'conv3',
    customer: {
      id: 'cust3',
      name: 'Paul Martin',
      avatar: '/images/enspy.jpg'
    },
    lastMessage: {
      content: 'Je vais passer ma commande aujourd\'hui. Merci !',
      timestamp: '2025-05-01T11:20:00',
      isRead: true
    },
    messages: [
      {
        id: 'msg7',
        sender: 'Paul Martin',
        senderId: 'cust3',
        senderAvatar: '/images/enspy.jpg',
        content: 'Avez-vous des cahiers avec des pages quadrillées ?',
        timestamp: '2025-05-01T09:45:00',
        isRead: true,
        isFromVendor: false
      },
      {
        id: 'msg8',
        sender: 'Vendeur',
        senderId: 'vendor-1',
        senderAvatar: '/images/enspy.jpg',
        content: 'Bonjour Paul, oui nous avons des cahiers quadrillés en stock. Ils sont disponibles en format A4 et A5.',
        timestamp: '2025-05-01T10:15:00',
        isRead: true,
        isFromVendor: true
      },
      {
        id: 'msg9',
        sender: 'Paul Martin',
        senderId: 'cust3',
        senderAvatar: '/images/enspy.jpg',
        content: 'Parfait ! Je préfère le format A4.',
        timestamp: '2025-05-01T10:45:00',
        isRead: true,
        isFromVendor: false
      },
      {
        id: 'msg10',
        sender: 'Vendeur',
        senderId: 'vendor-1',
        senderAvatar: '/images/enspy.jpg',
        content: 'Nous en avons en stock. Vous pouvez les commander directement sur notre site.',
        timestamp: '2025-05-01T11:00:00',
        isRead: true,
        isFromVendor: true
      },
      {
        id: 'msg11',
        sender: 'Paul Martin',
        senderId: 'cust3',
        senderAvatar: '/images/enspy.jpg',
        content: 'Je vais passer ma commande aujourd\'hui. Merci !',
        timestamp: '2025-05-01T11:20:00',
        isRead: true,
        isFromVendor: false
      }
    ],
    unreadCount: 0
  }
];
