'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import PromotionForm from '@/components/vendor/PromotionForm';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function VendorPromotions() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [promotions, setPromotions] = useState<Array<{
    id: string;
    name: string;
    type: string;
    value: string;
    products: string;
    startDate: string;
    endDate: string;
    status: string;
  }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Données factices pour la démonstration
  const mockPromotions = useMemo(() => [
    {
      id: "1",
      name: "Soldes de rentrée",
      type: "Pourcentage",
      value: "15%",
      products: "Tous les ordinateurs portables",
      startDate: "01/09/2025",
      endDate: "15/09/2025",
      status: "Planifiée"
    },
    {
      id: "2",
      name: "Offre spéciale smartphones",
      type: "Pourcentage",
      value: "10%",
      products: "Smartphones ENSPY X",
      startDate: "15/05/2025",
      endDate: "30/05/2025",
      status: "Active"
    },
    {
      id: "3",
      name: "Remise accessoires",
      type: "Montant fixe",
      value: "5000 FCFA",
      products: "Casques et écouteurs",
      startDate: "01/05/2025",
      endDate: "31/05/2025",
      status: "Active"
    },
    {
      id: "4",
      name: "Black Friday",
      type: "Pourcentage",
      value: "30%",
      products: "Tous les produits",
      startDate: "29/11/2025",
      endDate: "01/12/2025",
      status: "Planifiée"
    },
    {
      id: "5",
      name: "Promotion de Pâques",
      type: "Pourcentage",
      value: "12%",
      products: "Tablettes et accessoires",
      startDate: "01/04/2025",
      endDate: "10/04/2025",
      status: "Terminée"
    }
  ], []);

  // Statuts uniques pour le filtre
  const statuses = useMemo(() => [...new Set(mockPromotions.map(promo => promo.status))], [mockPromotions]);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/auth/login?redirect=/vendor/promotions');
      } else {
        setIsLoading(false);
        // Charger les promotions (simulé)
        setPromotions(mockPromotions);
      }
    };
    
    checkAuth();
  }, [router, mockPromotions]);

  // Filtrer les promotions
  const filteredPromotions = useMemo(() => promotions.filter(promo => {
    const matchesSearch = promo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || promo.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }), [promotions, searchTerm, statusFilter]);

  // Supprimer une promotion
  const handleDeletePromotion = (id: string) => {
    setPromotionToDelete(id);
    setShowConfirmDialog(true);
  };

  // Confirmer la suppression d'une promotion
  const confirmDeletePromotion = () => {
    if (promotionToDelete) {
      setPromotions(promotions.filter(promo => promo.id !== promotionToDelete));
      setShowConfirmDialog(false);
      setPromotionToDelete(null);
    }
  };

  // Gérer la modification d'une promotion
  const handleEditPromotion = (id: string) => {
    const promotionToEdit = promotions.find(p => p.id === id);
    if (promotionToEdit) {
      setSelectedPromotion(promotionToEdit);
      setIsEditMode(true);
      setShowModal(true);
    }
  };

  // Ajouter ou modifier une promotion
  const handleSubmitPromotion = (promotionData: {
    name: string;
    type: string;
    value: string;
    products: string;
    startDate: string;
    endDate: string;
    status?: string;
  }) => {
    if (isEditMode && selectedPromotion) {
      // Mode édition
      const updatedPromotion = {
        ...selectedPromotion,
        name: promotionData.name,
        type: promotionData.type,
        value: promotionData.value,
        products: promotionData.products,
        startDate: promotionData.startDate,
        endDate: promotionData.endDate,
        status: promotionData.status || selectedPromotion.status
      };
      
      setPromotions(promotions.map(p => p.id === selectedPromotion.id ? updatedPromotion : p));
    } else {
      // Mode ajout
      const newPromotion = {
        id: Date.now().toString(), // Générer un ID unique (dans une implémentation réelle, ce serait fait par le backend)
        name: promotionData.name,
        type: promotionData.type,
        value: promotionData.value,
        products: promotionData.products,
        startDate: promotionData.startDate,
        endDate: promotionData.endDate,
        status: promotionData.status || 'Planifiée'
      };
      
      setPromotions([newPromotion, ...promotions]);
    }
    
    // Réinitialiser les états
    setShowModal(false);
    setSelectedPromotion(null);
    setIsEditMode(false);
  };
  
  // Ouvrir la modale d'ajout de promotion
  const openAddPromotionModal = () => {
    setIsEditMode(false);
    setSelectedPromotion(null);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 relative">
      {/* En-tête */}
      <div className="bg-primary text-white py-6">
        <div className="enspy-container">
          <h1 className="text-2xl font-bold text-orange-300">Gestion des promotions</h1>
          <p className="text-orange-300 font-medium">Créez et gérez des offres spéciales pour vos produits</p>
        </div>
      </div>
      
      <div className="enspy-container mt-6">
        {/* Navigation du tableau de bord */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <nav className="flex flex-wrap space-x-1 md:space-x-4">
            <Link href="/vendor/dashboard" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Tableau de bord
            </Link>
            <Link href="/vendor/products" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Produits
            </Link>
            <Link href="/vendor/orders" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Commandes
            </Link>
            <Link href="/vendor/inventory" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Inventaire
            </Link>
            <Link href="/vendor/promotions" className="px-3 py-2 rounded-md bg-white text-secondary font-medium relative">
              Promotions
              <span className="absolute bottom-0 left-0 w-full h-1 bg-secondary-dark"></span>
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
                placeholder="Rechercher une promotion..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tous statuts</option>
              {statuses.map((status, index) => (
                <option key={index} value={status}>{status}</option>
              ))}
            </select>
            
            <button 
              className="bg-white text-primary py-2 px-4 rounded-md border border-primary hover:bg-gray-50 transition-colors flex items-center font-medium"
              onClick={openAddPromotionModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <b>Nouvelle promotion</b>
            </button>
          </div>
        </div>
        
        {/* Liste des promotions */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valeur
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produits
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Période
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPromotions.length > 0 ? (
                  filteredPromotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleEditPromotion(promo.id)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{promo.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {promo.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {promo.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {promo.products}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Du {promo.startDate} au {promo.endDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          promo.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : promo.status === 'Planifiée' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {promo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          className="text-primary hover:text-primary-dark mr-3 flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPromotion(promo.id);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Modifier
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700 flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePromotion(promo.id);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      Aucune promotion trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredPromotions.length}</span> sur <span className="font-medium">{promotions.length}</span> promotions
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Précédent
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bouton d'action flottant */}
      <div className="fixed bottom-8 right-8">
        <button 
          className="bg-white text-primary w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          onClick={openAddPromotionModal}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Modale d'ajout/modification de promotion */}
      {showModal && (
        <Modal 
          title={isEditMode ? "Modifier la promotion" : "Nouvelle promotion"}
          onClose={() => {
            setShowModal(false);
            setSelectedPromotion(null);
            setIsEditMode(false);
          }}
        >
          <PromotionForm 
            onSubmit={handleSubmitPromotion} 
            onCancel={() => {
              setShowModal(false);
              setSelectedPromotion(null);
              setIsEditMode(false);
            }} 
            initialData={selectedPromotion}
          />
        </Modal>
      )}
      
      {/* Dialogue de confirmation de suppression */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette promotion ? Cette action est irréversible."
        onConfirm={confirmDeletePromotion}
        onCancel={() => {
          setShowConfirmDialog(false);
          setPromotionToDelete(null);
        }}
      />
    </div>
  );
}
