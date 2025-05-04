'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VendorInventory() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  
  // Données factices pour la démonstration
  const mockInventory = [
    {
      id: "1",
      name: "Ordinateur portable ENSPY Pro",
      category: "Informatique",
      sku: "LAPTOP-001",
      price: "450000",
      stock: 12,
      status: "En stock"
    },
    {
      id: "2",
      name: "Smartphone ENSPY X",
      category: "Téléphonie",
      sku: "PHONE-001",
      price: "250000",
      stock: 8,
      status: "En stock"
    },
    {
      id: "3",
      name: "Casque audio sans fil",
      category: "Audio",
      sku: "AUDIO-001",
      price: "35000",
      stock: 0,
      status: "Rupture de stock"
    },
    {
      id: "4",
      name: "Imprimante multifonction",
      category: "Informatique",
      sku: "PRINT-001",
      price: "120000",
      stock: 5,
      status: "En stock"
    },
    {
      id: "5",
      name: "Tablette ENSPY Tab",
      category: "Informatique",
      sku: "TABLET-001",
      price: "180000",
      stock: 3,
      status: "Stock faible"
    },
    {
      id: "6",
      name: "Clavier mécanique",
      category: "Périphériques",
      sku: "KEY-001",
      price: "45000",
      stock: 7,
      status: "En stock"
    },
    {
      id: "7",
      name: "Souris gaming",
      category: "Périphériques",
      sku: "MOUSE-001",
      price: "28000",
      stock: 4,
      status: "Stock faible"
    },
    {
      id: "8",
      name: "Écran 27 pouces 4K",
      category: "Informatique",
      sku: "SCREEN-001",
      price: "220000",
      stock: 2,
      status: "Stock faible"
    },
    {
      id: "9",
      name: "Disque dur externe 1TB",
      category: "Stockage",
      sku: "HDD-001",
      price: "65000",
      stock: 10,
      status: "En stock"
    },
    {
      id: "10",
      name: "Routeur Wi-Fi 6",
      category: "Réseaux",
      sku: "NET-001",
      price: "85000",
      stock: 6,
      status: "En stock"
    }
  ];

  // Catégories uniques pour le filtre
  const categories = [...new Set(mockInventory.map(item => item.category))];
  
  // Statuts de stock uniques pour le filtre
  const stockStatuses = [...new Set(mockInventory.map(item => item.status))];

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/auth/login?redirect=/vendor/inventory');
      } else {
        setIsLoading(false);
        // Charger l'inventaire (simulé)
        setInventory(mockInventory);
      }
    };
    
    checkAuth();
  }, [router]);

  // Filtrer l'inventaire
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
    const matchesStock = stockFilter === '' || item.status === stockFilter;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Mettre à jour le stock d'un produit
  const handleUpdateStock = (id: string, newStock: number) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const status = newStock === 0 ? "Rupture de stock" : newStock <= 3 ? "Stock faible" : "En stock";
        return { ...item, stock: newStock, status };
      }
      return item;
    }));
  };

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
          <h1 className="text-2xl font-bold text-orange-300">Gestion de l'inventaire</h1>
          <p className="text-orange-300 font-medium">Suivez et mettez à jour votre stock de produits</p>
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
            <Link href="/vendor/inventory" className="px-3 py-2 rounded-md bg-white text-secondary font-medium relative">
              Inventaire
              <span className="absolute bottom-0 left-0 w-full h-1 bg-secondary-dark"></span>
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
                placeholder="Rechercher par nom ou SKU..."
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Toutes catégories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="">Tous statuts</option>
              {stockStatuses.map((status, index) => (
                <option key={index} value={status}>{status}</option>
              ))}
            </select>
            
            <button 
              className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors flex items-center"
              onClick={() => window.print()}
            >
              <i className="fas fa-print mr-2"></i>
              Imprimer
            </button>
          </div>
        </div>
        
        {/* Tableau d'inventaire */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
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
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.price} FCFA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button 
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => handleUpdateStock(item.id, Math.max(0, item.stock - 1))}
                            disabled={item.stock <= 0}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <input
                            type="number"
                            className="mx-2 w-16 text-center border border-gray-300 rounded-md"
                            value={item.stock}
                            onChange={(e) => handleUpdateStock(item.id, parseInt(e.target.value) || 0)}
                            min="0"
                          />
                          <button 
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => handleUpdateStock(item.id, item.stock + 1)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'En stock' 
                            ? 'bg-green-100 text-green-800' 
                            : item.status === 'Stock faible' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link href={`/vendor/products/edit/${item.id}`} className="text-primary hover:text-primary-dark mr-3">
                          Modifier
                        </Link>
                        <button 
                          className="text-primary hover:text-primary-dark"
                          onClick={() => {
                            const newStock = prompt(`Entrez le nouveau stock pour ${item.name}:`, item.stock.toString());
                            if (newStock !== null) {
                              handleUpdateStock(item.id, parseInt(newStock) || 0);
                            }
                          }}
                        >
                          Ajuster
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      Aucun produit trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredInventory.length}</span> sur <span className="font-medium">{inventory.length}</span> produits
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
