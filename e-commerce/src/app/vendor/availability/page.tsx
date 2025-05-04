'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AvailabilityToggle from '@/components/vendor/AvailabilityToggle';

interface AvailabilitySchedule {
  day: string;
  isActive: boolean;
  openTime: string;
  closeTime: string;
}

export default function VendorAvailability() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [automaticMode, setAutomaticMode] = useState(false);
  const [schedule, setSchedule] = useState<AvailabilitySchedule[]>([
    { day: 'Lundi', isActive: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'Mardi', isActive: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'Mercredi', isActive: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'Jeudi', isActive: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'Vendredi', isActive: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'Samedi', isActive: true, openTime: '09:00', closeTime: '16:00' },
    { day: 'Dimanche', isActive: false, openTime: '09:00', closeTime: '16:00' }
  ]);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/auth/login?redirect=/vendor/availability');
      } else {
        // Charger les données de disponibilité
        const savedStatus = localStorage.getItem('vendorAvailability');
        if (savedStatus !== null) {
          setIsAvailable(savedStatus === 'true');
        }
        
        const savedMessage = localStorage.getItem('vendorAvailabilityMessage');
        if (savedMessage) {
          setAvailabilityMessage(savedMessage);
        } else {
          setAvailabilityMessage('Je suis actuellement indisponible. Veuillez réessayer plus tard.');
        }
        
        const savedAutoMode = localStorage.getItem('vendorAutomaticMode');
        if (savedAutoMode !== null) {
          setAutomaticMode(savedAutoMode === 'true');
        }
        
        const savedSchedule = localStorage.getItem('vendorSchedule');
        if (savedSchedule) {
          try {
            setSchedule(JSON.parse(savedSchedule));
          } catch (e) {
            console.error('Erreur lors du chargement du planning:', e);
          }
        }
        
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Mettre à jour le message de disponibilité
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAvailabilityMessage(e.target.value);
  };

  // Sauvegarder les modifications
  const handleSaveMessage = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vendorAvailabilityMessage', availabilityMessage);
    }
    
    // Afficher une notification de succès (simulée)
    alert('Message de disponibilité mis à jour avec succès!');
  };

  // Mettre à jour le mode automatique
  const toggleAutomaticMode = () => {
    const newMode = !automaticMode;
    setAutomaticMode(newMode);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('vendorAutomaticMode', newMode ? 'true' : 'false');
    }
  };

  // Mettre à jour le planning
  const updateSchedule = (index: number, field: keyof AvailabilitySchedule, value: any) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('vendorSchedule', JSON.stringify(newSchedule));
    }
  };

  // Sauvegarder le planning
  const saveSchedule = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vendorSchedule', JSON.stringify(schedule));
    }
    
    // Afficher une notification de succès (simulée)
    alert('Planning de disponibilité mis à jour avec succès!');
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
          <h1 className="text-2xl font-bold text-orange-300">Gestion de la disponibilité</h1>
          <p className="text-orange-300 font-medium">Configurez vos heures d&apos;ouverture et votre statut de disponibilité</p>
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
            <Link href="/vendor/messages" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Messagerie
            </Link>
            <Link href="/vendor/reports" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Rapports
            </Link>
            <Link href="/vendor/availability" className="px-3 py-2 rounded-md bg-white text-secondary font-medium relative">
              Disponibilité
              <span className="absolute bottom-0 left-0 w-full h-1 bg-secondary-dark"></span>
            </Link>
            <Link href="/vendor/settings" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Paramètres
            </Link>
          </nav>
        </div>
        
        {/* Statut de disponibilité */}
        <div className="mb-6">
          <AvailabilityToggle 
            initialStatus={isAvailable}
            onStatusChange={(status) => {
              setIsAvailable(status);
            }} 
          />
        </div>
        
        {/* Message de disponibilité */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Message d&apos;indisponibilité</h3>
          <p className="text-gray-600 text-sm mb-4">
            Ce message sera affiché aux clients lorsque vous êtes indisponible.
          </p>
          
          <div className="mb-4">
            <textarea
              value={availabilityMessage}
              onChange={handleMessageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={4}
              placeholder="Entrez votre message d'indisponibilité..."
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSaveMessage}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
            >
              Enregistrer le message
            </button>
          </div>
        </div>
        
        {/* Mode automatique */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Mode automatique</h3>
              <p className="text-gray-600 text-sm mt-1">
                Activez cette option pour que votre disponibilité soit automatiquement mise à jour selon votre planning
              </p>
            </div>
            
            <button
              onClick={toggleAutomaticMode}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                automaticMode 
                  ? 'bg-orange-500 focus:ring-orange-500' 
                  : 'bg-gray-400 focus:ring-gray-400'
              }`}
              aria-pressed={automaticMode}
              aria-label="Toggle automatic mode"
            >
              <span
                className={`${
                  automaticMode ? 'translate-x-9' : 'translate-x-1'
                } inline-block h-6 w-6 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>
          
          <div className={`p-3 rounded-md ${automaticMode ? 'bg-orange-50' : 'bg-gray-50'}`}>
            <p className={`text-sm ${automaticMode ? 'text-orange-800' : 'text-gray-700'}`}>
              {automaticMode 
                ? 'Le mode automatique est activé. Votre disponibilité sera mise à jour automatiquement selon votre planning ci-dessous.' 
                : 'Le mode automatique est désactivé. Vous devez mettre à jour manuellement votre disponibilité.'}
            </p>
          </div>
        </div>
        
        {/* Planning de disponibilité */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Planning de disponibilité</h3>
          <p className="text-gray-600 text-sm mb-4">
            Configurez vos heures d&apos;ouverture pour chaque jour de la semaine.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Jour</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Disponible</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Heure d&apos;ouverture</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Heure de fermeture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedule.map((day, index) => (
                  <tr key={day.day} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{day.day}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => updateSchedule(index, 'isActive', !day.isActive)}
                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          day.isActive 
                            ? 'bg-orange-500 focus:ring-orange-500' 
                            : 'bg-gray-400 focus:ring-gray-400'
                        }`}
                        aria-pressed={day.isActive}
                        aria-label={`Toggle ${day.day}`}
                      >
                        <span
                          className={`${
                            day.isActive ? 'translate-x-6' : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        value={day.openTime}
                        onChange={(e) => updateSchedule(index, 'openTime', e.target.value)}
                        disabled={!day.isActive}
                        className={`px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          !day.isActive ? 'bg-gray-100 text-gray-400' : ''
                        }`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        value={day.closeTime}
                        onChange={(e) => updateSchedule(index, 'closeTime', e.target.value)}
                        disabled={!day.isActive}
                        className={`px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                          !day.isActive ? 'bg-gray-100 text-gray-400' : ''
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              onClick={saveSchedule}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
            >
              Enregistrer le planning
            </button>
          </div>
        </div>
        
        {/* Vacances et jours fériés */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Vacances et jours fériés</h3>
          <p className="text-gray-600 text-sm mb-4">
            Indiquez les périodes pendant lesquelles vous serez en vacances ou indisponible.
          </p>
          
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-md">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 mb-2">Fonctionnalité à venir</p>
              <p className="text-sm text-gray-500">
                Cette fonctionnalité sera disponible prochainement. Vous pourrez planifier vos périodes de vacances et jours fériés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
