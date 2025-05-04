import React from 'react';
import { UserProfile } from '../types';

interface PreferencesTabProps {
  profile: UserProfile;
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handlePreferenceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSaving: boolean;
}

const PreferencesTab: React.FC<PreferencesTabProps> = ({ 
  profile, 
  handleProfileChange,
  handlePreferenceChange,
  isSaving 
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Préférences</h2>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="preferences.notifications"
            name="preferences.notifications"
            checked={profile.preferences.notifications}
            onChange={handlePreferenceChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="preferences.notifications" className="ml-2 block text-sm text-gray-700">
            Recevoir des notifications par email
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="preferences.newsletter"
            name="preferences.newsletter"
            checked={profile.preferences.newsletter}
            onChange={handlePreferenceChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="preferences.newsletter" className="ml-2 block text-sm text-gray-700">
            S'abonner à la newsletter
          </label>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="preferences.language" className="block text-sm font-medium text-gray-700 mb-1">
            Langue
          </label>
          <select
            id="preferences.language"
            name="preferences.language"
            value={profile.preferences.language}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="preferences.currency" className="block text-sm font-medium text-gray-700 mb-1">
            Devise
          </label>
          <select
            id="preferences.currency"
            name="preferences.currency"
            value={profile.preferences.currency}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="XAF">Franc CFA (XAF)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">Dollar américain (USD)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;
