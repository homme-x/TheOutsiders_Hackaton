'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AvailabilityToggle from '@/components/vendor/AvailabilityToggle';
import { motion, AnimatePresence } from 'framer-motion';

// Composant pour les statistiques
const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className={`rounded-full w-12 h-12 flex items-center justify-center ${color}`}>
      <i className={`fas ${icon} text-white text-xl`}></i>
    </div>
    <div className="ml-4">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

// Composant pour les actions rapides
const ActionCard = ({ title, description, link, icon }: { title: string, description: string, link: string, icon: string }) => (
  <Link href={link} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center mb-4">
      <i className={`fas ${icon} text-primary text-xl`}></i>
      <h3 className="ml-2 text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm">{description}</p>
  </Link>
);

// Tableau des commandes récentes
const RecentOrdersTable = ({ orders }: { orders: any[] }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold">Commandes récentes</h2>
    </div>
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
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.amount} FCFA
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'Complétée' 
                      ? 'bg-green-100 text-green-800' 
                      : order.status === 'En attente' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link href={`/vendor/orders/${order.id}`} className="text-primary hover:text-primary-dark">
                    Voir détails
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                Aucune commande récente
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <div className="p-4 border-t border-gray-200 text-right">
      <Link href="/vendor/orders" className="text-primary hover:text-primary-dark text-sm font-medium">
        Voir toutes les commandes →
      </Link>
    </div>
  </div>
);

export default function VendorDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Données fictives pour la démo
  const stats = [
    { title: 'Ventes du mois', value: '125 000 FCFA', icon: 'fa-chart-line', color: 'bg-primary' },
    { title: 'Commandes', value: '24', icon: 'fa-shopping-cart', color: 'bg-secondary' },
    { title: 'Produits', value: '18', icon: 'fa-box', color: 'bg-accent' },
    { title: 'Clients', value: '45', icon: 'fa-users', color: 'bg-success' },
  ];
  
  const quickActions = [
    { title: 'Ajouter un produit', description: 'Créez et publiez un nouveau produit', link: '/vendor/products/new', icon: 'fa-plus-circle' },
    { title: 'Gérer l\'inventaire', description: 'Mettez à jour les stocks de vos produits', link: '/vendor/inventory', icon: 'fa-boxes' },
    { title: 'Créer une promotion', description: 'Offrez des réductions sur vos produits', link: '/vendor/promotions/new', icon: 'fa-tag' },
    { title: 'Voir les rapports', description: 'Analysez vos performances de vente', link: '/vendor/reports', icon: 'fa-chart-bar' },
  ];
  
  const [recentOrders, setRecentOrders] = useState([
    { id: 1024, customer: 'Thomas K.', date: '15/04/2025', amount: '15 000', status: 'En attente', products: 3 },
    { id: 1023, customer: 'Sophie M.', date: '14/04/2025', amount: '7 500', status: 'Complétée', products: 2 },
    { id: 1022, customer: 'Jean P.', date: '12/04/2025', amount: '22 000', status: 'Complétée', products: 4 },
    { id: 1021, customer: 'Marie L.', date: '10/04/2025', amount: '5 000', status: 'Annulée', products: 1 },
    { id: 1020, customer: 'Paul D.', date: '08/04/2025', amount: '12 500', status: 'Complétée', products: 3 },
  ]);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (!isLoggedIn) {
        router.push('/auth/login?redirect=/vendor/dashboard');
      } else {
        setIsLoading(false);
        
        // Vérifier s'il y a des notifications vendeur
        const hasNotifications = localStorage.getItem('vendorNotifications') === 'true';
        if (hasNotifications) {
          // Marquer les notifications comme lues
          localStorage.removeItem('vendorNotifications');
          setHasNewOrders(true);
          setNotificationMessage('Vous avez de nouvelles commandes à traiter !');  
          setShowNotification(true);
          
          // Cacher la notification après 5 secondes
          setTimeout(() => {
            setShowNotification(false);
          }, 5000);
        }
      }
    };
    
    checkAuth();
  }, [router]);

  // Simuler l'arrivée de nouvelles commandes
  useEffect(() => {
    // Pour la démo, on simule l'arrivée de nouvelles commandes toutes les 45 secondes
    const interval = setInterval(() => {
      // 30% de chance de recevoir une nouvelle commande
      if (Math.random() < 0.3) {
        localStorage.setItem('vendorNotifications', 'true');
        setHasNewOrders(true);
        setNotificationMessage('Nouvelle commande reçue !'); 
        setShowNotification(true);
        
        // Ajouter une nouvelle commande fictive en haut de la liste
        setRecentOrders(prevOrders => [
          {
            id: Math.floor(Math.random() * 1000) + 100,
            customer: 'Nouveau Client',
            date: new Date().toLocaleDateString(),
            amount: Math.floor(Math.random() * 20000) + 1000,
            status: 'En attente',
            products: Math.floor(Math.random() * 5) + 1,
          },
          ...prevOrders.slice(0, 4) // Garder seulement les 5 commandes les plus récentes
        ]);
        
        // Cacher la notification après 5 secondes
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
    }, 45000); // Toutes les 45 secondes
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 relative">
      {/* Notification toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{notificationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* En-tête du tableau de bord */}
      <div className="bg-primary text-white py-6">
        <div className="enspy-container">
          <h1 className="text-2xl font-bold text-orange-300">Tableau de bord vendeur</h1>
          <p className="text-orange-300 font-medium">Gérez votre boutique et suivez vos performances</p>
        </div>
      </div>
      
      <div className="enspy-container mt-6">
        {/* Alerte pour les nouvelles commandes */}
        {hasNewOrders && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Vous avez de nouvelles commandes à traiter ! Consultez la liste ci-dessous.  
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setHasNewOrders(false)}
                    className="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none"
                  >
                    <span className="sr-only">Fermer</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Statut de disponibilité */}
        <div className="mb-6">
          <AvailabilityToggle 
            onStatusChange={(isAvailable) => {
              // Dans une application réelle, vous pourriez mettre à jour l'interface utilisateur
              // ou envoyer une notification
              console.log('Statut de disponibilité changé:', isAvailable);
            }} 
          />
        </div>
        
        {/* Navigation du tableau de bord */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <nav className="flex flex-wrap space-x-1 md:space-x-4">
            <Link href="/vendor/dashboard" className="px-3 py-2 rounded-md bg-white text-secondary font-medium relative">
              Tableau de bord
              <span className="absolute bottom-0 left-0 w-full h-1 bg-secondary-dark"></span>
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
            <Link href="/vendor/messages" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Messagerie
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
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
        
        {/* Actions rapides */}
        <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <ActionCard 
              key={index}
              title={action.title}
              description={action.description}
              link={action.link}
              icon={action.icon}
            />
          ))}
        </div>
        
        {/* Commandes récentes */}
        <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
        <RecentOrdersTable orders={recentOrders} />
      </div>
    </div>
  );
}
