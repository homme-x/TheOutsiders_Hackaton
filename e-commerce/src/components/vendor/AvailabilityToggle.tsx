'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api/api';

interface AvailabilityToggleProps {
  initialStatus?: boolean;
  onStatusChange?: (isAvailable: boolean) => void;
}

const AvailabilityToggle: React.FC<AvailabilityToggleProps> = ({ 
  initialStatus = false, 
  onStatusChange 
}) => {
  const [isAvailable, setIsAvailable] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mettre à jour le statut
  const toggleAvailability = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Appel à l'API pour mettre à jour le statut
      const newStatus = !isAvailable;
      await api.vendor.updateAvailability(newStatus);
      
      setIsAvailable(newStatus);
      
      // Appeler le callback si fourni
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la disponibilité:', err);
      setError('Impossible de mettre à jour votre statut. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger le statut de l'utilisateur au chargement
  useEffect(() => {
    const loadUserStatus = async () => {
      try {
        const user = api.auth.getCurrentUser();
        if (user) {
          setIsAvailable(user.isAvailable || false);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du statut:', err);
      }
    };
    
    loadUserStatus();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Statut de disponibilité</h3>
          <p className="text-gray-600 text-sm mt-1">
            Indiquez si vous êtes actuellement disponible pour traiter de nouvelles commandes
          </p>
        </div>
        
        <button
          onClick={toggleAvailability}
          disabled={isLoading}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isLoading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : isAvailable 
                ? 'bg-green-500 focus:ring-green-500' 
                : 'bg-gray-400 focus:ring-gray-400'
          }`}
          aria-pressed={isAvailable}
          aria-label="Toggle availability"
        >
          <span
            className={`${
              isAvailable ? 'translate-x-9' : 'translate-x-1'
            } inline-block h-6 w-6 transform rounded-full bg-white transition-transform`}
          />
        </button>
      </div>
      
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-800 text-sm rounded-md">
          {error}
        </div>
      )}
      
      <div className={`mt-4 p-3 rounded-md ${isAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <p className={`text-sm font-medium ${isAvailable ? 'text-green-800' : 'text-red-800'}`}>
            {isAvailable 
              ? 'Vous êtes actuellement disponible pour recevoir de nouvelles commandes.' 
              : 'Vous êtes actuellement indisponible. Les clients ne pourront pas passer de nouvelles commandes.'}
          </p>
        </div>
        <p className="text-xs mt-2 text-gray-600">
          {isAvailable 
            ? 'Les clients peuvent voir vos produits et passer des commandes normalement.' 
            : 'Vos produits restent visibles mais sont marqués comme "Temporairement indisponibles".'}
        </p>
      </div>
    </div>
  );
};

export default AvailabilityToggle;
