'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function VendorSettings() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // États pour le formulaire
  const [profileData, setProfileData] = useState({
    name: 'Boutique ENSPY',
    email: 'boutique@enspy.cm',
    phone: '+237 123 456 789',
    address: 'Campus ENSPY, Yaoundé, Cameroun',
    description: 'Boutique officielle de l\'École Nationale Supérieure Polytechnique de Yaoundé. Nous proposons des produits électroniques et informatiques de qualité pour les étudiants et professionnels.',
    logo: '/images/enspy.jpg'
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    newOrder: true,
    orderStatus: true,
    lowStock: true,
    productReviews: false,
    marketing: false
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    acceptMobileMoney: true,
    acceptBankTransfer: true,
    acceptCash: true,
    bankName: 'Banque Atlantique',
    accountNumber: '1234567890',
    accountName: 'ENSPY E-Commerce'
  });

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/auth/login?redirect=/vendor/settings');
      } else {
        setIsLoading(false);
        // Charger l'image de profil
        setPreviewImage(profileData.logo);
      }
    };
    
    checkAuth();
  }, [router, profileData.logo]);

  // Gérer les changements dans le formulaire de profil
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  // Gérer les changements dans les paramètres de notification
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };
  
  // Gérer les changements dans les paramètres de paiement
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPaymentSettings({
      ...paymentSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Gérer le téléchargement du logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Paramètres enregistrés avec succès!');
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
          <h1 className="text-2xl font-bold text-orange-300">Paramètres du compte</h1>
          <p className="text-orange-300 font-medium">Gérez les informations et préférences de votre boutique</p>
        </div>
      </div>
      
      <div className="enspy-container mt-6">
        {/* Navigation du tableau de bord */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <nav className="flex flex-wrap space-x-1 md:space-x-4">
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
            <Link href="/vendor/promotions" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Promotions
            </Link>
            <Link href="/vendor/reports" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Rapports
            </Link>
            <Link href="/vendor/settings" className="px-3 py-2 rounded-md bg-white text-secondary font-medium relative">
              Paramètres
              <span className="absolute bottom-0 left-0 w-full h-1 bg-secondary-dark"></span>
            </Link>
          </nav>
        </div>
        
        {/* Onglets des paramètres */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profil de la boutique
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'notifications' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('notifications')}
              >
                Notifications
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'payment' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('payment')}
              >
                Paiement
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'security' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('security')}
              >
                Sécurité
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {/* Profil de la boutique */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom de la boutique
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description de la boutique
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={profileData.description}
                        onChange={handleProfileChange}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo de la boutique
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {previewImage ? (
                        <div className="relative h-48 w-48 mx-auto mb-2">
                          <Image
                            src={previewImage}
                            alt="Logo de la boutique"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="py-8">
                          <i className="fas fa-store text-gray-400 text-5xl mb-2"></i>
                          <p className="text-gray-500">Aucun logo sélectionné</p>
                        </div>
                      )}
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo"
                        className="mt-2 inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md cursor-pointer transition-colors"
                      >
                        {previewImage ? 'Changer le logo' : 'Sélectionner un logo'}
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Format recommandé: JPG, PNG. Taille max: 2MB
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            )}
            
            {/* Notifications */}
            {activeTab === 'notifications' && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <h2 className="text-lg font-medium mb-4">Préférences de notification</h2>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Nouvelles commandes</h3>
                      <p className="text-sm text-gray-500">Recevoir une notification pour chaque nouvelle commande</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="newOrder"
                        checked={notificationSettings.newOrder}
                        onChange={handleNotificationChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Statut des commandes</h3>
                      <p className="text-sm text-gray-500">Recevoir une notification lors des changements de statut</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="orderStatus"
                        checked={notificationSettings.orderStatus}
                        onChange={handleNotificationChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Stock faible</h3>
                      <p className="text-sm text-gray-500">Recevoir une alerte lorsque le stock d'un produit est faible</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="lowStock"
                        checked={notificationSettings.lowStock}
                        onChange={handleNotificationChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Avis sur les produits</h3>
                      <p className="text-sm text-gray-500">Recevoir une notification pour les nouveaux avis clients</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="productReviews"
                        checked={notificationSettings.productReviews}
                        onChange={handleNotificationChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Marketing</h3>
                      <p className="text-sm text-gray-500">Recevoir des conseils marketing et des opportunités de promotion</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="marketing"
                        checked={notificationSettings.marketing}
                        onChange={handleNotificationChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Enregistrer les préférences
                  </button>
                </div>
              </form>
            )}
            
            {/* Paiement */}
            {activeTab === 'payment' && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <h2 className="text-lg font-medium mb-4">Méthodes de paiement acceptées</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="mobileMoney"
                        name="acceptMobileMoney"
                        type="checkbox"
                        checked={paymentSettings.acceptMobileMoney}
                        onChange={handlePaymentChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="mobileMoney" className="ml-3 block text-sm font-medium text-gray-700">
                        Mobile Money (Orange Money, MTN Mobile Money)
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="bankTransfer"
                        name="acceptBankTransfer"
                        type="checkbox"
                        checked={paymentSettings.acceptBankTransfer}
                        onChange={handlePaymentChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="bankTransfer" className="ml-3 block text-sm font-medium text-gray-700">
                        Virement bancaire
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="cash"
                        name="acceptCash"
                        type="checkbox"
                        checked={paymentSettings.acceptCash}
                        onChange={handlePaymentChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="cash" className="ml-3 block text-sm font-medium text-gray-700">
                        Paiement à la livraison
                      </label>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h2 className="text-lg font-medium mb-4">Informations bancaires</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de la banque
                        </label>
                        <input
                          type="text"
                          id="bankName"
                          name="bankName"
                          value={paymentSettings.bankName}
                          onChange={handlePaymentChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Numéro de compte
                        </label>
                        <input
                          type="text"
                          id="accountNumber"
                          name="accountNumber"
                          value={paymentSettings.accountNumber}
                          onChange={handlePaymentChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom du titulaire
                        </label>
                        <input
                          type="text"
                          id="accountName"
                          name="accountName"
                          value={paymentSettings.accountName}
                          onChange={handlePaymentChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Enregistrer les paramètres
                  </button>
                </div>
              </form>
            )}
            
            {/* Sécurité */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium mb-4">Sécurité du compte</h2>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-exclamation-triangle text-yellow-400"></i>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Pour des raisons de sécurité, certains paramètres ne peuvent être modifiés que par l'administrateur du système.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Changer le mot de passe</h3>
                    <p className="text-sm text-gray-500 mb-4">Nous vous recommandons d'utiliser un mot de passe fort et unique</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Mot de passe actuel
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirmer le nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <button
                        type="button"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                      >
                        Mettre à jour le mot de passe
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Sessions actives</h3>
                    <p className="text-sm text-gray-500 mb-4">Appareils actuellement connectés à votre compte</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div>
                          <div className="flex items-center">
                            <i className="fas fa-laptop text-gray-500 mr-2"></i>
                            <span className="text-sm font-medium">Windows PC - Chrome</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Yaoundé, Cameroun - Dernière activité: Aujourd'hui à 20:24
                          </div>
                        </div>
                        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Actuel
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Déconnecter toutes les autres sessions
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
