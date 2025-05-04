'use client';

import React from 'react';
import Image from 'next/image';
import { UserProfile } from '../types';

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-orange-300 mb-4 md:mb-0 md:mr-6">
          <Image 
            src={profile.avatar || '/images/placeholder-avatar.jpg'} 
            alt={`${profile.firstName} ${profile.lastName}`}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">{profile.firstName} {profile.lastName}</h1>
          <p className="text-gray-600 mb-2">{profile.email}</p>
          <p className="text-gray-600 mb-4">{profile.phone || 'Aucun numéro de téléphone'}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              Client depuis {new Date(profile.joinDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
            </span>
            
            {profile.isVerified && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Vérifié
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
