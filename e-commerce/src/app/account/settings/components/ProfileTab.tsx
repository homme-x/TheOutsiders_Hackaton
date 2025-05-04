import React from 'react';
import Image from 'next/image';
import { UserProfile } from '../types';

interface ProfileTabProps {
  profile: UserProfile;
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSaving: boolean;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ 
  profile, 
  handleProfileChange, 
  handleAvatarChange,
  isSaving 
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations personnelles</h2>
      
      {/* Avatar */}
      <div className="flex items-center mb-6">
        <div className="relative h-20 w-20 rounded-full overflow-hidden mr-4 border-2 border-gray-200">
          <Image 
            src={profile.avatar || '/images/placeholder-avatar.jpg'} 
            alt="Avatar" 
            fill
            className="object-cover"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo de profil
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            Prénom
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={profile.firstName}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={profile.lastName}
            onChange={handleProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>
      
      <div className="mt-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={profile.email}
          onChange={handleProfileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      
      <div className="mt-4">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Téléphone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={profile.phone}
          onChange={handleProfileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default ProfileTab;
