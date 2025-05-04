'use client';

import React, { useState, useEffect } from 'react';

interface AvailabilityIndicatorProps {
  vendorId?: string;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const AvailabilityIndicator: React.FC<AvailabilityIndicatorProps> = ({
  vendorId,
  size = 'medium',
  showText = true
}) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dimensions selon la taille
  const dimensions = {
    small: 'h-2 w-2',
    medium: 'h-3 w-3',
    large: 'h-4 w-4'
  };

  // Texte selon la taille
  const textSize = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  // Charger le statut de disponibilité
  useEffect(() => {
    const loadAvailability = () => {
      // Dans une application réelle, vous feriez une requête API pour obtenir
      // le statut de disponibilité du vendeur en utilisant vendorId
      
      // Pour la démonstration, nous utilisons localStorage
      if (typeof window !== 'undefined') {
        const savedStatus = localStorage.getItem('vendorAvailability');
        if (savedStatus !== null) {
          setIsAvailable(savedStatus === 'true');
        }
        setIsLoading(false);
      }
    };
    
    loadAvailability();
    
    // Dans une application réelle, vous pourriez mettre en place un système
    // de mise à jour en temps réel (WebSockets, polling, etc.)
  }, [vendorId]);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 rounded-full h-3 w-12"></div>;
  }

  return (
    <div className="flex items-center">
      <div className={`rounded-full ${dimensions[size]} ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
      {showText && (
        <span className={`ml-2 ${textSize[size]} ${isAvailable ? 'text-green-700' : 'text-red-700'}`}>
          {isAvailable ? 'Disponible' : 'Indisponible'}
        </span>
      )}
    </div>
  );
};

export default AvailabilityIndicator;
