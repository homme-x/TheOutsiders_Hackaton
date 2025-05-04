'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/app/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api/api'; // Import des APIs

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearchTerm = searchParams.get('search');

  // États pour les données chargées depuis l'API
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // État pour la modale de confirmation
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'success'
  });
  
  // État pour les produits likés
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  
  // Utiliser le contexte du panier
  const { addToCart } = useCart();
  
  // Fonction pour ouvrir une modale
  const openModal = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setModalConfig({ title, message, type });
    setModalOpen(true);
  };
  
  // Fonction pour liker/unliker un produit
  const toggleLike = (productId: number, event: React.MouseEvent) => {
    event.preventDefault(); // Empêcher la navigation vers la page du produit
    event.stopPropagation(); // Empêcher la propagation de l'événement
    
    setLikedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };
  
  // Fonction pour ajouter un produit au panier
  const handleAddToCart = async (product: any, event: React.MouseEvent) => {
    event.preventDefault(); // Empêcher la navigation vers la page du produit
    event.stopPropagation(); // Empêcher la propagation de l'événement
    
    try {
      // Appel à l'API pour ajouter au panier
      await api.cart.addToCart(product.id, 1);
      
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      };
      
      addToCart(cartItem);
      
      openModal(
        'Produit ajouté au panier',
        `${product.name} a été ajouté à votre panier.`,
        'success'
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      openModal(
        'Erreur',
        `Impossible d'ajouter ${product.name} au panier.`,
        'error'
      );
    }
  };
  
  // Composant Modal réutilisable
  interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info';
  }
  
  const Modal = ({ isOpen, onClose, title, message, type = 'success' }: ModalProps) => {
    if (!isOpen) return null;
    
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`p-4 ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-primary'} text-white`}>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-700">{message}</p>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <button 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  // Produits par défaut si l'API échoue
  const defaultProducts = [
    { id: 1, name: 'Cahier ENSPY', price: 1500, category: 'fournitures', image: '/images/carnet.jpg', popularity: 4.5, stock: 25 },
    { id: 2, name: 'T-shirt ENSPY', price: 5000, category: 'vetements', image: '/images/T-shirt.jpg', popularity: 4.8, stock: 12 },
    { id: 3, name: 'Calculatrice scientifique', price: 15000, category: 'fournitures', image: '/images/calculatrice.jpg', popularity: 4.2, stock: 8 },
    { id: 4, name: 'Stylo à bille (lot de 5)', price: 1000, category: 'fournitures', image: '/images/stylo.jpg', popularity: 4.0, stock: 50 },
    { id: 5, name: 'Manuel d\'algorithmique', price: 8000, category: 'manuels', image: '/images/livre.jpg', popularity: 4.3, stock: 15 },
    { id: 6, name: 'Casquette ENSPY', price: 3500, category: 'vetements', image: '/images/accessoire.jpg', popularity: 3.9, stock: 20 },
    { id: 7, name: 'Bouteille d\'eau', price: 500, category: 'alimentation', image: '/images/nourriture.jpg', popularity: 4.1, stock: 100 },
    { id: 8, name: 'Billet soirée d\'intégration', price: 2000, category: 'billets', image: '/images/tickets.jpg', popularity: 4.7, stock: 200 },
  ];

  // Catégories par défaut si l'API échoue
  const defaultCategories = [
    { id: 'all', name: 'Toutes les catégories' },
    { id: 'fournitures', name: 'Fournitures scolaires' },
    { id: 'manuels', name: 'Manuels et papeterie' },
    { id: 'vetements', name: 'Vêtements et accessoires' },
    { id: 'alimentation', name: 'Alimentation et boissons' },
    { id: 'billets', name: 'Billets et événements' },
  ];

  // Charger les catégories et les produits depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await api.categories.getAll();
        if (categoriesData && categoriesData.length > 0) {
          // Ajouter l'option "Toutes les catégories" en premier
          const allCategories = [
            { id: 'all', name: 'Toutes les catégories' },
            ...categoriesData.map((cat: any) => ({
              id: cat.slug || cat.id.toString(),
              name: cat.name
            }))
          ];
          setCategories(allCategories);
        } else {
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setCategories(defaultCategories);
      }
    };

    const fetchProducts = async () => {
      try {
        // Si une catégorie est sélectionnée, charger les produits de cette catégorie
        let productsData;
        if (selectedCategory !== 'all') {
          // Trouver l'ID de la catégorie à partir du slug
          const category = categories.find(cat => cat.id === selectedCategory);
          if (category && category.id !== 'all') {
            productsData = await api.products.getByCategory(parseInt(category.id));
          } else {
            productsData = await api.products.getAll();
          }
        } else {
          productsData = await api.products.getAll();
        }

        // Si un terme de recherche est défini, filtrer les produits
        if (searchTerm && productsData) {
          productsData = await api.products.search(searchTerm);
        }

        if (productsData && productsData.length > 0) {
          // Mapper les données de l'API au format attendu par le composant
          const mappedProducts = productsData.map((prod: any) => ({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            category: prod.category?.slug || 'divers',
            image: prod.mainImage || prod.imageUrl || '/images/placeholder.jpg',
            popularity: prod.rating || 4.0,
            stock: prod.stock || 0
          }));
          setProducts(mappedProducts);
        } else {
          setProducts(defaultProducts);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  // Mettre à jour le terme de recherche quand l'URL change
  useEffect(() => {
    setSearchTerm(urlSearchTerm || '');
  }, [urlSearchTerm]);

  // Filtrer les produits en fonction de la recherche et de la catégorie
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Trier les produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    // Par défaut, trier par popularité
    return b.popularity - a.popularity;
  });

  return (
    <>
      <div className="py-8">
        <div className="enspy-container">
          <h1 className="text-3xl font-bold mb-8">Boutique ENSPY</h1>

          {/* Barre de recherche et filtres */}
          <div className="bg-gray-light p-6 rounded-lg mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  style={urlSearchTerm ? { boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.3)' } : {}}
                />
              </div>
              <div className="md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray rounded focus:outline-none focus:border-primary"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray rounded focus:outline-none focus:border-primary"
                >
                  <option value="popularity">Popularité</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="name">Nom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Affichage du chargement */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Aucun produit trouvé</h2>
              <p className="text-gray-dark">Essayez de modifier vos critères de recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <div key={product.id} className="card hover:shadow-xl transition relative group">
                  <Link href={`/shop/products/${product.id}`} className="block">
                    <div className="relative bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                      <Image 
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Badge catégorie */}
                      <div className="absolute top-2 left-2 bg-primary/80 px-2 py-1 rounded text-xs font-medium text-white">
                        {categories.find(cat => cat.id === product.category)?.name || product.category}
                      </div>
                      
                      {/* Bouton like */}
                      <motion.button 
                        className={`absolute top-2 right-2 p-2 rounded-full ${likedProducts.includes(product.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-500'} shadow-md`}
                        onClick={(e) => toggleLike(product.id, e)}
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={likedProducts.includes(product.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </motion.button>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-primary font-bold mb-4">{product.price.toLocaleString()} FCFA</p>
                      <div className="flex flex-col space-y-2 mb-4">
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ${star <= Math.round(product.popularity) ? 'fill-current' : 'stroke-current fill-none'}`}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-dark ml-2">
                            {product.popularity.toFixed(1)}
                          </span>
                        </div>
                        
                        {/* Information de stock */}
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                          {product.stock > 0 ? (
                            <span className={`text-sm ${product.stock < 10 ? 'text-orange-500 font-medium' : 'text-green-600'}`}>
                              {product.stock} en stock
                            </span>
                          ) : (
                            <span className="text-sm text-red-500 font-medium">Rupture de stock</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <button 
                      className="btn-primary w-full flex items-center justify-center"
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={product.stock <= 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal pour les confirmations */}
      <AnimatePresence>
        {modalOpen && (
          <Modal 
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title={modalConfig.title}
            message={modalConfig.message}
            type={modalConfig.type as 'success' | 'error' | 'info'}
          />
        )}
      </AnimatePresence>
    </>
  );
}
