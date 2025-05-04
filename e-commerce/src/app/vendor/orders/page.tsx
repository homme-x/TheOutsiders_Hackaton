'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Composant pour le badge de statut
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = '';
  let textColor = '';
  
  switch (status) {
    case 'Complétée':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'En attente':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'En cours':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'Annulée':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }
  
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

export default function VendorOrders() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Données factices pour la démonstration
  const mockOrders = [
    { 
      id: "1234", 
      customer: "Jean Dupont", 
      email: "jean.dupont@example.com",
      date: "03/05/2025", 
      amount: "25,000", 
      status: "Complétée",
      items: 3
    },
    { 
      id: "1233", 
      customer: "Marie Durand", 
      email: "marie.durand@example.com",
      date: "02/05/2025", 
      amount: "15,500", 
      status: "En attente",
      items: 2
    },
    { 
      id: "1232", 
      customer: "Paul Martin", 
      email: "paul.martin@example.com",
      date: "01/05/2025", 
      amount: "32,000", 
      status: "Complétée",
      items: 4
    },
    { 
      id: "1231", 
      customer: "Sophie Petit", 
      email: "sophie.petit@example.com",
      date: "30/04/2025", 
      amount: "8,500", 
      status: "Annulée",
      items: 1
    },
    { 
      id: "1230", 
      customer: "Thomas Leroy", 
      email: "thomas.leroy@example.com",
      date: "29/04/2025", 
      amount: "12,000", 
      status: "En cours",
      items: 2
    },
    { 
      id: "1229", 
      customer: "Camille Dubois", 
      email: "camille.dubois@example.com",
      date: "28/04/2025", 
      amount: "18,500", 
      status: "Complétée",
      items: 3
    },
    { 
      id: "1228", 
      customer: "Lucas Bernard", 
      email: "lucas.bernard@example.com",
      date: "27/04/2025", 
      amount: "9,200", 
      status: "En attente",
      items: 1
    },
    { 
      id: "1227", 
      customer: "Emma Moreau", 
      email: "emma.moreau@example.com",
      date: "26/04/2025", 
      amount: "22,000", 
      status: "Complétée",
      items: 3
    },
    { 
      id: "1226", 
      customer: "Hugo Lefebvre", 
      email: "hugo.lefebvre@example.com",
      date: "25/04/2025", 
      amount: "14,500", 
      status: "En cours",
      items: 2
    },
    { 
      id: "1225", 
      customer: "Léa Roux", 
      email: "lea.roux@example.com",
      date: "24/04/2025", 
      amount: "7,800", 
      status: "Complétée",
      items: 1
    }
  ];

  // Statuts uniques pour le filtre
  const statuses = [...new Set(mockOrders.map(order => order.status))];

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/auth/login?redirect=/vendor/orders');
      } else {
        setIsLoading(false);
        // Charger les commandes (simulé)
        setOrders(mockOrders);
      }
    };
    
    checkAuth();
  }, [router]);

  // Fonction pour mettre à jour l'état d'une commande
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    const matchesDate = dateFilter ? order.date === dateFilter : true;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

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
          <h1 className="text-2xl font-bold text-orange-300">Gestion des commandes</h1>
          <p className="text-orange-300 font-medium">Suivez et gérez toutes vos commandes</p>
        </div>
      </div>
      
      <div className="enspy-container mt-6">
        {/* Navigation du tableau de bord */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <nav className="flex space-x-4">
            <Link href="/vendor/dashboard" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Tableau de bord
            </Link>
            <Link href="/vendor/products" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Produits
            </Link>
            <Link href="/vendor/orders" className="px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
              Commandes
            </Link>
            <Link href="/vendor/inventory" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Inventaire
            </Link>
            <Link href="/vendor/promotions" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Promotions
            </Link>
            <Link href="/vendor/reports" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Rapports
            </Link>
            <Link href="/vendor/settings" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Paramètres
            </Link>
          </nav>
        </div>
        
        {/* Barre d'actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par ID, client ou email..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <select
              className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tous statuts</option>
              {statuses.map((status, index) => (
                <option key={index} value={status}>{status}</option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="Filtrer par date (MM/YYYY)"
              className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
        
        {/* Liste des commandes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Articles
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.amount} FCFA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="appearance-none bg-transparent pr-8 py-1 pl-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium"
                            style={{ 
                              backgroundColor: 
                                order.status === 'Complétée' ? '#DEF7EC' : 
                                order.status === 'En cours' ? '#E1EFFE' : 
                                order.status === 'En attente' ? '#FEF3C7' : 
                                order.status === 'Annulée' ? '#FEE2E2' : '#F3F4F6',
                              color: 
                                order.status === 'Complétée' ? '#03543E' : 
                                order.status === 'En cours' ? '#1E429F' : 
                                order.status === 'En attente' ? '#92400E' : 
                                order.status === 'Annulée' ? '#9B1C1C' : '#374151'
                            }}
                          >
                            <option value="En attente">En attente</option>
                            <option value="En cours">En cours</option>
                            <option value="Complétée">Complétée</option>
                            <option value="Annulée">Annulée</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link href={`/vendor/orders/${order.id}`} className="text-primary hover:text-primary-dark mr-3">
                          Voir
                        </Link>
                        <button className="text-gray-600 hover:text-gray-900">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      Aucune commande trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredOrders.length}</span> sur <span className="font-medium">{orders.length}</span> commandes
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Précédent
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
