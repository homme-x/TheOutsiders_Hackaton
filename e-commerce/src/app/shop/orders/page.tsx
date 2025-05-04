'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Orders() {
  // État pour le filtrage des commandes
  const [statusFilter, setStatusFilter] = useState('all');

  // Commandes fictives pour la démo
  const orders = [
    {
      id: 'CMD-2025-001',
      date: '03/05/2025',
      status: 'pending',
      total: 18000,
      paymentMethod: 'cash',
      items: [
        { id: 1, name: 'Cahier ENSPY', price: 1500, quantity: 2 },
        { id: 3, name: 'Calculatrice scientifique', price: 15000, quantity: 1 },
      ]
    },
    {
      id: 'CMD-2025-002',
      date: '01/05/2025',
      status: 'confirmed',
      total: 5000,
      paymentMethod: 'card',
      items: [
        { id: 2, name: 'T-shirt ENSPY', price: 5000, quantity: 1 },
      ]
    },
    {
      id: 'CMD-2025-003',
      date: '28/04/2025',
      status: 'shipped',
      total: 10500,
      paymentMethod: 'card',
      items: [
        { id: 6, name: 'Casquette ENSPY', price: 3500, quantity: 1 },
        { id: 5, name: 'Manuel d\'algorithmique', price: 8000, quantity: 1 },
        { id: 7, name: 'Bouteille d\'eau', price: 500, quantity: 1 },
      ]
    },
    {
      id: 'CMD-2025-004',
      date: '25/04/2025',
      status: 'cancelled',
      total: 2000,
      paymentMethod: 'cash',
      items: [
        { id: 8, name: 'Billet soirée d\'intégration', price: 2000, quantity: 1 },
      ]
    },
  ];

  // Filtrer les commandes par statut
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  // Fonction pour obtenir le libellé du statut en français
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'shipped':
        return 'Expédiée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  // Fonction pour obtenir la couleur du badge de statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-8">
      <div className="enspy-container">
        <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>

        {/* Filtres */}
        <div className="bg-gray-light p-4 rounded-lg mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-md ${
                statusFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-dark hover:bg-gray'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-md ${
                statusFilter === 'pending'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-dark hover:bg-gray'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-4 py-2 rounded-md ${
                statusFilter === 'confirmed'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-dark hover:bg-gray'
              }`}
            >
              Confirmées
            </button>
            <button
              onClick={() => setStatusFilter('shipped')}
              className={`px-4 py-2 rounded-md ${
                statusFilter === 'shipped'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-dark hover:bg-gray'
              }`}
            >
              Expédiées
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-4 py-2 rounded-md ${
                statusFilter === 'cancelled'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-dark hover:bg-gray'
              }`}
            >
              Annulées
            </button>
          </div>
        </div>

        {/* Liste des commandes */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-light rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Aucune commande trouvée</h2>
            <p className="text-gray-dark mb-6">
              Vous n&apos;avez pas encore de commande avec ce statut.
            </p>
            <Link href="/shop" className="btn-primary inline-block px-6 py-3">
              Parcourir la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="card overflow-hidden">
                {/* En-tête de la commande */}
                <div className="bg-gray-light p-4 border-b border-gray flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <span className="font-bold">Commande {order.id}</span>
                    <span className="text-gray-dark ml-4">Passée le {order.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                    <Link href={`/shop/orders/${order.id}`} className="text-primary hover:underline">
                      Voir les détails
                    </Link>
                  </div>
                </div>
                
                {/* Contenu de la commande */}
                <div className="p-4">
                  <div className="mb-4">
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={`${order.id}-${item.id}`} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-dark ml-2">x{item.quantity}</span>
                          </div>
                          <span>{item.price * item.quantity} FCFA</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray pt-4 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <span className="text-gray-dark">Mode de paiement: </span>
                      <span className="font-medium">
                        {order.paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces'}
                      </span>
                    </div>
                    <div className="font-bold text-lg">
                      <span className="text-gray-dark mr-2">Total:</span>
                      <span className="text-primary">{order.total} FCFA</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="bg-gray-light p-4 border-t border-gray flex justify-end">
                  {order.status === 'pending' && (
                    <button className="text-red-500 hover:text-red-700">
                      Annuler la commande
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <button className="text-primary hover:text-primary-dark">
                      Confirmer la réception
                    </button>
                  )}
                  {(order.status === 'shipped' || order.status === 'confirmed') && (
                    <button className="ml-4 text-primary hover:text-primary-dark">
                      Contacter le vendeur
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
