'use client';

import { useState } from 'react';

interface PromotionFormProps {
  onSubmit: (promotion: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export default function PromotionForm({ onSubmit, onCancel, initialData }: PromotionFormProps) {
  const [promotion, setPromotion] = useState({
    name: initialData?.name || '',
    type: initialData?.type || '',
    value: initialData?.value || '',
    products: initialData?.products || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    status: initialData?.status || 'Planifiée',
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setPromotion({
      ...promotion,
      [name]: value,
    });
    
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!promotion.name.trim()) {
      newErrors.name = 'Le nom de la promotion est requis';
    }
    
    if (!promotion.type) {
      newErrors.type = 'Le type de promotion est requis';
    }
    
    if (!promotion.value.trim()) {
      newErrors.value = 'La valeur de la promotion est requise';
    }
    
    if (!promotion.products.trim()) {
      newErrors.products = 'Veuillez spécifier les produits concernés';
    }
    
    if (!promotion.startDate) {
      newErrors.startDate = 'La date de début est requise';
    }
    
    if (!promotion.endDate) {
      newErrors.endDate = 'La date de fin est requise';
    } else if (promotion.startDate && new Date(promotion.startDate) > new Date(promotion.endDate)) {
      newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(promotion);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom de la promotion */}
        <div className="col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la promotion *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={promotion.name}
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
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={promotion.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Type de promotion */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type de promotion *
          </label>
          <select
            id="type"
            name="type"
            value={promotion.type}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionner un type</option>
            <option value="Pourcentage">Pourcentage</option>
            <option value="Montant fixe">Montant fixe</option>
            <option value="Produit offert">Produit offert</option>
            <option value="Livraison gratuite">Livraison gratuite</option>
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
        </div>

        {/* Valeur de la promotion */}
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
            Valeur *
          </label>
          <input
            type="text"
            id="value"
            name="value"
            value={promotion.value}
            onChange={handleChange}
            placeholder={promotion.type === 'Pourcentage' ? '15%' : promotion.type === 'Montant fixe' ? '5000 FCFA' : ''}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.value ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.value && <p className="mt-1 text-sm text-red-500">{errors.value}</p>}
        </div>

        {/* Produits concernés */}
        <div className="col-span-2">
          <label htmlFor="products" className="block text-sm font-medium text-gray-700 mb-1">
            Produits concernés *
          </label>
          <input
            type="text"
            id="products"
            name="products"
            value={promotion.products}
            onChange={handleChange}
            placeholder="Ex: Tous les smartphones, Catégorie audio, etc."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.products ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.products && <p className="mt-1 text-sm text-red-500">{errors.products}</p>}
        </div>

        {/* Date de début */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date de début *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={promotion.startDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.startDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
        </div>

        {/* Date de fin */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date de fin *
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={promotion.endDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.endDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
        </div>

        {/* Statut */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            id="status"
            name="status"
            value={promotion.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Planifiée">Planifiée</option>
            <option value="Active">Active</option>
            <option value="Terminée">Terminée</option>
            <option value="Suspendue">Suspendue</option>
          </select>
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
          {initialData ? 'Mettre à jour' : 'Ajouter la promotion'}
        </button>
      </div>
    </form>
  );
}
