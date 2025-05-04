'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api/api'; // Import des APIs

// Définition du type pour un produit dans le panier
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Interface pour le contexte du panier
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  loading: boolean;
}

// Création du contexte avec une valeur par défaut
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider');
  }
  return context;
};

// Props pour le provider
interface CartProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const CartProvider = ({ children }: CartProviderProps) => {
  // État du panier
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger le panier depuis l'API au démarrage
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        // Vérifier si l'utilisateur est connecté
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (isLoggedIn) {
          // Si l'utilisateur est connecté, récupérer le panier depuis l'API
          const cartData = await api.cart.getCart();
          
          if (cartData && cartData.items) {
            // Mapper les données de l'API au format attendu par le composant
            const mappedCartItems = cartData.items.map((item: any) => ({
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.imageUrl || '/images/placeholder.jpg',
              quantity: item.quantity
            }));
            setCartItems(mappedCartItems);
          }
        } else {
          // Si l'utilisateur n'est pas connecté, récupérer le panier depuis le localStorage
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            try {
              setCartItems(JSON.parse(savedCart));
            } catch (error) {
              console.error('Erreur lors du chargement du panier:', error);
              localStorage.removeItem('cart');
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        // En cas d'erreur, essayer de charger depuis le localStorage comme fallback
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (error) {
            console.error('Erreur lors du chargement du panier depuis le localStorage:', error);
            localStorage.removeItem('cart');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Ajouter un produit au panier
  const addToCart = async (product: CartItem) => {
    setLoading(true);
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (isLoggedIn) {
        // Si l'utilisateur est connecté, utiliser l'API
        await api.cart.addToCart(product.id, product.quantity);
        
        // Récupérer le panier mis à jour depuis l'API
        const updatedCart = await api.cart.getCart();
        
        if (updatedCart && updatedCart.items) {
          const mappedCartItems = updatedCart.items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.imageUrl || '/images/placeholder.jpg',
            quantity: item.quantity
          }));
          setCartItems(mappedCartItems);
        }
      } else {
        // Si l'utilisateur n'est pas connecté, utiliser le localStorage
        setCartItems(prevItems => {
          // Vérifier si le produit est déjà dans le panier
          const existingItem = prevItems.find(item => item.id === product.id);
          
          if (existingItem) {
            // Si le produit existe déjà, mettre à jour la quantité
            return prevItems.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + product.quantity }
                : item
            );
          } else {
            // Sinon, ajouter le nouveau produit
            return [...prevItems, product];
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      // En cas d'erreur, ajouter quand même au panier local
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        
        if (existingItem) {
          return prevItems.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + product.quantity }
              : item
          );
        } else {
          return [...prevItems, product];
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un produit du panier
  const removeFromCart = async (productId: number) => {
    setLoading(true);
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (isLoggedIn) {
        // Trouver l'ID de l'élément du panier
        const cartItem = cartItems.find(item => item.id === productId);
        if (cartItem) {
          // Supprimer l'élément du panier via l'API
          await api.cart.removeCartItem(productId);
          
          // Récupérer le panier mis à jour depuis l'API
          const updatedCart = await api.cart.getCart();
          
          if (updatedCart && updatedCart.items) {
            const mappedCartItems = updatedCart.items.map((item: any) => ({
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.imageUrl || '/images/placeholder.jpg',
              quantity: item.quantity
            }));
            setCartItems(mappedCartItems);
          } else {
            setCartItems([]);
          }
        }
      } else {
        // Si l'utilisateur n'est pas connecté, utiliser le localStorage
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du produit du panier:', error);
      // En cas d'erreur, supprimer quand même du panier local
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setLoading(true);
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (isLoggedIn) {
        // Mettre à jour la quantité via l'API
        await api.cart.updateCartItem(productId, quantity);
        
        // Récupérer le panier mis à jour depuis l'API
        const updatedCart = await api.cart.getCart();
        
        if (updatedCart && updatedCart.items) {
          const mappedCartItems = updatedCart.items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.imageUrl || '/images/placeholder.jpg',
            quantity: item.quantity
          }));
          setCartItems(mappedCartItems);
        }
      } else {
        // Si l'utilisateur n'est pas connecté, utiliser le localStorage
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.id === productId 
              ? { ...item, quantity }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
      // En cas d'erreur, mettre à jour quand même le panier local
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === productId 
            ? { ...item, quantity }
            : item
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Vider le panier
  const clearCart = async () => {
    setLoading(true);
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (isLoggedIn) {
        // Vider le panier via l'API
        await api.cart.clearCart();
        setCartItems([]);
      } else {
        // Si l'utilisateur n'est pas connecté, vider le panier local
        setCartItems([]);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      // En cas d'erreur, vider quand même le panier local
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtenir le nombre total d'articles dans le panier
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Obtenir le prix total du panier
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Valeur du contexte
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    loading
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
