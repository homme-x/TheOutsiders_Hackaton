'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/api';
import Image from 'next/image';

interface CategoryData {
  id: number;
  name: string;
}

interface Product {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  stock: number;
  images?: string[];
  image?: string;
  mainImage?: string;
  featured?: boolean;
  discount?: number;
}

interface ProductFormProps {
  onSubmit: (product: Product) => void;
  onCancel: () => void;
  initialData?: Product;
}

export default function ProductForm({ onSubmit, onCancel, initialData }: ProductFormProps) {
  const [product, setProduct] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    categoryId: initialData?.categoryId || '',
    stock: initialData?.stock || '',
    images: initialData?.images || [],
    featured: initialData?.featured || false,
    discount: initialData?.discount || '',
    useLocalImage: false, // Option pour utiliser une image locale
    selectedLocalImage: '', // Chemin de l'image locale sélectionnée
  });

  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [localImages, setLocalImages] = useState<string[]>([]);

  // Charger les catégories au chargement du composant
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await api.categories.getAll();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };

    fetchCategories();
    
    // Charger les images locales disponibles
    loadLocalImages();
  }, []);

  // Fonction pour charger les images locales disponibles
  const loadLocalImages = () => {
    // Liste des images locales disponibles dans le dossier public/images
    const availableImages = [
      '/images/T-shirt.jpg',
      '/images/accessoire.jpg',
      '/images/calculatrice.jpg',
      '/images/carnet.jpg',
      '/images/casque.jpg',
      '/images/cle.jpg',
      '/images/enspy.jpg',
      '/images/fourniture.jpg',
      '/images/livre.jpg',
      '/images/nourriture.jpg',
      '/images/stylo.jpg',
      '/images/tickets.jpg',
      '/images/fourniture scolaire.jpg',
    ];
    
    setLocalImages(availableImages);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
    
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleLocalImageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProduct({
      ...product,
      selectedLocalImage: e.target.value,
      useLocalImage: e.target.value !== '',
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!product.name.trim()) {
      newErrors.name = 'Le nom du produit est requis';
    }
    
    if (!product.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    
    if (!product.price || isNaN(Number(product.price)) || Number(product.price) <= 0) {
      newErrors.price = 'Veuillez entrer un prix valide';
    }
    
    if (!product.categoryId) {
      newErrors.categoryId = 'La catégorie est requise';
    }
    
    if (!product.stock || isNaN(Number(product.stock)) || Number(product.stock) < 0) {
      newErrors.stock = 'Veuillez entrer une quantité valide';
    }
    
    // Vérifier qu'une image est sélectionnée (soit locale, soit téléchargée)
    if (!product.useLocalImage && product.images.length === 0) {
      newErrors.images = 'Veuillez sélectionner au moins une image';
    }
    
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider le formulaire
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    
    // Préparer les données du produit
    const productData: Product = {
      name: product.name,
      description: product.description,
      price: Number(product.price),
      categoryId: Number(product.categoryId),
      stock: Number(product.stock),
      featured: product.featured,
      discount: product.discount ? Number(product.discount) : undefined,
    };
    
    // Ajouter l'image principale
    if (product.useLocalImage && product.selectedLocalImage) {
      productData.mainImage = product.selectedLocalImage;
    } else if (product.images.length > 0) {
      productData.mainImage = product.images[0];
      productData.images = product.images;
    }
    
    // Soumettre le formulaire
    onSubmit(productData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    const newImages = [...product.images];
    let loadedCount = 0;
    
    Array.from(files).forEach(file => {
      // Créer un FileReader pour convertir l'image en Data URL
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          // Ajouter l'URL de données au tableau d'images
          newImages.push(event.target.result.toString());
          
          loadedCount++;
          
          // Quand toutes les images sont chargées, mettre à jour l'état
          if (loadedCount === files.length) {
            setProduct({
              ...product,
              images: newImages,
              useLocalImage: false, // Désactiver l'option d'image locale si on télécharge une image
            });
            setIsUploading(false);
          }
        }
      };
      
      reader.onerror = () => {
        console.error("Erreur lors du chargement de l&apos;image");
        loadedCount++;
        
        if (loadedCount === files.length) {
          setIsUploading(false);
        }
      };
      
      // Lire le fichier comme une URL de données
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...product.images];
    newImages.splice(index, 1);
    setProduct({
      ...product,
      images: newImages,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom du produit */}
        <div className="col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du produit *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={product.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* Prix */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Prix (FCFA) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            min="0"
            step="100"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
        </div>

        {/* Catégorie */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.categoryId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>}
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock disponible *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
        </div>

        {/* Remise */}
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
            Remise (%)
          </label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={product.discount}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Produit mis en avant */}
        <div className="col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={product.featured}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Mettre ce produit en avant sur la page d'accueil
            </label>
          </div>
        </div>

        {/* Sélection d'image locale */}
        <div className="col-span-2">
          <label htmlFor="localImage" className="block text-sm font-medium text-gray-700 mb-1">
            Sélectionner une image locale
          </label>
          <select
            id="localImage"
            name="localImage"
            value={product.selectedLocalImage}
            onChange={handleLocalImageSelect}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Sélectionner une image locale</option>
            {localImages.map((image, index) => (
              <option key={index} value={image}>
                {image.split('/').pop()}
              </option>
            ))}
          </select>
          
          {product.selectedLocalImage && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Aperçu de l&apos;image sélectionnée :</p>
              <div className="relative h-40 w-40">
                <Image 
                  src={product.selectedLocalImage} 
                  alt="Image locale sélectionnée" 
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            </div>
          )}
        </div>

        {/* Ou télécharger une nouvelle image */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Ou télécharger une nouvelle image
            </label>
            {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
          </div>
          
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="images"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                >
                  <span>Télécharger des images</span>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
                <p className="pl-1">ou glisser-déposer</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu&apos;à 10MB</p>
            </div>
          </div>

          {isUploading && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full w-3/4 animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Téléchargement en cours...</p>
            </div>
          )}

          {product.images.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Images téléchargées</h4>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {product.images.map((image: string, index: number) => (
                  <div key={index} className="relative group">
                    <div className="h-24 w-full relative">
                      <Image
                        src={image}
                        alt={`Product ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center space-x-6 pt-6 border-t mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium min-w-[120px]"
        >
          Annuler
        </button>
        <button
          type="submit"
          className={`px-6 py-2.5 text-white rounded-md font-medium shadow-md transition-all min-w-[180px] ${initialData ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {initialData ? 'Mettre à jour' : 'Ajouter le produit'}
        </button>
      </div>
    </form>
  );
}
