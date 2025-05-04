'use client';

import { useState, useEffect } from 'react';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  vendorId: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  paymentStatus: 'paid' | 'pending' | 'failed';
  shippingAddress: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    // Simuler le chargement des commandes (à remplacer par un appel API)
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'CMD-2025-001',
        customerName: 'Thomas Anderson',
        customerEmail: 'thomas@example.com',
        status: 'pending',
        totalAmount: 75000,
        items: [
          {
            id: '1',
            productName: 'Smartphone XYZ',
            quantity: 1,
            price: 75000,
            vendorId: 'v1'
          }
        ],
        paymentStatus: 'paid',
        shippingAddress: '123 Rue Principale, Yaoundé',
        createdAt: '2025-05-03'
      },
      {
        id: '2',
        orderNumber: 'CMD-2025-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        status: 'processing',
        totalAmount: 45000,
        items: [
          {
            id: '2',
            productName: 'Écouteurs Bluetooth',
            quantity: 2,
            price: 22500,
            vendorId: 'v2'
          }
        ],
        paymentStatus: 'paid',
        shippingAddress: '456 Avenue Centrale, Douala',
        createdAt: '2025-05-03'
      },
    ];
    setOrders(mockOrders);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const getStatusBadgeColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des Commandes</h1>
          <p className="mt-2 text-sm text-gray-700">
            Consultez et gérez toutes les commandes de la plateforme.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        {/* Filtres et recherche */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher une commande..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="processing">En traitement</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                      {order.status === 'pending' ? 'En attente' :
                       order.status === 'processing' ? 'En traitement' :
                       order.status === 'shipped' ? 'Expédiée' :
                       order.status === 'delivered' ? 'Livrée' :
                       'Annulée'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.totalAmount.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDetailsModalOpen(true);
                      }}
                      className="text-primary hover:text-primary-dark mr-4"
                    >
                      Détails
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="pending">En attente</option>
                      <option value="processing">En traitement</option>
                      <option value="shipped">Expédiée</option>
                      <option value="delivered">Livrée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de détails de la commande */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900">
                Détails de la commande {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Fermer</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 space-y-6">
              <div className="border-t border-gray-200 pt-4">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Client</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedOrder.customerName}<br />
                      {selectedOrder.customerEmail}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Adresse de livraison</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedOrder.shippingAddress}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Statut du paiement</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedOrder.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : selectedOrder.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedOrder.paymentStatus === 'paid' ? 'Payé' :
                         selectedOrder.paymentStatus === 'pending' ? 'En attente' : 'Échoué'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Montant total</dt>
                    <dd className="mt-1 text-sm text-gray-900">{selectedOrder.totalAmount.toLocaleString()} FCFA</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">Articles commandés</h4>
                <ul className="mt-4 divide-y divide-gray-200">
                  {selectedOrder.items.map((item) => (
                    <li key={item.id} className="py-4 flex">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-medium text-gray-900">{item.productName}</h5>
                          <p className="text-sm font-medium text-gray-900">
                            {(item.price * item.quantity).toLocaleString()} FCFA
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <p>Qté : {item.quantity}</p>
                          <p>{item.price.toLocaleString()} FCFA/unité</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
