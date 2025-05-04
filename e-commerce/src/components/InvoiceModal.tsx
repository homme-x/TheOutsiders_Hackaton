import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
  onDownload: () => void;
  invoiceData: {
    customerName: string;
    email: string;
    phone: string;
    date: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    shippingFee: number;
    total: number;
    paymentMethod: string;
  };
}

export default function InvoiceModal({ isOpen, onClose, onPrint, onDownload, invoiceData }: InvoiceModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* En-tête de la modale */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Facture</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenu de la facture */}
          <div className="p-6" id="invoice-content">
            {/* En-tête de la facture */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-center text-primary mb-4">FACTURE</h1>
              <div className="text-gray-600">
                <p className="font-semibold">Date: {invoiceData.date}</p>
                <p className="font-semibold mt-4">Client:</p>
                <p>{invoiceData.customerName}</p>
                <p>{invoiceData.email}</p>
                <p>{invoiceData.phone}</p>
              </div>
            </div>

            {/* Tableau des articles */}
            <div className="mb-8">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600">Article</th>
                    <th className="px-4 py-2 text-center text-gray-600">Quantité</th>
                    <th className="px-4 py-2 text-right text-gray-600">Prix unitaire</th>
                    <th className="px-4 py-2 text-right text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoiceData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">{item.price.toLocaleString()} FCFA</td>
                      <td className="px-4 py-2 text-right">{(item.price * item.quantity).toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Résumé des coûts */}
            <div className="mb-8 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total:</span>
                <span>{invoiceData.subtotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frais de livraison:</span>
                <span>{invoiceData.shippingFee.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary">{invoiceData.total.toLocaleString()} FCFA</span>
              </div>
            </div>

            {/* Informations de paiement */}
            <div className="mb-8">
              <p className="font-semibold">Mode de paiement:</p>
              <p>{invoiceData.paymentMethod}</p>
            </div>

            {/* Mentions légales */}
            <div className="text-sm text-gray-500 border-t pt-4">
              <p>Merci de votre confiance !</p>
              <p>Pour toute question, contactez-nous à support@enspy-store.com</p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              onClick={onPrint}
              className="btn-secondary py-2 px-4 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimer
            </button>
            <button
              onClick={onDownload}
              className="btn-primary py-2 px-4 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger PDF
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
