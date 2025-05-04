'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AvailabilityIndicator from '@/components/vendor/AvailabilityIndicator';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/app/context/CartContext';
import { api } from '@/lib/api/api'; // Import de l'API

// Interface pour les props du Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

// Composant Modal réutilisable
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

export default function ProductDetail() {
  // Utiliser useParams pour accéder aux paramètres de route
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [liked, setLiked] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // État pour stocker les données du produit
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Utiliser le contexte du panier
  const { addToCart: addItemToCart, getTotalItems } = useCart();

  // États pour les modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });

  // Fonction pour ouvrir une modale
  const openModal = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setModalConfig({ title, message, type });
    setModalOpen(true);
  };

  // Charger les données du produit depuis l'API
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productData = await api.products.getById(productId);
        
        if (productData) {
          // Transformer les données du produit pour correspondre à la structure attendue
          setProduct({
            id: productData.id,
            name: productData.name,
            price: productData.price,
            description: productData.description || 'Ce produit est conçu spécialement pour les étudiants de l\'ENSPY. Il est de haute qualité et durable, parfait pour vos besoins académiques.',
            category: productData.category?.name || 'Produits ENSPY',
            stock: productData.stock || 25,
            rating: productData.rating || 4.5,
            reviews: productData.reviewCount || 12,
            seller: 'Boutique ENSPY',
            image: productData.mainImage || productData.imageUrl || '/images/placeholder.jpg',
            likes: 24,
            sellerInfo: {
              name: 'Boutique ENSPY',
              image: productData.sellerInfo?.image || '/images/enspy.jpg',
              description: 'La boutique officielle de l\'École Nationale Supérieure Polytechnique de Yaoundé. Nous proposons une large gamme de produits pour les étudiants et le personnel.',
              location: 'Campus ENSPY, Yaoundé',
              joinedDate: 'Janvier 2022',
              rating: 4.8,
              totalSales: 1240
            }
          });
        } else {
          // Produit par défaut si l'API ne renvoie pas de données
          setProduct(getDefaultProduct(productId));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des détails du produit:', error);
        // Utiliser les données par défaut en cas d'erreur
        setProduct(getDefaultProduct(productId));
      } finally {
        setLoading(false);
      }
    };

    // Fonction pour obtenir un produit par défaut en cas d'erreur
    const getDefaultProduct = (id: number) => ({
      id: id,
      name: id === 1 ? 'Cahier ENSPY' : 
            id === 2 ? 'T-shirt ENSPY' : 
            id === 3 ? 'Calculatrice scientifique' : 
            id === 4 ? 'Stylo à bille (lot de 5)' : 
            'Produit ENSPY',
      price: id === 1 ? 1500 : 
            id === 2 ? 5000 : 
            id === 3 ? 15000 : 
            id === 4 ? 1000 : 
            3000,
      description: 'Ce produit est conçu spécialement pour les étudiants de l\'ENSPY. Il est de haute qualité et durable, parfait pour vos besoins académiques.',
      category: id === 1 ? 'Fournitures scolaires' : 
                id === 2 ? 'Vêtements et accessoires' : 
                id === 3 ? 'Fournitures scolaires' : 
                id === 4 ? 'Fournitures scolaires' : 
                'Produits ENSPY',
      stock: 25,
      rating: 4.5,
      reviews: 12,
      seller: 'Boutique ENSPY',
      image: id === 1 ? '/images/livre.jpg' : 
            id === 2 ? '/images/T-shirt.jpg' : 
            id === 3 ? '/images/calculatrice.jpg' : 
            id === 4 ? '/images/stylo.jpg' : 
            '/images/enspy.jpg',
      likes: 24,
      sellerInfo: {
        name: 'Boutique ENSPY',
        image: '/images/enspy.jpg',
        description: 'La boutique officielle de l\'École Nationale Supérieure Polytechnique de Yaoundé. Nous proposons une large gamme de produits pour les étudiants et le personnel.',
        location: 'Campus ENSPY, Yaoundé',
        joinedDate: 'Janvier 2022',
        rating: 4.8,
        totalSales: 1240
      }
    });

    fetchProductData();
  }, [productId]);
  
  // Avis fictifs pour la démo
  const reviewsData = [
    {
      id: 1,
      user: 'Thomas K.',
      avatar: '/images/avatar1.jpg',
      rating: 5,
      date: '15 avril 2025',
      text: 'Excellent produit, je le recommande vivement ! La qualité est au rendez-vous et le prix est très raisonnable.',
      likes: 7
    },
    {
      id: 2,
      user: 'Sophie M.',
      avatar: '/images/avatar2.jpg',
      rating: 4,
      date: '2 avril 2025',
      text: 'Très bon produit, livraison rapide sur le campus. Seul bémol : l\'emballage était un peu abîmé.',
      likes: 3
    },
    {
      id: 3,
      user: 'Jean P.',
      avatar: '/images/avatar3.jpg',
      rating: 5,
      date: '28 mars 2025',
      text: 'Parfait pour mes cours, exactement ce dont j\'avais besoin. Le vendeur a été très réactif à mes questions.',
      likes: 5
    }
  ];
  
  // Fonction pour ajouter un avis
  const submitReview = () => {
    if (reviewText.trim() === '') return;
    
    // Dans une application réelle, cette fonction enverrait l'avis à une API
    openModal(
      'Avis publié avec succès', 
      `Merci d'avoir partagé votre expérience ! Votre avis avec une note de ${reviewRating}/5 a été publié.`,
      'success'
    );
    
    setReviewText('');
    setReviewRating(5);
    setShowReviewForm(false);
  };
  
  // Fonction pour liker un produit
  const toggleLike = () => {
    setLiked(!liked);
    // Dans une application réelle, cette fonction enverrait une requête à une API
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const addToCart = () => {
    // Ajouter le produit au panier
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    };
    
    addItemToCart(cartItem);
    
    openModal(
      'Produit ajouté au panier',
      `${quantity} ${product.name} ${quantity > 1 ? 'ont été ajoutés' : 'a été ajouté'} à votre panier.`,
      'success'
    );
  };

  return (
    <div className="py-8">
      <div className="enspy-container">
        {/* Fil d'Ariane */}
        <div className="mb-6">
          <nav className="text-sm text-gray-dark">
            <Link href="/" className="hover:text-primary">Accueil</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-primary">Boutique</Link>
            <span className="mx-2">/</span>
            <Link href={`/shop/categories/${product?.category.toLowerCase()}`} className="hover:text-primary">
              {product?.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{product?.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image du produit */}
          <div className="bg-gray-light rounded-lg overflow-hidden shadow-lg">
            <div className="relative h-80 md:h-96 w-full">
              {product?.image ? (
                <Image 
                  src={product.image}
                  alt={product?.name || 'Produit'}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-200">
                  <p className="text-gray-500">Chargement de l&apos;image...</p>
                </div>
              )}
            </div>
            <motion.button 
              className={`absolute top-4 right-4 p-2 rounded-full ${liked ? 'bg-red-500 text-white' : 'bg-white text-gray-500'} shadow-md`}
              onClick={toggleLike}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>
            <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full shadow-md text-sm font-medium text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {liked ? product?.likes + 1 : product?.likes} J'aime
            </div>
          </div>

          {/* Détails du produit */}
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold mb-2">{product?.name}</h1>
              <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full">
                <span className="text-primary font-medium">{product?.category}</span>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${star <= Math.round(product?.rating) ? 'fill-current' : 'stroke-current fill-none'}`}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-.69h-4.915c-.969 0-1.371-1.24-.588-1.81l3.976-2.888a1 1 0 00.363-1.118l-1.518-4.674z"
                    />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-dark">{product?.rating} ({product?.reviews} avis)</span>
              <button 
                onClick={() => { setActiveTab('reviews'); setShowReviewForm(true); }}
                className="ml-4 text-primary text-sm underline hover:text-primary-dark"
              >
                Donner mon avis
              </button>
            </div>
            
            <p className="text-2xl font-bold text-primary mb-4">{product?.price.toLocaleString()} FCFA</p>
            
            <p className="text-gray-dark mb-6">
              {product?.description}
            </p>
            
            {/* Vendeur */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
                  {product?.sellerInfo?.image ? (
                    <Image 
                      src={product.sellerInfo.image}
                      alt={product?.sellerInfo?.name || 'Vendeur'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{product?.sellerInfo.name}</h3>
                  <div className="flex items-center text-sm">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`h-3 w-3 ${star <= Math.round(product?.sellerInfo.rating) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-gray-600">{product?.sellerInfo.rating}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600">{product?.sellerInfo.totalSales} ventes</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-dark">
                <span className="font-semibold">Vendeur:</span> {product?.seller}
              </p>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-dark">
                <span className="font-semibold">Disponibilité:</span>{' '}
                {product?.stock > 0 ? (
                  <span className="text-success">En stock ({product?.stock} disponibles)</span>
                ) : (
                  <span className="text-error">Rupture de stock</span>
                )}
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-gray-dark mb-2 font-semibold">
                Quantité
              </label>
              <div className="flex">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="bg-gray-light px-3 py-2 border border-gray rounded-l"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={product?.stock}
                  className="w-16 px-3 py-2 border-t border-b border-gray text-center"
                />
                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="bg-gray-light px-3 py-2 border border-gray rounded-r"
                  disabled={quantity >= product?.stock}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={addToCart}
                className="btn-primary flex-grow py-3"
                disabled={product?.stock <= 0}
              >
                Ajouter au panier
              </button>
              <Link href="/shop/cart" className="btn-secondary flex-grow py-3 text-center">
                Voir le panier
              </Link>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-12">
          <div className="border-b border-gray">
            <nav className="flex">
              <button 
                className={`px-6 py-3 font-semibold ${activeTab === 'description' ? 'border-b-2 border-primary text-primary' : 'text-gray-dark hover:text-primary'}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`px-6 py-3 font-semibold ${activeTab === 'reviews' ? 'border-b-2 border-primary text-primary' : 'text-gray-dark hover:text-primary'}`}
                onClick={() => setActiveTab('reviews')}
              >
                Avis ({product?.reviews})
              </button>
              <button 
                className={`px-6 py-3 font-semibold ${activeTab === 'seller' ? 'border-b-2 border-primary text-primary' : 'text-gray-dark hover:text-primary'}`}
                onClick={() => setActiveTab('seller')}
              >
                Vendeur
              </button>
            </nav>
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div 
                className="py-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold mb-4">Description du produit</h2>
                <p className="text-gray-dark mb-4">
                  {product?.description}
                </p>
                <p className="text-gray-dark">
                  Ce produit est vendu par {product?.seller} et est disponible exclusivement pour les étudiants et le personnel de l'ENSPY.
                </p>
              </motion.div>
            )}
            
            {activeTab === 'reviews' && (
              <motion.div 
                className="py-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Avis des clients</h2>
                  <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    {showReviewForm ? 'Annuler' : 'Écrire un avis'}
                  </button>
                </div>
                
                {/* Formulaire d'avis */}
                <AnimatePresence>
                  {showReviewForm && (
                    <motion.div 
                      className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold mb-4">Partagez votre expérience</h3>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Votre note</label>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="mr-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-8 w-8 ${star <= reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'}`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="review" className="block text-gray-700 mb-2">Votre avis</label>
                        <textarea
                          id="review"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          rows={4}
                          placeholder="Partagez votre expérience avec ce produit..."
                        ></textarea>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={submitReview}
                          className="btn-primary px-6 py-2"
                          disabled={reviewText.trim() === ''}
                        >
                          Publier
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Liste des avis */}
                <div className="space-y-6">
                  {reviewsData.map((review) => (
                    <motion.div 
                      key={review.id} 
                      className="border-b border-gray-200 pb-6 last:border-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: review.id * 0.1 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3 bg-gray-200">
                            <Image 
                              src={review.avatar}
                              alt={review.user}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold">{review.user}</h4>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className={`h-5 w-5 ${star <= review.rating ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{review.text}</p>
                      <div className="flex items-center text-sm">
                        <button className="flex items-center text-gray-500 hover:text-primary">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          {review.likes} utile
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {activeTab === 'seller' && (
              <motion.div 
                className="py-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md">
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <div className="relative h-20 w-20 rounded-full overflow-hidden mr-5 border-2 border-primary">
                        {product?.sellerInfo?.image ? (
                          <Image 
                            src={product.sellerInfo.image}
                            alt={product?.sellerInfo?.name || 'Vendeur'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{product?.sellerInfo.name}</h2>
                        <div className="flex items-center text-sm mb-1">
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} className={`h-4 w-4 ${star <= Math.round(product?.sellerInfo.rating) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-gray-600">{product?.sellerInfo.rating} étoiles</span>
                        </div>
                        <p className="text-gray-600">
                          <span className="font-medium">{product?.sellerInfo.totalSales}</span> ventes à ce jour
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">À propos du vendeur</h3>
                        <p className="text-gray-700 mb-4">{product?.sellerInfo.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-gray-700">{product?.sellerInfo.location}</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-700">Membre depuis {product?.sellerInfo.joinedDate}</span>
                          </div>
                        </div>
                      </div>
                      

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Contacter le vendeur</h3>
                        <p className="text-gray-700 mb-4">Vous avez des questions sur ce produit ? N'hésitez pas à contacter le vendeur directement.</p>
                        <button className="btn-primary w-full py-2">
                          Envoyer un message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Produits similaires */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].filter(id => id !== productId).map((id) => (
              <div key={id} className="card hover:shadow-xl transition">
                <Link href={`/shop/products/${id}`}>
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    <span className="text-gray-500">Produit {id}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {id === 1 ? 'Cahier ENSPY' : 
                       id === 2 ? 'T-shirt ENSPY' : 
                       id === 3 ? 'Calculatrice scientifique' : 
                       'Stylo à bille (lot de 5)'}
                    </h3>
                    <p className="text-primary font-bold">
                      {id === 1 ? '1500' : 
                       id === 2 ? '5000' : 
                       id === 3 ? '15000' : 
                       '1000'} FCFA
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
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
            type={modalConfig.type}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
