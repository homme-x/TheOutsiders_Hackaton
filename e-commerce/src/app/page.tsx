'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/api'; // Import des APIs

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // États pour les données chargées depuis l'API
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fonction pour les animations CSS
  const getScrollAnimation = (index: number) => {
    const animations = ['scroll-fade-in', 'scroll-slide-up', 'scroll-zoom-in'];
    return animations[index % animations.length];
  };
  
  // Fonction pour ajouter un produit au panier
  const addToCart = async (product: any) => {
    try {
      await api.cart.addToCart(product.id, 1);
      alert(`${product.name} ajouté au panier`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  const scrollRefs = {
    categories: useRef<HTMLElement>(null),
    products: useRef<HTMLElement>(null),
    about: useRef<HTMLElement>(null),
    cta: useRef<HTMLElement>(null),
  };

  useEffect(() => {
    setIsVisible(true);
    
    // Charger les catégories depuis l'API
    const fetchCategories = async () => {
      try {
        const categoriesData = await api.categories.getAll();
        if (categoriesData && categoriesData.length > 0) {
          // Mapper les données de l'API au format attendu par le composant
          const mappedCategories = categoriesData.map((cat: any, index: number) => ({
            id: cat.id,
            name: cat.name,
            description: cat.description || 'Découvrez notre sélection de produits',
            image: cat.image || cat.imageUrl || '/images/acceuil1.jpg', // Utiliser image ou imageUrl avec une image par défaut
            color: index % 2 === 0 ? 'from-primary to-primary-dark' : 'from-primary-light to-primary',
            slug: cat.slug || `category-${cat.id}`
          }));
          setCategories(mappedCategories);
        } else {
          // Utiliser les catégories par défaut si l'API ne renvoie pas de données
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setCategories(defaultCategories);
      }
    };
    
    // Charger les produits mis en avant depuis l'API
    const fetchFeaturedProducts = async () => {
      try {
        const productsData = await api.products.getFeatured();
        if (productsData && productsData.length > 0) {
          // Mapper les données de l'API au format attendu par le composant
          const mappedProducts = productsData.map((prod: any) => ({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            image: prod.mainImage || prod.imageUrl || '/images/placeholder.jpg', // Utiliser mainImage en priorité
            category: prod.category?.name || 'Divers',
            rating: prod.rating || 4.5,
            reviews: prod.reviewCount || 0
          }));
          setFeaturedProducts(mappedProducts);
        } else {
          // Utiliser les produits par défaut si l'API ne renvoie pas de données
          setFeaturedProducts(defaultFeaturedProducts);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setFeaturedProducts(defaultFeaturedProducts);
      } finally {
        setLoading(false);
      }
    };
    
    // Exécuter les fonctions de chargement
    fetchCategories();
    fetchFeaturedProducts();
    
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % (categories.length || 5));
    }, 5000);
    
    // Fonction pour gérer les animations au défilement
    const handleScroll = () => {
      // Animation des sections au défilement
      const scrollElements = document.querySelectorAll('.scroll-animate');
      scrollElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementHeight = element.getBoundingClientRect().height;
        const windowHeight = window.innerHeight;
        
        // Activer l'animation lorsque l'élément est visible dans la fenêtre
        if (elementTop < windowHeight - elementHeight / 4) {
          element.classList.add('active');
        }
      });
    };
    
    // Appeler handleScroll une fois au chargement pour animer les éléments déjà visibles
    setTimeout(handleScroll, 100);
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Fonction pour vérifier si un élément est visible dans la fenêtre
  const isInViewport = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  };
  
  // Fonction pour les délais d'animation
  const getAnimationDelay = (index: number) => {
    return `${index * 100}ms`;
  };

  // Catégories par défaut si l'API échoue
  const defaultCategories = [
    {
      id: 1,
      name: 'Fournitures scolaires',
      description: 'Tout ce dont vous avez besoin pour réussir vos études',
      image: '/images/acceuil1.jpg', 
      color: 'from-primary to-primary-dark',
      slug: 'fournitures'
    },
    {
      id: 2,
      name: 'Manuels et papeterie',
      description: 'Les livres et documents essentiels pour vos cours',
      image: '/images/fourniture scolaire.jpg', 
      color: 'from-primary-light to-primary',
      slug: 'manuels'
    },
    {
      id: 3,
      name: 'Vêtements et accessoires',
      description: 'Représentez votre école avec style',
      image: '/images/accessoire.jpg', 
      color: 'from-primary-dark to-primary',
      slug: 'vetements'
    },
    {
      id: 4,
      name: 'Alimentation et boissons',
      description: 'Restez énergisé pendant vos longues sessions d\'étude',
      image: '/images/nourriture.jpg', 
      color: 'from-primary to-primary-light',
      slug: 'alimentation'
    },
    {
      id: 5,
      name: 'Billets et événements',
      description: 'Ne manquez aucun événement important du campus',
      image: '/images/tickets.jpg', 
      color: 'from-primary-dark to-primary-light',
      slug: 'billets'
    }
  ];

  // Produits par défaut si l'API échoue
  const defaultFeaturedProducts = [
    {
      id: 1,
      name: 'Calculatrice scientifique',
      price: 15000,
      image: '/images/calculatrice.jpg', 
      category: 'Fournitures',
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: 'Livre de mathématiques avancées',
      price: 25000,
      image: '/images/livre.jpg', 
      category: 'Manuels',
      rating: 4.5,
      reviews: 89
    },
    {
      id: 3,
      name: 'T-shirt ENSPY',
      price: 8000,
      image: '/images/T-shirt.jpg', 
      category: 'Vêtements',
      rating: 4.7,
      reviews: 156
    },
    {
      id: 4,
      name: 'Billet pour la soirée d\'intégration',
      price: 5000,
      image: '/images/tickets.jpg', 
      category: 'Événements',
      rating: 4.9,
      reviews: 203
    },
    {
      id: 5,
      name: 'Stylo ENSPY',
      price: 1500,
      image: '/images/stylo.jpg', 
      category: 'Fournitures',
      rating: 4.6,
      reviews: 78
    },
    {
      id: 6,
      name: 'Carnet de notes',
      price: 3000,
      image: '/images/carnet.jpg', 
      category: 'Papeterie',
      rating: 4.4,
      reviews: 62
    },
    {
      id: 7,
      name: 'Casquette ENSPY',
      price: 6000,
      image: '/images/casque.jpg', 
      category: 'Vêtements',
      rating: 4.3,
      reviews: 45
    },
    {
      id: 8,
      name: 'Clé USB 32GB',
      price: 7500,
      image: '/images/cle.jpg', 
      category: 'Informatique',
      rating: 4.7,
      reviews: 91
    }
  ];

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section - Prêt pour le remplacement d'image */}
      <section className="hero-section relative h-[90vh] overflow-hidden">
        {/* Image de fond à remplacer par l'utilisateur */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/acceuil.jpg" 
            alt="ENSPY Campus" 
            fill
            priority
            className="object-cover"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary-dark/70 backdrop-blur-[2px] z-1"></div>
        
        {/* Éléments décoratifs animés */}
        <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-[2px] animate-float z-2"></div>
        <div className="absolute bottom-1/3 right-10 w-32 h-32 rounded-full bg-accent/20 backdrop-blur-[2px] animate-pulse z-2"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-primary/30 backdrop-blur-[2px] animate-bounce z-2"></div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="enspy-container z-10 content">
            <div className={`max-w-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-8 flex items-center animate-slide-left">
                <div className="relative h-20 w-20 mr-4 rounded-full overflow-hidden border-4 border-white shadow-lg glow-border">
                  <Image 
                    src="/images/enspy.jpg" 
                    alt="Logo ENSPY" 
                    fill
                    className="object-cover animate-pulse"
                  />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                  ENSPY <span className="text-white bg-accent px-2 py-1 rounded-md ml-2 animate-shimmer">E-Commerce</span>
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-white mb-8 animate-slide-up">
                La plateforme de commerce en ligne exclusive pour la communauté ENSPY
              </p>
              <div className="flex flex-wrap gap-4 animate-slide-up delay-200">
                <Link href="/shop" className="btn btn-primary btn-lg btn-hero hover-scale">
                  <span className="relative z-10">Découvrir les produits</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Vague décorative en bas */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Espace entre les sections */}
      <div className="py-12 bg-white">
        <div className="enspy-container">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block">
              Catégories populaires
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Découvrez notre large sélection de produits et services spécialement sélectionnés pour la communauté ENSPY
            </p>
          </div>
        </div>
      </div>
      
      {/* Categories Section - Caroussel */}
      <section ref={scrollRefs.categories} className="py-8 relative overflow-hidden bg-white">
        {/* Caroussel des catégories */}
        <div className="enspy-container">
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
            {categories.map((category, index) => (
              <div 
                key={category.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === activeCategory ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {/* Image de fond qui remplit tout le carrousel */}
                <div className="absolute inset-0 w-full h-full">
                  {category.image ? (
                    <>
                      <Image 
                        src={category.image} 
                        alt={category.name} 
                        fill
                        priority={index === 0}
                        className="object-cover w-full h-full"
                      />
                      {/* Overlay pour améliorer la lisibilité du texte */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
                    </>
                  ) : (
                    <div className="bg-gradient-to-r from-primary to-primary-dark w-full h-full flex items-center justify-center">
                      <p className="text-white text-lg">Chargement de l&apos;image...</p>
                    </div>
                  )}
                </div>
                
                {/* Contenu de la catégorie */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center max-w-3xl px-6">
                    <span className="inline-block px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full mb-4 animate-pulse">
                      Catégorie {category.id}
                    </span>
                    <h3 className="text-4xl font-bold mb-4 text-white">{category.name}</h3>
                    <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                      {category.description}
                    </p>
                    <Link 
                      href={`/shop/categories/${category.slug}`} 
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
                    >
                      Explorer cette catégorie
                      <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Indicateurs de navigation */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
              {categories.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveCategory(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === activeCategory ? 'bg-white scale-125 w-10' : 'bg-white/50'}`}
                  aria-label={`Voir catégorie ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Boutons de navigation */}
            <button 
              onClick={() => setActiveCategory(prev => (prev === 0 ? categories.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all z-20"
              aria-label="Catégorie précédente"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={() => setActiveCategory(prev => (prev === categories.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all z-20"
              aria-label="Catégorie suivante"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products - Améliorée avec animations au défilement */}
      <section ref={scrollRefs.products} className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl"></div>
        
        <div className="enspy-container relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 scroll-animate scroll-slide-right">
            <div className="md:max-w-xl">
              <h2 className="text-4xl font-bold mb-6 relative inline-block">
                Produits populaires
                <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-primary rounded-full animate-expand"></span>
              </h2>
              <p className="text-gray-600 text-lg">
                Les articles les plus appréciés par la communauté ENSPY, sélectionnés pour leur qualité et leur popularité
              </p>
            </div>
            <Link href="/shop" className="group flex items-center text-primary font-medium mt-4 md:mt-0 self-start md:self-auto">
              <span>Voir tous les produits</span>
              <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 8).map((product, index) => {
              // Différentes animations pour chaque produit
              const animations = [
                'scroll-fade-in',
                'scroll-slide-up',
                'scroll-slide-right',
                'scroll-slide-left',
                'scroll-zoom-in'
              ];
              const animation = animations[index % animations.length];
              const delay = `${(index % 4) * 150}ms`;
              
              return (
              <div 
                key={product.id} 
                className={`card hover-lift group scroll-animate ${animation}`} 
                style={{ animationDelay: delay, transitionDelay: delay }}
              >
                <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                  <Link href={`/shop/products/${product.id}`}>
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>
                  <div className="absolute top-2 right-2">
                    <span className="badge badge-primary">{product.category}</span>
                  </div>
                </div>
                <div className="p-4">
                  <Link href={`/shop/products/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-lg">{product.price.toLocaleString()} FCFA</p>
                    <div className="flex gap-2">
                      <Link href={`/shop/products/${product.id}`} className="btn btn-sm btn-secondary">
                        Voir détails
                      </Link>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => addToCart(product)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={scrollRefs.about} className="py-16 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-accent/10 blur-3xl"></div>
        
        <div className="enspy-container relative z-10">
          <div className="text-center mb-12 scroll-animate scroll-slide-up">
            <h2 className="text-3xl font-bold mb-4">Pourquoi ENSPY E-Commerce ?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Notre plateforme est conçue spécifiquement pour répondre aux besoins de la communauté ENSPY
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-white shadow-soft hover-lift scroll-animate scroll-slide-up" style={{ transitionDelay: '100ms' }}>
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 mx-auto animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Exclusivité ENSPY</h3>
              <p className="text-gray-600 text-center">
                Accès exclusif pour les étudiants, enseignants et personnel de l'ENSPY, garantissant un environnement de confiance.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-white shadow-soft hover-lift scroll-animate scroll-slide-up" style={{ transitionDelay: '300ms' }}>
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 mx-auto animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Paiements sécurisés</h3>
              <p className="text-gray-600 text-center">
                Options de paiement flexibles et sécurisées, adaptées aux besoins des étudiants et du personnel.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-white shadow-soft hover-lift scroll-animate scroll-slide-up" style={{ transitionDelay: '500ms' }}>
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 mx-auto animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Livraison sur le campus</h3>
              <p className="text-gray-600 text-center">
                Livraison rapide et pratique directement sur le campus de l'ENSPY, sans frais supplémentaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Modifiée sans le bouton créer un compte */}
      <section ref={scrollRefs.cta} className="py-20 bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
        
        {/* Éléments décoratifs supplémentaires */}
        <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/5 animate-float delay-300"></div>
        <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-full bg-primary/5 animate-float delay-500"></div>
        
        <div className="enspy-container relative z-10">
          <div className="max-w-3xl mx-auto text-center scroll-animate scroll-zoom-in">
            <h2 className="text-4xl font-bold mb-6 text-primary">Découvrez l'expérience ENSPY E-Commerce</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-700">
              Profitez d'une plateforme exclusive dédiée à la communauté ENSPY avec des produits de qualité et un service personnalisé.
            </p>
            <div className="scroll-animate scroll-slide-up" style={{ transitionDelay: '300ms' }}>
              <Link 
                href="/shop" 
                className="inline-flex items-center px-8 py-4 bg-yellow-500 text-black rounded-full font-bold text-lg shadow-lg hover:bg-yellow-400 transition-all duration-300 hover:shadow-xl hover:scale-105 transform border-2 border-yellow-600"
                style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)' }}
              >
                <span className="text-black">Explorer les produits</span>
                <svg className="ml-2 w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
