'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/api'; // Import de l'API d'authentification

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // État de connexion de l'utilisateur
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasVendorNotifications, setHasVendorNotifications] = useState(false); // État pour les notifications vendeur
  const [userName, setUserName] = useState('Utilisateur'); // Nom de l'utilisateur connecté
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Détecter le défilement pour changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu utilisateur lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fonction pour gérer la déconnexion avec l'API
  const toggleLogin = async () => {
    if (isLoggedIn) {
      try {
        // Appel à l'API de déconnexion
        await api.auth.logout();
        
        // Mise à jour de l'état local
        setIsLoggedIn(false);
        setUserName('Utilisateur');
        
        // Émettre un événement personnalisé pour informer les autres composants
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('logout'));
        }
        
        // Redirection vers la page d'accueil
        router.push('/');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        // En cas d'erreur, on essaie quand même de déconnecter localement
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        
        // Émettre un événement personnalisé pour informer les autres composants
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('logout'));
        }
      }
    } else {
      // La connexion se fait via la page de connexion
      router.push('/auth/login');
    }
    setIsUserMenuOpen(false);
  };

  // Vérifier si l'utilisateur est connecté au chargement de la page
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté via l'API
    const checkLoginStatus = async () => {
      try {
        // Vérifier si un token existe
        const token = localStorage.getItem('token');
        
        if (token) {
          // Vérifier si l'utilisateur est authentifié
          const isAuthenticated = api.auth.isAuthenticated();
          
          if (isAuthenticated) {
            // Récupérer les informations de l'utilisateur
            const user = api.auth.getCurrentUser();
            
            if (user) {
              setIsLoggedIn(true);
              setUserName(user.firstName ? `${user.firstName}` : user.email || 'Utilisateur');
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        // En cas d'erreur, vérifier le localStorage comme fallback
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userString = localStorage.getItem('user');
        
        if (isLoggedIn && userString) {
          try {
            const user = JSON.parse(userString);
            setIsLoggedIn(true);
            setUserName(user.firstName || user.name || user.email || 'Utilisateur');
          } catch (e) {
            console.error('Erreur lors du parsing des données utilisateur:', e);
          }
        }
      }
    };
    
    checkLoginStatus();
  }, []);

  // Écouter l'événement de connexion
  useEffect(() => {
    const handleLogin = () => {
      // Récupérer les informations de l'utilisateur
      const user = api.auth.getCurrentUser();
      
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.firstName ? `${user.firstName}` : user.email || 'Utilisateur');
      } else {
        // Fallback au localStorage
        const userString = localStorage.getItem('user');
        if (userString) {
          try {
            const user = JSON.parse(userString);
            setUserName(user.firstName || user.name || user.email || 'Utilisateur');
          } catch (e) {
            console.error('Erreur lors du parsing des données utilisateur:', e);
          }
        }
        setIsLoggedIn(true);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('login', handleLogin);
      
      return () => {
        window.removeEventListener('login', handleLogin);
      };
    }
  }, []);

  // Vérifier l'état de connexion à chaque changement de route
  useEffect(() => {
    const checkLoginStatusOnRouteChange = async () => {
      try {
        // Vérifier si un token existe
        const token = localStorage.getItem('token');
        
        if (token) {
          // Vérifier si l'utilisateur est authentifié
          const isAuthenticated = api.auth.isAuthenticated();
          
          if (isAuthenticated) {
            // Récupérer les informations de l'utilisateur
            const user = api.auth.getCurrentUser();
            
            if (user) {
              setIsLoggedIn(true);
              setUserName(user.firstName ? `${user.firstName}` : user.email || 'Utilisateur');
              return;
            }
          }
        }
        
        // Si on arrive ici, l'utilisateur n'est pas connecté via l'API
        const isLoggedInLocal = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedInLocal) {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      }
    };

    // Vérifier au montage du composant
    checkLoginStatusOnRouteChange();

    // Ajouter un écouteur pour les changements de route
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', checkLoginStatusOnRouteChange);
      
      return () => {
        window.removeEventListener('popstate', checkLoginStatusOnRouteChange);
      };
    }
  }, []);
  
  // Vérifier s'il y a des notifications pour l'espace vendeur
  useEffect(() => {
    // Cette fonction vérifie s'il y a de nouvelles commandes ou des mises à jour importantes
    const checkVendorNotifications = async () => {
      if (typeof window !== 'undefined' && isLoggedIn) {
        try {
          // Dans une application réelle, on ferait une requête API ici
          // Pour la démo, on simule des notifications avec localStorage
          const hasNotifications = localStorage.getItem('vendorNotifications') === 'true';
          
          // Pour la démo, on génère aléatoirement des notifications
          if (Math.random() > 0.7) {
            localStorage.setItem('vendorNotifications', 'true');
            setHasVendorNotifications(true);
          } else {
            setHasVendorNotifications(hasNotifications);
          }
        } catch (error) {
          console.error('Erreur lors de la vérification des notifications:', error);
        }
      }
    };
    
    // Vérifier au montage du composant
    checkVendorNotifications();
    
    // Vérifier périodiquement (toutes les 30 secondes)
    const interval = setInterval(checkVendorNotifications, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [isLoggedIn]);
  
  // Fonction pour marquer les notifications comme lues
  const markVendorNotificationsAsRead = () => {
    localStorage.removeItem('vendorNotifications');
    setHasVendorNotifications(false);
  };

  // Mettre à jour le compteur du panier
  useEffect(() => {
    const updateCartCount = async () => {
      try {
        if (isLoggedIn) {
          // Si l'utilisateur est connecté, récupérer le panier depuis l'API
          const cartData = await api.cart.getCart();
          
          if (cartData && cartData.items) {
            const itemCount = cartData.items.reduce((total: number, item: any) => total + item.quantity, 0);
            setCartCount(itemCount);
            return;
          }
        }
        
        // Fallback au localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart) as Array<{ quantity: number }>;
          const itemCount = cartItems.reduce((total: number, item) => total + item.quantity, 0);
          setCartCount(itemCount);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        
        // Fallback au localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart) as Array<{ quantity: number }>;
          const itemCount = cartItems.reduce((total: number, item) => total + item.quantity, 0);
          setCartCount(itemCount);
        } else {
          setCartCount(0);
        }
      }
    };

    // Mettre à jour au chargement
    updateCartCount();

    // Écouter les changements du panier
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [isLoggedIn]);

  return (
    <header className={`enspy-header transition-all duration-300 ${isScrolled ? 'py-2 shadow-lg' : 'py-4'}`}>
      <div className="enspy-container">
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-10 mr-2 rounded-full overflow-hidden border-2 border-white">
              <Image 
                src="/images/enspy.jpg" 
                alt="Logo ENSPY" 
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold text-white">ENSPY <span className="text-accent">E-Commerce</span></span>
          </Link>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-3 py-2 text-white hover:text-accent transition-colors">
              Accueil
            </Link>
            <div className="relative group">
              <button className="px-3 py-2 text-white hover:text-accent transition-colors flex items-center">
                Catégories
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top scale-95 group-hover:scale-100">
                <div className="py-1">
                  <Link href="/shop/categories/fournitures" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Fournitures scolaires
                  </Link>
                  <Link href="/shop/categories/manuels" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Manuels et papeterie
                  </Link>
                  <Link href="/shop/categories/vetements" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Vêtements et accessoires
                  </Link>
                  <Link href="/shop/categories/alimentation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Alimentation et boissons
                  </Link>
                  <Link href="/shop/categories/billets" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Billets et événements
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/shop" className="px-3 py-2 text-white hover:text-accent transition-colors">
              Boutique
            </Link>
            <Link href="/about" className="px-3 py-2 text-white hover:text-accent transition-colors">
              À propos
            </Link>
            <Link href="/contact" className="px-3 py-2 text-white hover:text-accent transition-colors">
              Contact
            </Link>
          </div>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Recherche */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="py-1 pl-3 pr-10 rounded-full text-sm bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim() !== '') {
                    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
              />
              <button 
                className="absolute right-0 top-0 h-full px-2 text-white hover:text-accent transition-colors"
                onClick={() => {
                  if (searchQuery.trim() !== '') {
                    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Panier - visible pour tous */}
            <Link href="/shop/cart" className="relative p-2 text-white hover:text-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Bouton de connexion ou menu utilisateur selon l'état */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-white hover:text-accent transition-colors"
                >
                  Bonjour, {userName}
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 py-2 animate-fade-in">
                    <div className="px-4 py-2 text-gray-800 font-medium border-b border-gray-200">
                      Bonjour, {userName}
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Mon profil
                    </Link>
                    <Link href="/shop/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Mes commandes
                    </Link>
                    <Link href="/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Messages
                    </Link>
                    <Link href="/shop/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Favoris
                    </Link>
                    <Link 
                      href="/vendor/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 relative"
                      onClick={markVendorNotificationsAsRead}
                    >
                      Espace vendeur
                      {hasVendorNotifications && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                      )}
                    </Link>
                    <Link href="/account/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Paramètres
                    </Link>
                    <div className="border-t border-gray-200">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleLogin();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="bg-accent hover:bg-accent-dark text-white py-1 px-4 rounded-md transition-colors">
                Se connecter
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Panier - Mobile */}
            <Link href="/shop/cart" className="relative p-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Menu hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} pt-4 pb-2`}>
          <div className="flex flex-col space-y-2">
            <Link href="/" className="px-3 py-2 text-white hover:bg-white/10 rounded-md">
              Accueil
            </Link>
            <button 
              className="px-3 py-2 text-white hover:bg-white/10 rounded-md text-left flex justify-between items-center"
              onClick={() => {
                // Toggle submenu logic would go here
              }}
            >
              <span>Catégories</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="pl-4 space-y-1">
              <Link href="/shop/categories/fournitures" className="block px-3 py-1 text-white hover:bg-white/10 rounded-md">
                Fournitures scolaires
              </Link>
              <Link href="/shop/categories/manuels" className="block px-3 py-1 text-white hover:bg-white/10 rounded-md">
                Manuels et papeterie
              </Link>
              <Link href="/shop/categories/vetements" className="block px-3 py-1 text-white hover:bg-white/10 rounded-md">
                Vêtements et accessoires
              </Link>
              <Link href="/shop/categories/alimentation" className="block px-3 py-1 text-white hover:bg-white/10 rounded-md">
                Alimentation et boissons
              </Link>
              <Link href="/shop/categories/billets" className="block px-3 py-1 text-white hover:bg-white/10 rounded-md">
                Billets et événements
              </Link>
            </div>
            <Link href="/shop" className="px-3 py-2 text-white hover:bg-white/10 rounded-md">
              Boutique
            </Link>
            <Link href="/about" className="px-3 py-2 text-white hover:bg-white/10 rounded-md">
              À propos
            </Link>
            <Link href="/contact" className="px-3 py-2 text-white hover:bg-white/10 rounded-md">
              Contact
            </Link>
            <div className="pt-2 border-t border-white/20">
              {isLoggedIn ? (
                <>
                  <div className="px-3 py-2 text-white font-medium">
                    Bonjour, {userName}
                  </div>
                  <Link href="/profile" className="block px-3 py-2 text-white hover:bg-white/10 rounded-md">
                    Mon profil
                  </Link>
                  <Link href="/shop/orders" className="block px-3 py-2 text-white hover:bg-white/10 rounded-md">
                    Mes commandes
                  </Link>
                  <Link href="/messages" className="block px-3 py-2 text-white hover:bg-white/10 rounded-md">
                    Messages
                  </Link>
                  <Link href="/shop/favorites" className="block px-3 py-2 text-white hover:bg-white/10 rounded-md">
                    Favoris
                  </Link>
                  <Link 
                    href="/vendor/dashboard" 
                    className="block px-3 py-2 text-white hover:bg-white/10 rounded-md relative"
                    onClick={markVendorNotificationsAsRead}
                  >
                    Espace vendeur
                    {hasVendorNotifications && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                  </Link>
                  <Link href="/account/settings" className="block px-3 py-2 text-white hover:bg-white/10 rounded-md">
                    Paramètres
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLogin();
                    }}
                    className="block w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-md"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth/login"
                  className="block w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-md"
                >
                  Se connecter
                </Link>
              )}
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="w-full py-2 pl-3 pr-10 rounded-md text-sm bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim() !== '') {
                    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                    setIsOpen(false);
                  }
                }}
              />
              <button 
                className="absolute right-0 top-0 h-full px-3 text-white"
                onClick={() => {
                  if (searchQuery.trim() !== '') {
                    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                    setIsOpen(false);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
