'use client';

import React, { useState } from 'react';
import { UserProfile } from '../types';
import Image from 'next/image';
import Link from 'next/link';

interface ProfileTabsProps {
  profile: UserProfile;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState('orders');
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Onglets */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-4 px-6 text-center font-medium ${
            activeTab === 'orders'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Commandes récentes
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-4 px-6 text-center font-medium ${
            activeTab === 'reviews'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Avis
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-4 px-6 text-center font-medium ${
            activeTab === 'activity'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Activité récente
        </button>
      </div>
      
      {/* Contenu des onglets */}
      <div className="p-6">
        {/* Onglet Commandes */}
        {activeTab === 'orders' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vos dernières commandes</h3>
            
            {profile.recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore passé de commande</p>
                <Link href="/shop" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors">
                  Découvrir nos produits
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.recentOrders.map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-sm text-gray-500">Commande #{order.id}</span>
                        <p className="font-medium">{new Date(order.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'Livré' ? 'bg-green-100 text-green-800' :
                        order.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex items-center mb-2 sm:mb-0">
                        <div className="flex -space-x-2 mr-3">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="relative h-10 w-10 rounded-full border-2 border-white overflow-hidden">
                              <Image 
                                src={item.image} 
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="relative h-10 w-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                          <p className="text-sm text-gray-500">{order.total.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF' })}</p>
                        </div>
                      </div>
                      
                      <Link href={`/shop/orders/${order.id}`} className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                        Voir les détails
                      </Link>
                    </div>
                  </div>
                ))}
                
                <div className="text-center mt-4">
                  <Link href="/shop/orders" className="text-orange-500 hover:text-orange-600 font-medium">
                    Voir toutes mes commandes
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Onglet Avis */}
        {activeTab === 'reviews' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vos avis</h3>
            
            {profile.reviews.length === 0 ? (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore laissé d&apos;avis</p>
                <Link href="/shop/orders" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors">
                  Évaluer mes achats
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {profile.reviews.map(review => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden mr-4">
                        <Image 
                          src={review.productImage} 
                          alt={review.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <Link href={`/shop/product/${review.productId}`} className="font-medium text-gray-800 hover:text-orange-500">
                            {review.productName}
                          </Link>
                          <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        
                        {review.response && (
                          <div className="bg-gray-50 p-3 rounded-md mt-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">Réponse du vendeur:</p>
                            <p className="text-sm text-gray-600">{review.response}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Onglet Activité */}
        {activeTab === 'activity' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Votre activité récente</h3>
            
            {profile.recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500">Aucune activité récente</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {profile.recentActivity.map((activity, index) => (
                    <div key={index} className="relative pl-10">
                      <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                        {activity.type === 'order' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        )}
                        {activity.type === 'review' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        )}
                        {activity.type === 'wishlist' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-gray-700">{activity.description}</p>
                        <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString('fr-FR', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
