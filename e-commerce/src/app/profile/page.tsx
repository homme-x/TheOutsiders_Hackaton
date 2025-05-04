'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProfileHeader from './components/ProfileHeader';
import ProfileStats from './components/ProfileStats';
import ProfileTabs from './components/ProfileTabs';
import { UserProfile } from './types';
import { api } from '@/lib/api/api';

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkLoginStatus = async () => {
      if (typeof window !== 'undefined') {
        const isLoggedIn = api.auth.isAuthenticated();
        setIsLoggedIn(isLoggedIn);
        
        if (isLoggedIn) {
          setIsLoading(true);
          try {
            // Récupérer les informations de l'utilisateur depuis l'API
            const userData = await api.auth.getProfile();
            
            // Récupérer les commandes de l'utilisateur
            const userOrders = await api.orders.getMyOrders();
            
            // Créer le profil utilisateur avec les données réelles
            const userProfile: UserProfile = {
              id: userData.id.toString(),
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              phone: userData.phone || '',
              avatar: userData.avatar || '/images/enspy.jpg',
              joinDate: userData.createdAt || new Date().toISOString(),
              isVerified: !!userData.isVerified,
              stats: {
                totalOrders: userOrders.length,
                wishlistItems: 0, // À implémenter plus tard
                totalSpent: userOrders.reduce((total, order) => total + order.total, 0)
              },
              recentOrders: userOrders.slice(0, 5).map(order => ({
                id: order.orderNumber,
                date: order.createdAt,
                status: order.status as 'En attente' | 'En cours' | 'Livré' | 'Annulé',
                total: order.total,
                items: order.items.map(item => ({
                  id: item.id.toString(),
                  name: item.product.name,
                  image: item.product.mainImage || '/images/placeholder.jpg',
                  price: item.price,
                  quantity: item.quantity
                }))
              })),
              reviews: [], // À implémenter plus tard
              recentActivity: [
                ...userOrders.slice(0, 3).map(order => ({
                  type: 'order' as const,
                  description: `Vous avez passé une commande (#${order.orderNumber})`,
                  date: order.createdAt,
                  link: `/shop/orders/${order.orderNumber}`
                })),
                {
                  type: 'login' as const,
                  description: 'Vous vous êtes connecté',
                  date: new Date().toISOString()
                }
              ]
            };
            
            setProfile(userProfile);
          } catch (error) {
            console.error('Erreur lors du chargement du profil:', error);
          } finally {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      }
    };
    
    checkLoginStatus();
  }, []);

  // Si l'utilisateur n'est pas connecté, afficher un message
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Connexion requise</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à votre profil.</p>
          <Link href="/auth/login" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-orange-300">Mon Profil</h1>
          <div className="flex space-x-3">
            <Link href="/account/settings" className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              Paramètres
            </Link>
            <Link href="/shop/orders" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors">
              Mes commandes
            </Link>
          </div>
        </div>
        
        <ProfileHeader profile={profile} />
        <ProfileStats profile={profile} />
        <ProfileTabs profile={profile} />
      </div>
    </div>
  );
}
