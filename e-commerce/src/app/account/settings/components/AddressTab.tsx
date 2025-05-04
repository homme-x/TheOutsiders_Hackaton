import React from 'react';
import { UserProfile } from '../types';

interface AddressTabProps {
  profile: UserProfile;
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isSaving: boolean;
}

const AddressTab: React.FC<AddressTabProps> = ({ 
  profile, 
  handleProfileChange,
  isSaving 
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Adresse de livraison</h2>
      
      <div className="mt-4">
        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
          Rue et numéro
        </label>
        <input
          type="text"
          id="address.street"
          name="address.street"
          value={profile.address.street}
          onChange={handleProfileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
            Ville
          </label>
          <input
            type="text"
            id="address.city"
            name="address.city"
            value={profile.address.city}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700 mb-1">
            Code postal
          </label>
          <input
            type="text"
            id="address.postalCode"
            name="address.postalCode"
            value={profile.address.postalCode}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-1">
          Pays
        </label>
        <select
          id="address.country"
          name="address.country"
          value={profile.address.country}
          onChange={handleProfileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Cameroun">Cameroun</option>
          <option value="Sénégal">Sénégal</option>
          <option value="Côte d'Ivoire">Côte d'Ivoire</option>
          <option value="Gabon">Gabon</option>
          <option value="Congo">Congo</option>
          <option value="Autre">Autre</option>
        </select>
      </div>
    </div>
  );
};

export default AddressTab;
