'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewPromotion() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // États pour le formulaire
  const [promotionData, setPromotionData] = useState({
    name: '',
    type: 'percentage',
    value: '',
    products: 'all',
    specificProducts: [],
    categories: [],
    startDate: '',
    endDate: '',
    description: '',
    minPurchase: '',
    maxUses: '',
    userLimit: '1',
    status: 'active'
  });
  
  // Données factices pour les produits et catégories
  const mockProducts = [
    { id: "1", name: "Ordinateur portable ENSPY Pro", category: "Informatique" },
    { id: "2", name: "Smartphone ENSPY X", category: "Téléphonie" },
    { id: "3", name: "Casque audio sans fil", category: "Audio" },
    { id: "4", name: "Imprimante multifonction", category: "Informatique" },
    { id: "5", name: "Tablette ENSPY Tab", category: "Informatique" },
    { id: "6", name: "Clavier mécanique", category: "Périphériques" },
    { id: "7", name: "Souris gaming", category: "Périphériques" },
    { id: "8", name: "Écran 27 pouces 4K", category: "Informatique" }
  ];
  
  const categories = [...new Set(mockProducts.map(product => product.category))];

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/auth/login?redirect=/vendor/promotions/new');
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPromotionData({
      ...promotionData,
      [name]: value
    });
  };
  
  // Gérer la sélection des produits spécifiques
  const handleProductSelection = (productId: string) => {
    const updatedProducts = [...promotionData.specificProducts];
    
    if (updatedProducts.includes(productId)) {
      // Supprimer le produit s'il est déjà sélectionné
      const index = updatedProducts.indexOf(productId);
      updatedProducts.splice(index, 1);
    } else {
      // Ajouter le produit s'il n'est pas déjà sélectionné
      updatedProducts.push(productId);
    }
    
    setPromotionData({
      ...promotionData,
      specificProducts: updatedProducts
    });
  };
  
  // Gérer la sélection des catégories
  const handleCategorySelection = (category: string) => {
    const updatedCategories = [...promotionData.categories];
    
    if (updatedCategories.includes(category)) {
      // Supprimer la catégorie si elle est déjà sélectionnée
      const index = updatedCategories.indexOf(category);
      updatedCategories.splice(index, 1);
    } else {
      // Ajouter la catégorie si elle n'est pas déjà sélectionnée
      updatedCategories.push(category);
    }
    
    setPromotionData({
      ...promotionData,
      categories: updatedCategories
    });
  };
  
  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la liste des promotions
      router.push('/vendor/promotions');
    } catch (error) {
      console.error('Erreur lors de la création de la promotion:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-2xl font-bold">Créer une nouvelle promotion</h1>
          <p className="text-white/80">Définissez les détails de votre offre spéciale</p>
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
            <Link href="/vendor/orders" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Commandes
            </Link>
            <Link href="/vendor/inventory" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Inventaire
            </Link>
            <Link href="/vendor/promotions" className="px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
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
        
        {/* Formulaire de création de promotion */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne de gauche - Informations principales */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-semibold mb-4">Informations de la promotion</h2>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la promotion*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={promotionData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={promotionData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Type de remise*
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={promotionData.type}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="percentage">Pourcentage (%)</option>
                      <option value="fixed">Montant fixe (FCFA)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                      Valeur*
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="value"
                        name="value"
                        value={promotionData.value}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">
                          {promotionData.type === 'percentage' ? '%' : 'FCFA'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début*
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={promotionData.startDate}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin*
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={promotionData.endDate}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="minPurchase" className="block text-sm font-medium text-gray-700 mb-1">
                      Montant minimum d'achat (FCFA)
                    </label>
                    <input
                      type="number"
                      id="minPurchase"
                      name="minPurchase"
                      value={promotionData.minPurchase}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="maxUses" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre maximum d'utilisations
                    </label>
                    <input
                      type="number"
                      id="maxUses"
                      name="maxUses"
                      value={promotionData.maxUses}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Laissez vide pour un nombre illimité d'utilisations
                    </p>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="userLimit" className="block text-sm font-medium text-gray-700 mb-1">
                    Limite par utilisateur
                  </label>
                  <input
                    type="number"
                    id="userLimit"
                    name="userLimit"
                    value={promotionData.userLimit}
                    onChange={handleChange}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Colonne de droite - Produits et statut */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Produits et statut</h2>
                
                <div>
                  <label htmlFor="products" className="block text-sm font-medium text-gray-700 mb-1">
                    Appliquer à
                  </label>
                  <select
                    id="products"
                    name="products"
                    value={promotionData.products}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">Tous les produits</option>
                    <option value="specific">Produits spécifiques</option>
                    <option value="categories">Catégories spécifiques</option>
                  </select>
                </div>
                
                {promotionData.products === 'specific' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sélectionner les produits
                    </label>
                    <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto p-2">
                      {mockProducts.map((product) => (
                        <div key={product.id} className="flex items-center py-2 border-b border-gray-200 last:border-0">
                          <input
                            type="checkbox"
                            id={`product-${product.id}`}
                            checked={promotionData.specificProducts.includes(product.id)}
                            onChange={() => handleProductSelection(product.id)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor={`product-${product.id}`} className="ml-3 block text-sm text-gray-700">
                            <span className="font-medium">{product.name}</span>
                            <span className="text-gray-500 text-xs block">{product.category}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {promotionData.products === 'categories' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sélectionner les catégories
                    </label>
                    <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto p-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center py-2 border-b border-gray-200 last:border-0">
                          <input
                            type="checkbox"
                            id={`category-${category}`}
                            checked={promotionData.categories.includes(category)}
                            onChange={() => handleCategorySelection(category)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor={`category-${category}`} className="ml-3 block text-sm text-gray-700">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={promotionData.status}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="scheduled">Planifiée</option>
                    <option value="draft">Brouillon</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Les promotions en brouillon ne sont pas visibles pour les clients
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <Link
                href="/vendor/promotions"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Création en cours...
                  </>
                ) : (
                  'Créer la promotion'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
