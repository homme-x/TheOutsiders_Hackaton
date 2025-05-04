'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProfileTab from './components/ProfileTab';
import AddressTab from './components/AddressTab';
import PreferencesTab from './components/PreferencesTab';
import SecurityTab from './components/SecurityTab';
import { UserProfile } from './types';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // État du profil utilisateur
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    preferences: {
      notifications: true,
      newsletter: false,
      language: 'fr',
      currency: 'XAF'
    }
  });

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkLoginStatus = () => {
      if (typeof window !== 'undefined') {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(isLoggedIn);
        
        if (isLoggedIn) {
          // Charger les données du profil (simulé)
          setTimeout(() => {
            const mockProfile: UserProfile = {
              id: 'user123',
              firstName: 'Jean',
              lastName: 'Dupont',
              email: 'jean.dupont@example.com',
              phone: '+237 6XX XX XX XX',
              avatar: '/images/avatar.jpg',
              address: {
                street: '123 Rue Principale',
                city: 'Yaoundé',
                postalCode: '12345',
                country: 'Cameroun'
              },
              preferences: {
                notifications: true,
                newsletter: true,
                language: 'fr',
                currency: 'XAF'
              }
            };
            
            setProfile(mockProfile);
            setIsLoading(false);
          }, 1000);
        } else {
          setIsLoading(false);
        }
      }
    };
    
    checkLoginStatus();
  }, []);

  // Gérer les changements dans le formulaire de profil
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Gérer les changements dans les préférences
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, type, value } = e.target;
    const fieldName = name.replace('preferences.', '');
    
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [fieldName]: type === 'checkbox' ? checked : value
      }
    }));
  };

  // Sauvegarder les modifications
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    // Simuler une sauvegarde
    setTimeout(() => {
      // Simuler une sauvegarde réussie
      setIsSaving(false);
      setSuccessMessage('Vos informations ont été mises à jour avec succès.');
      
      // Effacer le message après 5 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      // Dans une application réelle, vous enverriez les données au serveur
      console.log('Profil mis à jour:', profile);
    }, 1500);
  };

  // Gérer le changement d'avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setProfile(prev => ({
        ...prev,
        avatar: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  // Si l'utilisateur n'est pas connecté, afficher un message
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Connexion requise</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à vos paramètres.</p>
          <Link href="/auth/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-orange-300 mb-1">Paramètres du compte</h1>
        <p className="text-orange-300 mb-6">Gérez vos informations personnelles et vos préférences</p>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Navigation des onglets */}
            <div className="w-full md:w-1/4 bg-gray-50 p-4 border-r border-gray-200">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Profil
                </button>
                <button
                  onClick={() => setActiveTab('address')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'address' 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Adresse
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'preferences' 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Préférences
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'security' 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Sécurité
                </button>
              </nav>
            </div>
            
            {/* Contenu des onglets */}
            <div className="w-full md:w-3/4 p-6">
              {/* Messages de succès et d'erreur */}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                  {successMessage}
                </div>
              )}
              
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                  {errorMessage}
                </div>
              )}
              
              {/* Onglet Profil */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile}>
                  <ProfileTab 
                    profile={profile} 
                    handleProfileChange={handleProfileChange} 
                    handleAvatarChange={handleAvatarChange}
                    isSaving={isSaving}
                  />
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  </div>
                </form>
              )}
              
              {/* Onglet Adresse */}
              {activeTab === 'address' && (
                <form onSubmit={handleSaveProfile}>
                  <AddressTab 
                    profile={profile} 
                    handleProfileChange={handleProfileChange}
                    isSaving={isSaving}
                  />
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  </div>
                </form>
              )}
              
              {/* Onglet Préférences */}
              {activeTab === 'preferences' && (
                <form onSubmit={handleSaveProfile}>
                  <PreferencesTab 
                    profile={profile} 
                    handleProfileChange={handleProfileChange}
                    handlePreferenceChange={handlePreferenceChange}
                    isSaving={isSaving}
                  />
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  </div>
                </form>
              )}
              
              {/* Onglet Sécurité */}
              {activeTab === 'security' && (
                <form onSubmit={handleSaveProfile}>
                  <SecurityTab isSaving={isSaving} />
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Enregistrement...' : 'Mettre à jour le mot de passe'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
