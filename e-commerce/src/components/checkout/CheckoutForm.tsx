'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/api';

interface CheckoutFormProps {
  onSuccess?: (orderNumber: string) => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState<{ min: number; max: number } | null>(null);

  // Formulaire de commande
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Cameroun',
    phone: '',
    paymentMethod: 'cash',
    note: ''
  });

  // Charger le panier au chargement du composant
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await api.cart.getCart();
        setCart(cartData);
        
        if (cartData.items.length === 0) {
          router.push('/shop');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        setError('Impossible de charger votre panier. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Calculer les frais de livraison si l'adresse est complète
    if (['address', 'city', 'postalCode', 'country'].includes(name) && 
        formData.address && formData.city && formData.postalCode && formData.country) {
      calculateShipping();
    }
  };

  // Calculer les frais de livraison
  const calculateShipping = async () => {
    if (!formData.address || !formData.city || !formData.postalCode || !formData.country) {
      return;
    }

    try {
      const shippingData = await api.orders.calculateShipping({
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone
      });

      setShippingCost(shippingData.shippingCost);
      setEstimatedDelivery(shippingData.estimatedDelivery);
    } catch (error) {
      console.error('Erreur lors du calcul des frais de livraison:', error);
    }
  };

  // Vérifier la disponibilité des produits
  const checkAvailability = async () => {
    if (!cart || cart.items.length === 0) {
      return false;
    }

    try {
      const items = cart.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      const availabilityData = await api.orders.checkAvailability(items);
      
      if (!availabilityData.available) {
        const unavailableItems = availabilityData.unavailableItems || [];
        setError(`Certains produits ne sont plus disponibles en quantité suffisante: ${
          unavailableItems.map(item => `${item.name} (demandé: ${item.requestedQuantity}, disponible: ${item.availableQuantity})`).join(', ')
        }`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      setError('Impossible de vérifier la disponibilité des produits. Veuillez réessayer.');
      return false;
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    if (!formData.fullName) {
      setError('Veuillez entrer votre nom complet');
      return false;
    }
    if (!formData.address) {
      setError('Veuillez entrer votre adresse');
      return false;
    }
    if (!formData.city) {
      setError('Veuillez entrer votre ville');
      return false;
    }
    if (!formData.postalCode) {
      setError('Veuillez entrer votre code postal');
      return false;
    }
    if (!formData.phone) {
      setError('Veuillez entrer votre numéro de téléphone');
      return false;
    }
    return true;
  };

  // Soumettre la commande
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Vérifier la disponibilité des produits
      const available = await checkAvailability();
      if (!available) {
        setSubmitting(false);
        return;
      }

      // Créer la commande
      const orderData = {
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        note: formData.note
      };

      const order = await api.orders.createFromCart(orderData);

      // Rediriger vers la page de confirmation
      if (onSuccess) {
        onSuccess(order.orderNumber);
      } else {
        router.push(`/checkout/success?order=${order.orderNumber}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      setError('Impossible de créer la commande. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
        <p className="mb-6">Ajoutez des produits à votre panier avant de passer commande.</p>
        <button 
          onClick={() => router.push('/shop')}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          Continuer vos achats
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Informations de livraison */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold mb-4">Informations de livraison</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet*
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse*
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Ville*
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Code postal*
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Pays*
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="Cameroun">Cameroun</option>
                <option value="Congo">Congo</option>
                <option value="Gabon">Gabon</option>
                <option value="Tchad">Tchad</option>
                <option value="République centrafricaine">République centrafricaine</option>
                <option value="Guinée équatoriale">Guinée équatoriale</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone*
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
              Note (facultatif)
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            ></textarea>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Mode de paiement</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === 'cash'}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              <span>Paiement à la livraison</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="momo"
                checked={formData.paymentMethod === 'momo'}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              <span>Mobile Money</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              <span>Carte bancaire</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Récapitulatif de la commande */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Récapitulatif de la commande</h2>
        
        <div className="space-y-4">
          <div className="max-h-[300px] overflow-y-auto space-y-4">
            {cart.items.map((item: any) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0"></div>
                <div className="flex-grow">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm">Quantité: {item.quantity}</p>
                </div>
                <div className="font-semibold">
                  {item.product.price * item.quantity} FCFA
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{cart.total} FCFA</span>
            </div>
            
            <div className="flex justify-between">
              <span>Frais de livraison</span>
              <span>{shippingCost} FCFA</span>
            </div>
            
            {estimatedDelivery && (
              <div className="text-sm text-gray-600">
                Livraison estimée: {estimatedDelivery.min}-{estimatedDelivery.max} jours
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{cart.total + shippingCost} FCFA</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-6 bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400"
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement en cours...
            </span>
          ) : (
            'Confirmer la commande'
          )}
        </button>
      </div>
    </form>
  );
}
