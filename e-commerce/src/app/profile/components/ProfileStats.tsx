'use client';

import React from 'react';
import { UserProfile } from '../types';

interface ProfileStatsProps {
  profile: UserProfile;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
        <div className="bg-blue-100 p-3 rounded-full mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{profile.stats.totalOrders}</h3>
        <p className="text-gray-600">Commandes</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
        <div className="bg-red-100 p-3 rounded-full mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{profile.stats.wishlistItems}</h3>
        <p className="text-gray-600">Favoris</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
        <div className="bg-green-100 p-3 rounded-full mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{profile.stats.totalSpent.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF' })}</h3>
        <p className="text-gray-600">Dépensé</p>
      </div>
    </div>
  );
};

export default ProfileStats;
