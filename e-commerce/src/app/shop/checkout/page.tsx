'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Image from 'next/image';
import type { UserOptions } from 'jspdf-autotable';
import InvoiceModal from '@/components/InvoiceModal';

// Étendre l'interface jsPDF pour inclure autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => void;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export default function Checkout() {
  // État des informations de livraison et de paiement
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'orange_money',
    mobileMoneyNumber: '',
    notes: '',
    deliveryMethod: 'pickup' as 'pickup' | 'delivery',
    pickupLocation: 'campus' as 'campus' | 'library' | 'cafeteria'
  });

  const [transactionNumber, setTransactionNumber] = useState('');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Simuler des articles dans le panier (à remplacer par votre logique de panier)
  const cartItems = [
    { id: 1, name: "Laptop ENSPY", price: 450000, quantity: 1 },
    { id: 2, name: "Souris sans fil", price: 5000, quantity: 2 }
  ];

  // Calcul des totaux
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 2000; // Frais de livraison fixe
  const total = subtotal + shippingFee;

  // Données de la facture
  const invoiceData = {
    customerName: `${formData.firstName} ${formData.lastName}`,
    email: formData.email,
    phone: formData.phone,
    date: new Date().toLocaleDateString(),
    items: cartItems,
    subtotal,
    shippingFee,
    total,
    paymentMethod: formData.paymentMethod === 'orange_money' ? 'Orange Money' : 'MTN Money'
  };

  // Fonction pour générer et télécharger la facture PDF
  const generateInvoicePDF = () => {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.text('FACTURE', 105, 20, { align: 'center' });
    
    // Informations client
    doc.setFontSize(12);
    doc.text(`Client: ${formData.firstName} ${formData.lastName}`, 20, 40);
    doc.text(`Email: ${formData.email}`, 20, 48);
    doc.text(`Téléphone: ${formData.phone}`, 20, 56);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 64);
    
    // Tableau des articles
    const tableColumn = ["Article", "Quantité", "Prix unitaire", "Total"];
    const tableRows = cartItems.map(item => [
      item.name,
      item.quantity.toString(),
      `${item.price.toLocaleString()} FCFA`,
      `${(item.price * item.quantity).toLocaleString()} FCFA`
    ]);
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      theme: 'grid'
    });
    
    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Sous-total: ${subtotal.toLocaleString()} FCFA`, 140, finalY, { align: 'right' });
    doc.text(`Frais de livraison: ${shippingFee.toLocaleString()} FCFA`, 140, finalY + 8, { align: 'right' });
    doc.text(`Total: ${total.toLocaleString()} FCFA`, 140, finalY + 16, { align: 'right' });
    
    // Informations de paiement
    doc.text('Mode de paiement:', 20, finalY + 30);
    doc.text(formData.paymentMethod === 'orange_money' ? 'Orange Money' : 'MTN Money', 20, finalY + 38);
    
    // Sauvegarder le PDF
    doc.save('facture_enspy.pdf');
  };

  // Fonction pour imprimer la facture
  const handlePrint = () => {
    window.print();
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumettre la commande
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mobileMoneyNumber && (formData.paymentMethod === 'orange_money' || formData.paymentMethod === 'mtn_money')) {
      alert('Veuillez entrer votre numéro de téléphone Mobile Money');
      return;
    }
    
    try {
      alert('Commande passée avec succès ! Vous pouvez maintenant générer votre facture.');
    } catch (err) {
      console.error('Erreur lors de la validation de la commande:', err);
      alert('Une erreur est survenue lors de la validation de la commande.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-8"
    >
      <div className="enspy-container">
        <h1 className="text-3xl font-bold mb-8">Finaliser votre commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de commande */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Informations personnelles */}
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Informations personnelles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-dark mb-2">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray rounded focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-gray-dark mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray rounded focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-gray-dark mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray rounded focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-dark mb-2">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray rounded focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Méthode de livraison */}
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Méthode de livraison</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="pickup"
                      name="deliveryMethod"
                      value="pickup"
                      checked={formData.deliveryMethod === 'pickup'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="pickup" className="text-gray-dark">
                      Retrait sur place (gratuit)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="delivery"
                      name="deliveryMethod"
                      value="delivery"
                      checked={formData.deliveryMethod === 'delivery'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="delivery" className="text-gray-dark">
                      Livraison à domicile (500 FCFA)
                    </label>
                  </div>
                </div>
                
                {formData.deliveryMethod === 'pickup' ? (
                  <div className="mt-4">
                    <label htmlFor="pickupLocation" className="block text-gray-dark mb-2">
                      Point de retrait <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="pickupLocation"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray rounded focus:outline-none focus:border-primary"
                      required
                    >
                      <option value="campus">Campus ENSPY</option>
                      <option value="library">Bibliothèque ENSPY</option>
                      <option value="cafeteria">Cafétéria ENSPY</option>
                    </select>
                  </div>
                ) : (
                  <div className="mt-4">
                    <label htmlFor="address" className="block text-gray-dark mb-2">
                      Adresse de livraison <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray rounded focus:outline-none focus:border-primary"
                      rows={3}
                      required
                    ></textarea>
                    
                    <div className="mt-4">
                      <label htmlFor="city" className="block text-gray-dark mb-2">
                        Ville <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray rounded focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Méthode de paiement */}
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Méthode de paiement</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="orange_money"
                      name="paymentMethod"
                      value="orange_money"
                      checked={formData.paymentMethod === 'orange_money'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="orange_money" className="text-gray-dark flex items-center">
                      <div className="relative h-8 w-8 mr-2">
                        <Image
                          src="/images/orange-money.png"
                          alt="Orange Money"
                          fill
                          className="object-contain"
                        />
                      </div>
                      Orange Money
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="mtn_money"
                      name="paymentMethod"
                      value="mtn_money"
                      checked={formData.paymentMethod === 'mtn_money'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="mtn_money" className="text-gray-dark flex items-center">
                      <div className="relative h-8 w-8 mr-2">
                        <Image
                          src="/images/mtn-money.png"
                          alt="MTN Money"
                          fill
                          className="object-contain"
                        />
                      </div>
                      MTN Money
                    </label>
                  </div>
                </div>
                
                {(formData.paymentMethod === 'orange_money' || formData.paymentMethod === 'mtn_money') && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="mobileMoneyNumber" className="block text-gray-dark mb-2">
                        Numéro de téléphone {formData.paymentMethod === 'orange_money' ? 'Orange Money' : 'MTN Money'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="mobileMoneyNumber"
                        name="mobileMoneyNumber"
                        value={formData.mobileMoneyNumber}
                        onChange={handleChange}
                        placeholder="Ex: 6XXXXXXXX"
                        className="w-full px-4 py-2 border border-gray rounded focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="transactionNumber" className="block text-gray-dark mb-2">
                        Numéro de transaction (à remplir après paiement)
                      </label>
                      <input
                        type="text"
                        id="transactionNumber"
                        value={transactionNumber}
                        onChange={(e) => setTransactionNumber(e.target.value)}
                        placeholder="Ex: TX123456789"
                        className="w-full px-4 py-2 border border-gray rounded focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        {formData.paymentMethod === 'orange_money' ? (
                          <>Envoyez le montant à #123*1# et entrez le numéro de transaction reçu.</>
                        ) : (
                          <>Envoyez le montant à *126# et entrez le numéro de transaction reçu.</>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes de commande */}
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Notes de commande (optionnel)</h2>
                
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray rounded focus:outline-none focus:border-primary"
                  rows={4}
                  placeholder="Instructions spéciales pour la commande..."
                ></textarea>
              </div>

              <div className="flex justify-between items-center mt-8">
                <Link href="/shop/cart" className="btn-secondary">
                  Retour au panier
                </Link>
                <div className="space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceModalOpen(true)}
                    className="btn-secondary py-3 px-6"
                  >
                    Voir la facture
                  </button>
                  <button type="submit" className="btn-primary py-3 px-6">
                    Commander
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Résumé de la commande */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Résumé de la commande</h2>
              
              <div className="divide-y divide-gray">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-4 flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-dark">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{item.price * item.quantity} FCFA</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray mt-4 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-dark">Sous-total</span>
                  <span>{subtotal} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-dark">Frais de livraison</span>
                  <span>{shippingFee} FCFA</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span className="text-primary">{total} FCFA</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-light rounded text-sm">
                <p className="font-semibold mb-2">Informations importantes :</p>
                <ul className="list-disc list-inside space-y-1 text-gray-dark">
                  <li>Les commandes sont traitées sous 24h</li>
                  <li>Paiement en espèces uniquement lors du retrait</li>
                  <li>Accès réservé aux membres de l&apos;ENSPY</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de facture */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onPrint={handlePrint}
        onDownload={generateInvoicePDF}
        invoiceData={invoiceData}
      />
    </motion.div>
  );
}
