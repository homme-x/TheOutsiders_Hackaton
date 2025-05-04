'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';

export default function Cart() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  
  // État pour la modale de confirmation
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Calcul du sous-total
  const subtotal = getTotalPrice();
  
  // Frais de livraison
  const shippingFee = cartItems.length > 0 ? 500 : 0;
  
  // Total de la commande
  const total = subtotal + shippingFee;

  // Interface pour les props du Modal de confirmation
  interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  // Composant Modal de confirmation
  const ConfirmModal = ({ isOpen, onClose, onConfirm }: ConfirmModalProps) => {
    if (!isOpen) return null;
    
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 bg-red-500 text-white">
            <h3 className="text-lg font-semibold">Vider le panier</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700">Êtes-vous sûr de vouloir vider votre panier ? Cette action ne peut pas être annulée.</p>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
            <button 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              onClick={onClose}
            >
              Annuler
            </button>
            <button 
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Vider le panier
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  // Fonction pour confirmer le vidage du panier
  const handleClearCart = () => {
    setShowConfirmModal(true);
  };

  // Fonction pour gérer le passage à la caisse
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Votre panier est vide !');
      return;
    }
    router.push('/shop/checkout');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-8 bg-gray-50 min-h-screen"
    >
      <div className="enspy-container max-w-7xl mx-auto px-4">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold mb-8 text-gray-900"
        >
          Votre Panier
        </motion.h1>

        <AnimatePresence mode="wait">
          {cartItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12 bg-white rounded-xl shadow-sm"
            >
              <div className="bg-primary/10 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Votre panier est vide</h2>
              <p className="text-gray-600 mb-6">
                Parcourez notre boutique et ajoutez des produits à votre panier.
              </p>
              <Link 
                href="/shop" 
                className="btn-primary inline-block px-8 py-3 rounded-full transition-transform hover:scale-105"
              >
                Continuer les achats
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md"
                    >
                      <div className="flex items-center gap-6">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link 
                            href={`/shop/products/${item.id}`} 
                            className="text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          <div className="mt-4 flex items-center gap-6">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                            <div className="text-gray-600">
                              {item.price.toLocaleString()} FCFA
                            </div>
                            <div className="font-medium text-primary">
                              {(item.price * item.quantity).toLocaleString()} FCFA
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="mt-8 flex justify-between items-center">
                  <Link 
                    href="/shop" 
                    className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continuer les achats
                  </Link>
                  <button
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-700 flex items-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Vider le panier
                  </button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h2 className="text-xl font-bold mb-6 text-gray-900">Résumé de la commande</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total</span>
                      <span className="font-medium text-gray-900">{subtotal.toLocaleString()} FCFA</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Frais de livraison</span>
                      <span className="font-medium text-gray-900">{shippingFee.toLocaleString()} FCFA</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-bold">Total</span>
                        <span className="text-primary text-2xl font-bold">{total.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="btn-primary w-full py-4 mt-8 text-center rounded-full text-lg font-medium transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cartItems.length === 0}
                  >
                    Passer à la caisse
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h3 className="font-semibold mb-4 text-gray-900">Modes de paiement acceptés</h3>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-gray-50 px-6 py-3 rounded-full text-sm text-gray-600">
                      <span>Carte bancaire</span>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 rounded-full text-sm text-gray-600">
                      <span>Espèces</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Modal de confirmation pour vider le panier */}
      <AnimatePresence>
        {showConfirmModal && (
          <ConfirmModal 
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={clearCart}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
