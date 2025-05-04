'use client';

import { useState, useEffect } from 'react';

interface PaymentSettings {
  paymentMethods: {
    id: string;
    name: string;
    enabled: boolean;
    apiKey?: string;
    secretKey?: string;
  }[];
  currency: string;
  taxRate: number;
}

interface ShippingSettings {
  methods: {
    id: string;
    name: string;
    price: number;
    enabled: boolean;
    estimatedDays: string;
  }[];
  freeShippingThreshold: number;
}

interface GeneralSettings {
  siteName: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'ENSPY E-Commerce',
    contactEmail: 'contact@enspy-ecommerce.cm',
    phoneNumber: '+237 123 456 789',
    address: 'Yaoundé, Cameroun',
    socialMedia: {
      facebook: 'https://facebook.com/enspy',
      twitter: 'https://twitter.com/enspy',
      instagram: 'https://instagram.com/enspy'
    }
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    paymentMethods: [
      {
        id: 'orange-money',
        name: 'Orange Money',
        enabled: true,
        apiKey: '********',
        secretKey: '********'
      },
      {
        id: 'mtn-momo',
        name: 'MTN Mobile Money',
        enabled: true,
        apiKey: '********',
        secretKey: '********'
      },
      {
        id: 'cash',
        name: 'Paiement à la livraison',
        enabled: true
      }
    ],
    currency: 'FCFA',
    taxRate: 19.25
  });

  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    methods: [
      {
        id: 'standard',
        name: 'Livraison standard',
        price: 2500,
        enabled: true,
        estimatedDays: '3-5'
      },
      {
        id: 'express',
        name: 'Livraison express',
        price: 5000,
        enabled: true,
        estimatedDays: '1-2'
      }
    ],
    freeShippingThreshold: 50000
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simuler une sauvegarde API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Paramètres</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gérez les paramètres généraux de votre boutique.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        {/* Onglets */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {['general', 'payment', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
              >
                {tab === 'general' ? 'Général' : 
                 tab === 'payment' ? 'Paiement' : 'Livraison'}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Informations générales</h3>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                      Nom du site
                    </label>
                    <input
                      type="text"
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                      Email de contact
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={generalSettings.phoneNumber}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, phoneNumber: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Adresse
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      value={generalSettings.address}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Réseaux sociaux</h3>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                      Facebook
                    </label>
                    <input
                      type="url"
                      id="facebook"
                      value={generalSettings.socialMedia.facebook}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        socialMedia: { ...generalSettings.socialMedia, facebook: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                      Twitter
                    </label>
                    <input
                      type="url"
                      id="twitter"
                      value={generalSettings.socialMedia.twitter}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        socialMedia: { ...generalSettings.socialMedia, twitter: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                      Instagram
                    </label>
                    <input
                      type="url"
                      id="instagram"
                      value={generalSettings.socialMedia.instagram}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        socialMedia: { ...generalSettings.socialMedia, instagram: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Méthodes de paiement</h3>
                <div className="mt-6 space-y-4">
                  {paymentSettings.paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={method.enabled}
                          onChange={(e) => setPaymentSettings({
                            ...paymentSettings,
                            paymentMethods: paymentSettings.paymentMethods.map(m =>
                              m.id === method.id ? { ...m, enabled: e.target.checked } : m
                            )
                          })}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">{method.name}</span>
                      </div>
                      {method.apiKey && (
                        <div className="flex space-x-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Clé API
                            </label>
                            <input
                              type="password"
                              value={method.apiKey}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                paymentMethods: paymentSettings.paymentMethods.map(m =>
                                  m.id === method.id ? { ...m, apiKey: e.target.value } : m
                                )
                              })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Clé secrète
                            </label>
                            <input
                              type="password"
                              value={method.secretKey}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                paymentMethods: paymentSettings.paymentMethods.map(m =>
                                  m.id === method.id ? { ...m, secretKey: e.target.value } : m
                                )
                              })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Paramètres de taxe</h3>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
                      Taux de TVA (%)
                    </label>
                    <input
                      type="number"
                      id="taxRate"
                      value={paymentSettings.taxRate}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, taxRate: parseFloat(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Méthodes de livraison</h3>
                <div className="mt-6 space-y-4">
                  {shippingSettings.methods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nom
                          </label>
                          <input
                            type="text"
                            value={method.name}
                            onChange={(e) => setShippingSettings({
                              ...shippingSettings,
                              methods: shippingSettings.methods.map(m =>
                                m.id === method.id ? { ...m, name: e.target.value } : m
                              )
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Prix
                          </label>
                          <input
                            type="number"
                            value={method.price}
                            onChange={(e) => setShippingSettings({
                              ...shippingSettings,
                              methods: shippingSettings.methods.map(m =>
                                m.id === method.id ? { ...m, price: parseInt(e.target.value) } : m
                              )
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Délai estimé (jours)
                          </label>
                          <input
                            type="text"
                            value={method.estimatedDays}
                            onChange={(e) => setShippingSettings({
                              ...shippingSettings,
                              methods: shippingSettings.methods.map(m =>
                                m.id === method.id ? { ...m, estimatedDays: e.target.value } : m
                              )
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={method.enabled}
                            onChange={(e) => setShippingSettings({
                              ...shippingSettings,
                              methods: shippingSettings.methods.map(m =>
                                m.id === method.id ? { ...m, enabled: e.target.checked } : m
                              )
                            })}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-900">Actif</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Livraison gratuite</h3>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="freeShippingThreshold" className="block text-sm font-medium text-gray-700">
                      Seuil de livraison gratuite (FCFA)
                    </label>
                    <input
                      type="number"
                      id="freeShippingThreshold"
                      value={shippingSettings.freeShippingThreshold}
                      onChange={(e) => setShippingSettings({
                        ...shippingSettings,
                        freeShippingThreshold: parseInt(e.target.value)
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bouton de sauvegarde */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-3">
            {showSuccess && (
              <p className="text-sm text-green-600">Paramètres sauvegardés avec succès!</p>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
