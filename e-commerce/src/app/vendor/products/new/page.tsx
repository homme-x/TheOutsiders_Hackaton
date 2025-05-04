'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NewProduct() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // États pour le formulaire
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    sku: '',
    weight: '',
    dimensions: '',
    features: [''],
    status: 'Actif'
  });
  
  // Catégories disponibles (alignées avec la page des catégories)
  const categories = [
    'Fournitures scolaires',
    'Manuels et papeterie',
    'Vêtements et accessoires',
    'Alimentation et boissons',
    'Billets et événements'
  ];
  
  // Statuts disponibles
  const statuses = [
    'Actif',
    'Brouillon',
    'En rupture'
  ];

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/auth/login?redirect=/vendor/products/new');
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });
  };
  
  // Gérer les changements dans les caractéristiques
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...productData.features];
    updatedFeatures[index] = value;
    setProductData({
      ...productData,
      features: updatedFeatures
    });
  };
  
  // Ajouter une nouvelle caractéristique
  const addFeature = () => {
    setProductData({
      ...productData,
      features: [...productData.features, '']
    });
  };
  
  // Supprimer une caractéristique
  const removeFeature = (index: number) => {
    const updatedFeatures = [...productData.features];
    updatedFeatures.splice(index, 1);
    setProductData({
      ...productData,
      features: updatedFeatures
    });
  };
  
  // Gérer le téléchargement d'image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la liste des produits
      router.push('/vendor/products');
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* En-tête */}
      <div className="bg-primary text-white py-6">
        <div className="enspy-container">
          <h1 className="text-2xl font-bold">Ajouter un nouveau produit</h1>
          <p className="text-white/80">Créez et publiez un nouveau produit dans votre boutique</p>
        </div>
      </div>
      
      <div className="enspy-container mt-6">
        {/* Navigation du tableau de bord */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <nav className="flex space-x-4">
            <Link href="/vendor/dashboard" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Tableau de bord
            </Link>
            <Link href="/vendor/products" className="px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
              Produits
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
        
        {/* Formulaire de création de produit */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne de gauche - Informations principales */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-semibold mb-4">Informations du produit</h2>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du produit*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={productData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={productData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Prix (FCFA)*
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={productData.price}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie*
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={productData.category}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                      Stock disponible*
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={productData.stock}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                      SKU (Référence)
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={productData.sku}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                      Poids (kg)
                    </label>
                    <input
                      type="text"
                      id="weight"
                      name="weight"
                      value={productData.weight}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-1">
                      Dimensions (L x l x H)
                    </label>
                    <input
                      type="text"
                      id="dimensions"
                      name="dimensions"
                      value={productData.dimensions}
                      onChange={handleChange}
                      placeholder="Ex: 30 x 20 x 10 cm"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caractéristiques principales
                  </label>
                  {productData.features.map((feature, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder={`Caractéristique ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        disabled={productData.features.length === 1}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="mt-2 text-primary hover:text-primary-dark flex items-center"
                  >
                    <i className="fas fa-plus mr-1"></i>
                    Ajouter une caractéristique
                  </button>
                </div>
              </div>
              
              {/* Colonne de droite - Image et statut */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Image et statut</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image principale*
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {previewImage ? (
                      <div className="relative h-48 mb-2">
                        <Image
                          src={previewImage}
                          alt="Aperçu du produit"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="py-8">
                        <i className="fas fa-image text-gray-400 text-5xl mb-2"></i>
                        <p className="text-gray-500">Aucune image sélectionnée</p>
                      </div>
                    )}
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="image"
                      className="mt-2 inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md cursor-pointer transition-colors"
                    >
                      {previewImage ? 'Changer l\'image' : 'Sélectionner une image'}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Format recommandé: JPG, PNG. Taille max: 5MB
                  </p>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Statut du produit
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={productData.status}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {statuses.map((status, index) => (
                      <option key={index} value={status}>{status}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Les produits en brouillon ne sont pas visibles sur la boutique.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <Link
                href="/vendor/products"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Création en cours...
                  </>
                ) : (
                  'Créer le produit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
