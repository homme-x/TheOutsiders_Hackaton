'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import ProductForm from '@/components/vendor/ProductForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import Image from 'next/image';
import { api } from '@/lib/api/api';

// Définition des types
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  categoryId: number;
  stock: number;
  image: string;
  mainImage?: string;
  rating?: number;
  featured?: boolean;
  status?: string;
}

interface CategoryData {
  id: number;
  name: string;
}

interface ProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  mainImage: string;
  rating: number;
  featured: boolean;
  isActive: boolean;
  category: CategoryData;
}

// Composant pour la carte de produit
const ProductCard = ({ product, onEdit, onDelete }: { 
  product: Product, 
  onEdit: (id: string) => void, 
  onDelete: (id: string) => void 
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group">
    <div 
      className="relative h-48"
      onClick={() => onEdit(product.id)}
    >
      {product.image ? (
        product.image.startsWith('data:') ? (
          // Si c'est une Data URL (image téléchargée par l'utilisateur)
          <Image 
            src={product.image} 
            alt={product.name} 
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
          />
        ) : (
          // Si c'est une URL normale
          <Image 
            src={product.image} 
            alt={product.name} 
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
          />
        )
      ) : (
        // Image par défaut si aucune image n'est disponible
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      )}
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          product.status === 'Actif' 
            ? 'bg-green-100 text-green-800' 
            : product.status === 'En rupture' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-yellow-100 text-yellow-800'
        }`}>
          {product.status}
        </span>
      </div>
    </div>
    <div 
      className="p-4"
      onClick={() => onEdit(product.id)}
    >
      <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{product.category}</p>
      <div className="flex justify-between items-center mb-3">
        <span className="text-lg font-bold">{product.price} FCFA</span>
        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
      </div>
      <div className="flex space-x-2">
        <button 
          className="flex-1 bg-primary text-white py-2 px-3 rounded-md hover:bg-primary-dark transition-colors"
        >
          Modifier
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product.id);
          }}
          className="bg-white text-red-500 py-2 px-3 rounded-md border border-red-500 hover:bg-red-50 transition-colors flex items-center"
          aria-label="Supprimer le produit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export default function VendorProducts() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Statuts possibles pour les produits
  const statuses = ['Tous', 'Actif', 'En rupture', 'Inactif'];

  // Filtrer les produits en fonction des critères de recherche
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filtrer par terme de recherche
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtrer par catégorie
      const matchesCategory = categoryFilter === '' || product.categoryId === Number(categoryFilter);
      
      // Filtrer par statut
      const matchesStatus = statusFilter === '' || statusFilter === 'Tous' || product.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  // Vérifier si l'utilisateur est connecté
  const checkAuth = useCallback(() => {
    try {
      const isLoggedIn = api.auth.isAuthenticated();
      if (!isLoggedIn) {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      router.push('/auth/login');
    }
  }, [router]);

  // Charger les produits et les catégories au chargement
  useEffect(() => {
    checkAuth();
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Récupérer les produits du vendeur
        const productsData = await api.vendor.getMyProducts();
        
        // Formater les données des produits
        const formattedProducts = productsData.map((product: ProductData) => ({
          id: product.id.toString(),
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category?.name || 'Non catégorisé',
          categoryId: product.category?.id || 0, // Stocker l'ID de la catégorie
          stock: product.stock,
          image: product.mainImage || '/images/placeholder.jpg',
          rating: product.rating,
          featured: product.featured,
          status: product.stock > 0 ? (product.isActive ? 'Actif' : 'Inactif') : 'En rupture'
        }));
        
        setProducts(formattedProducts);
        
        // Récupérer les catégories
        const categoriesData = await api.categories.getAll();
        // Stocker les catégories avec leur ID et leur nom
        const formattedCategories = categoriesData.map((cat: CategoryData) => ({
          id: cat.id,
          name: cat.name
        }));
        setCategories(formattedCategories);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger vos produits. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [checkAuth]);

  // Gérer la modification d'un produit
  const handleEditProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsEditMode(true);
      setShowModal(true);
    }
  };

  // Gérer la suppression d'un produit
  const handleDeleteProduct = (id: string) => {
    setProductToDelete(id);
    setShowConfirmDialog(true);
  };

  // Confirmer la suppression d'un produit
  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      setIsLoading(true);
      try {
        await api.vendor.deleteProduct(Number(productToDelete));
        
        // Mettre à jour la liste des produits
        setProducts(products.filter(p => p.id !== productToDelete));
        setShowConfirmDialog(false);
        setProductToDelete(null);
      } catch (err) {
        console.error('Erreur lors de la suppression du produit:', err);
        setError('Impossible de supprimer le produit. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Ajouter ou modifier un produit
  const handleSubmitProduct = async (productData: Product) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Préparer les données pour l'API
      const apiProductData = {
        name: productData.name,
        description: productData.description || '',
        price: productData.price,
        categoryId: productData.categoryId,
        stock: productData.stock,
        mainImage: productData.mainImage || '',
        isActive: productData.status !== 'Brouillon',
        featured: productData.featured || false
      };
      
      console.log('Données du produit à envoyer:', apiProductData);
      
      if (isEditMode && selectedProduct) {
        // Mettre à jour un produit existant
        await api.vendor.updateProduct(Number(selectedProduct.id), apiProductData);
        
        // Mettre à jour le produit dans la liste locale
        setProducts(prevProducts => 
          prevProducts.map(prod => 
            prod.id === selectedProduct.id 
              ? {
                  ...prod,
                  name: productData.name,
                  description: productData.description,
                  price: productData.price,
                  categoryId: productData.categoryId,
                  category: categories.find(c => c.id === productData.categoryId)?.name || prod.category,
                  stock: productData.stock,
                  image: productData.mainImage || prod.image,
                  featured: productData.featured,
                  status: productData.status || prod.status
                }
              : prod
          )
        );
      } else {
        // Créer un nouveau produit
        const newProduct = await api.vendor.addProduct(apiProductData);
        
        // Ajouter le nouveau produit à la liste locale
        setProducts(prevProducts => [
          ...prevProducts,
          {
            id: String(newProduct.id),
            name: productData.name,
            description: productData.description,
            price: productData.price,
            categoryId: productData.categoryId,
            category: categories.find(c => c.id === productData.categoryId)?.name || 'Non catégorisé',
            stock: productData.stock,
            image: productData.mainImage || '/images/placeholder.jpg',
            featured: productData.featured || false,
            status: 'Actif'
          }
        ]);
      }
      
      // Fermer la modale
      setShowModal(false);
      setSelectedProduct(null);
      setIsEditMode(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du produit:', error);
      setError('Impossible d\'enregistrer le produit. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Ouvrir la modale d'ajout de produit
  const openAddProductModal = () => {
    setSelectedProduct(null);
    setIsEditMode(false);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des produits</h1>
      
      {/* Afficher les erreurs */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Afficher un indicateur de chargement */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {!isLoading && (
        <div>
          {/* En-tête */}
          <div className="bg-primary text-white py-6">
            <div className="enspy-container">
              <h1 className="text-2xl font-bold text-orange-300">Gestion des produits</h1>
              <p className="text-orange-300 font-medium">Ajoutez, modifiez et gérez vos produits</p>
            </div>
          </div>
          
          <div className="enspy-container mt-6">
            {/* Navigation du tableau de bord */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <nav className="flex flex-wrap space-x-1 md:space-x-4">
                <Link href="/vendor/dashboard" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                  Tableau de bord
                </Link>
                <Link href="/vendor/products" className="px-3 py-2 rounded-md bg-white text-secondary font-medium relative">
                  Produits
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-secondary-dark"></span>
                </Link>
                <Link href="/vendor/orders" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                  Commandes
                </Link>
                <Link href="/vendor/inventory" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                  Inventaire
                </Link>
                <Link href="/vendor/promotions" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                  Promotions
                </Link>
                <Link href="/vendor/reports" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                  Rapports
                </Link>
                <Link href="/vendor/settings" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                  Paramètres
                </Link>
              </nav>
            </div>
            
            {/* Barre d'actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <select
                  className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">Toutes catégories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.id}>{category.name}</option>
                  ))}
                </select>
                
                <select
                  className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Tous statuts</option>
                  {statuses.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
                
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-white text-primary py-2 px-4 rounded-md border border-primary hover:bg-gray-50 transition-colors flex items-center font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <b>Ajouter un produit</b>
                </button>
              </div>
            </div>
            
            {/* Liste des produits */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onEdit={handleEditProduct} 
                    onDelete={handleDeleteProduct} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <i className="fas fa-box-open text-gray-400 text-5xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || categoryFilter || statusFilter 
                    ? "Aucun produit ne correspond à vos critères de recherche." 
                    : "Vous n'avez pas encore ajouté de produits."}
                </p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-white text-primary py-2 px-4 rounded-md border border-primary hover:bg-gray-50 transition-colors inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Ajouter un produit
                </button>
              </div>
            )}
          </div>
          
          {/* Bouton d'action flottant */}
          <button 
            onClick={openAddProductModal}
            className="fixed bottom-8 right-8 bg-white hover:bg-gray-50 text-primary w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
            title="Ajouter un produit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Modale d'ajout/modification de produit */}
          {showModal && (
            <Modal 
              title={isEditMode ? "Modifier le produit" : "Ajouter un produit"}
              onClose={() => {
                setShowModal(false);
                setSelectedProduct(null);
                setIsEditMode(false);
              }}
            >
              <ProductForm 
                onSubmit={handleSubmitProduct} 
                onCancel={() => {
                  setShowModal(false);
                  setSelectedProduct(null);
                  setIsEditMode(false);
                }} 
                initialData={selectedProduct}
              />
            </Modal>
          )}
          
          {/* Dialogue de confirmation de suppression */}
          <ConfirmDialog
            isOpen={showConfirmDialog}
            title="Confirmer la suppression"
            message="Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible."
            onConfirm={confirmDeleteProduct}
            onCancel={() => {
              setShowConfirmDialog(false);
              setProductToDelete(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
