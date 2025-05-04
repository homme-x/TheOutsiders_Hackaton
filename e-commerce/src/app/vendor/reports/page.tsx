'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Composant pour les cartes de statistiques
const StatCard = ({ title, value, icon, color, percentage, isUp }: { 
  title: string, 
  value: string, 
  icon: string, 
  color: string,
  percentage?: string,
  isUp?: boolean
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        {percentage && (
          <p className={`text-sm mt-2 flex items-center ${isUp ? 'text-green-600' : 'text-red-600'}`}>
            <span className="mr-1">
              {isUp ? <i className="fas fa-arrow-up"></i> : <i className="fas fa-arrow-down"></i>}
            </span>
            {percentage} par rapport au mois dernier
          </p>
        )}
      </div>
      <div className={`rounded-full w-12 h-12 flex items-center justify-center ${color}`}>
        <i className={`fas ${icon} text-white text-xl`}></i>
      </div>
    </div>
  </div>
);

export default function VendorReports() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [reportType, setReportType] = useState('sales');
  
  // Données factices pour les statistiques
  const stats = {
    sales: "125,000 FCFA",
    salesPercentage: "12.5%",
    salesIsUp: true,
    orders: "24",
    ordersPercentage: "8.2%",
    ordersIsUp: true,
    customers: "18",
    customersPercentage: "5.3%",
    customersIsUp: false,
    avgOrder: "5,208 FCFA",
    avgOrderPercentage: "3.7%",
    avgOrderIsUp: true
  };
  
  // Données factices pour le graphique des ventes mensuelles
  const monthlySales = [
    { month: 'Jan', amount: 85000 },
    { month: 'Fév', amount: 92000 },
    { month: 'Mar', amount: 105000 },
    { month: 'Avr', amount: 110000 },
    { month: 'Mai', amount: 125000 },
    { month: 'Juin', amount: 0 },
    { month: 'Juil', amount: 0 },
    { month: 'Août', amount: 0 },
    { month: 'Sep', amount: 0 },
    { month: 'Oct', amount: 0 },
    { month: 'Nov', amount: 0 },
    { month: 'Déc', amount: 0 }
  ];
  
  // Données factices pour les produits les plus vendus
  const topProducts = [
    { id: "1", name: "Ordinateur portable ENSPY Pro", sales: 5, amount: "2,250,000 FCFA" },
    { id: "2", name: "Smartphone ENSPY X", sales: 7, amount: "1,750,000 FCFA" },
    { id: "5", name: "Tablette ENSPY Tab", sales: 3, amount: "540,000 FCFA" },
    { id: "4", name: "Imprimante multifonction", sales: 2, amount: "240,000 FCFA" },
    { id: "8", name: "Écran 27 pouces 4K", sales: 1, amount: "220,000 FCFA" }
  ];

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/auth/login?redirect=/vendor/reports');
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

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
          <h1 className="text-2xl font-bold text-orange-300">Rapports et statistiques</h1>
          <p className="text-orange-300 font-medium">Analysez les performances de votre boutique</p>
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
            <Link href="/vendor/reports" className="px-3 py-2 rounded-md bg-white text-secondary font-medium relative">
              Rapports
              <span className="absolute bottom-0 left-0 w-full h-1 bg-secondary-dark"></span>
            </Link>
            <Link href="/vendor/settings" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Paramètres
            </Link>
          </nav>
        </div>
        
        {/* Filtres et sélection de rapport */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-md ${reportType === 'sales' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setReportType('sales')}
            >
              Ventes
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${reportType === 'products' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setReportType('products')}
            >
              Produits
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${reportType === 'customers' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setReportType('customers')}
            >
              Clients
            </button>
          </div>
          
          <div className="flex space-x-2">
            <select
              className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="day">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
              <option value="custom">Personnalisé</option>
            </select>
            
            <button 
              className="bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors flex items-center"
              onClick={() => window.print()}
            >
              <i className="fas fa-download mr-2"></i>
              Exporter
            </button>
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard 
            title="Ventes totales" 
            value={stats.sales} 
            icon="fa-chart-line" 
            color="bg-primary"
            percentage={stats.salesPercentage}
            isUp={stats.salesIsUp}
          />
          <StatCard 
            title="Commandes" 
            value={stats.orders} 
            icon="fa-shopping-cart" 
            color="bg-blue-500"
            percentage={stats.ordersPercentage}
            isUp={stats.ordersIsUp}
          />
          <StatCard 
            title="Clients" 
            value={stats.customers} 
            icon="fa-users" 
            color="bg-green-500"
            percentage={stats.customersPercentage}
            isUp={stats.customersIsUp}
          />
          <StatCard 
            title="Panier moyen" 
            value={stats.avgOrder} 
            icon="fa-shopping-basket" 
            color="bg-purple-500"
            percentage={stats.avgOrderPercentage}
            isUp={stats.avgOrderIsUp}
          />
        </div>
        
        {/* Graphique des ventes */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Évolution des ventes</h2>
          <div className="h-64 w-full">
            <div className="flex h-full items-end">
              {monthlySales.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary-light rounded-t" 
                    style={{ 
                      height: `${item.amount ? (item.amount / 125000) * 80 : 0}%`,
                      minHeight: item.amount ? '4px' : '0'
                    }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2">{item.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Produits les plus vendus */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Produits les plus vendus</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité vendue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/vendor/products/edit/${product.id}`} className="text-primary hover:text-primary-dark">
                        Voir détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
