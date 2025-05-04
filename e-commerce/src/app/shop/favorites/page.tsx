'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Types pour les produits
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  vendor: {
    id: string;
    name: string;
  };
  rating: number;
  stock: number;
  discount?: number;
  dateAdded: string;
}

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
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

  // Charger les favoris (simulés)
  useEffect(() => {
    if (isLoggedIn) {
      // Simulation de chargement des données
      setTimeout(() => {
        const mockFavorites: Product[] = [
          {
            id: '1',
            name: 'Cahier de cours ENSPY',
            description: 'Cahier de 200 pages avec couverture rigide, idéal pour les cours d\'ingénierie.',
            price: 2500,
            image: '/images/products/cahier.jpg',
            category: 'Fournitures scolaires',
            vendor: {
              id: 'vendor1',
              name: 'Boutique Fournitures ENSPY'
            },
            rating: 4.5,
            stock: 150,
            discount: 10,
            dateAdded: '2025-04-15T10:30:00'
          },
          {
            id: '2',
            name: 'Manuel d\'Électronique Avancée',
            description: 'Manuel complet couvrant les principes fondamentaux et avancés de l\'électronique.',
            price: 15000,
            image: '/images/products/manuel.jpg',
            category: 'Manuels et papeterie',
            vendor: {
              id: 'vendor2',
              name: 'Librairie Universitaire'
            },
            rating: 5,
            stock: 25,
            dateAdded: '2025-04-10T14:20:00'
          },
          {
            id: '3',
            name: 'T-shirt ENSPY',
            description: 'T-shirt officiel de l\'École Nationale Supérieure Polytechnique de Yaoundé.',
            price: 5000,
            image: '/images/products/tshirt.jpg',
            category: 'Vêtements et accessoires',
            vendor: {
              id: 'vendor3',
              name: 'Boutique ENSPY'
            },
            rating: 4.2,
            stock: 50,
            discount: 0,
            dateAdded: '2025-04-05T09:45:00'
          },
          {
            id: '4',
            name: 'Calculatrice scientifique',
            description: 'Calculatrice scientifique avancée avec fonctions graphiques.',
            price: 12000,
            image: '/images/products/calculatrice.jpg',
            category: 'Fournitures scolaires',
            vendor: {
              id: 'vendor1',
              name: 'Boutique Fournitures ENSPY'
            },
            rating: 4.8,
            stock: 30,
            dateAdded: '2025-04-01T11:10:00'
          }
        ];
        
        setFavorites(mockFavorites);
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  // Retirer un produit des favoris
  const removeFromFavorites = (productId: string) => {
    setFavorites(favorites.filter(product => product.id !== productId));
  };

  // Ajouter au panier
  const addToCart = (product: Product) => {
    // Logique pour ajouter au panier (simulée)
    alert(`${product.name} ajouté au panier !`);
    
    // Dans une application réelle, vous stockeriez cela dans un état global ou localStorage
    if (typeof window !== 'undefined') {
      // Récupérer le panier existant
      const cartString = localStorage.getItem('cart');
      const cart = cartString ? JSON.parse(cartString) : [];
      
      // Vérifier si le produit est déjà dans le panier
      const existingProductIndex = cart.findIndex((item: any) => item.id === product.id);
      
      if (existingProductIndex >= 0) {
        // Augmenter la quantité
        cart[existingProductIndex].quantity += 1;
      } else {
        // Ajouter le nouveau produit
        cart.push({
          ...product,
          quantity: 1
        });
      }
      
      // Sauvegarder le panier
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Émettre un événement pour mettre à jour le compteur du panier
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  // Calculer le prix avec remise
  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(price);
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
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à vos favoris.</p>
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
        <h1 className="text-2xl font-bold text-orange-300 mb-1">Mes Favoris</h1>
        <p className="text-orange-300 mb-6">Retrouvez tous les produits que vous avez ajoutés à vos favoris</p>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucun favori</h2>
            <p className="text-gray-500 mb-6">Vous n'avez pas encore ajouté de produits à vos favoris.</p>
            <Link href="/shop" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Découvrir des produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                <div className="relative h-48">
                  <Link href={`/shop/product/${product.id}`}>
                    <div className="w-full h-full">
                      {product.image ? (
                        product.image.startsWith('data:') ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                          />
                        ) : (
                          <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill
                            className="object-cover group-hover:opacity-90 transition-opacity"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>
                  <button 
                    onClick={() => removeFromFavorites(product.id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-red-50 transition-colors"
                    title="Retirer des favoris"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <Link href={`/shop/product/${product.id}`} className="block">
                    <h3 className="text-lg font-medium text-gray-800 mb-1 hover:text-blue-600 transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{product.vendor.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      {product.discount ? (
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-800">{formatPrice(calculateDiscountedPrice(product.price, product.discount))}</span>
                          <span className="text-sm text-gray-500 line-through ml-2">{formatPrice(product.price)}</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-800">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors"
                      title="Ajouter au panier"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
