'use client';

import { useState } from 'react';
import { api } from '@/lib/api/api';

interface AddToCartButtonProps {
  productId: number;
  stock: number;
  className?: string;
  onSuccess?: () => void;
}

export default function AddToCartButton({ productId, stock, className = '', onSuccess }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si le produit est déjà dans le panier
  const checkIfInCart = async () => {
    try {
      const isProductInCart = await api.cart.isInCart(productId);
      setIsInCart(isProductInCart);
      
      if (isProductInCart) {
        const itemQuantity = await api.cart.getItemQuantity(productId);
        setQuantity(itemQuantity);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du panier:', error);
    }
  };

  // Vérifier au chargement du composant
  useState(() => {
    checkIfInCart();
  });

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleAddToCart = async () => {
    if (quantity <= 0 || quantity > stock) {
      setError('Quantité invalide');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isInCart) {
        // Mettre à jour la quantité si déjà dans le panier
        const cart = await api.cart.getCart();
        const cartItem = cart.items.find(item => item.productId === productId);
        
        if (cartItem) {
          await api.cart.updateCartItem(cartItem.id, quantity);
        }
      } else {
        // Ajouter au panier si pas encore dedans
        await api.cart.addToCart(productId, quantity);
      }

      // Mettre à jour l'état
      setIsInCart(true);
      
      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      setError('Impossible d\'ajouter au panier. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <select
          value={quantity}
          onChange={handleQuantityChange}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          disabled={isLoading || stock <= 0}
        >
          {[...Array(Math.min(10, stock))].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        
        <button
          onClick={handleAddToCart}
          disabled={isLoading || stock <= 0}
          className={`px-4 py-2 rounded-md transition-colors ${
            stock <= 0
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : isInCart
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-primary hover:bg-primary-dark text-white'
          } ${className}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Chargement...
            </span>
          ) : stock <= 0 ? (
            'Rupture de stock'
          ) : isInCart ? (
            'Mettre à jour le panier'
          ) : (
            'Ajouter au panier'
          )}
        </button>
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {stock <= 5 && stock > 0 && (
        <p className="text-amber-600 text-sm">
          Plus que {stock} en stock !
        </p>
      )}
    </div>
  );
}
