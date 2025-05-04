'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  // Utiliser useParams pour accéder aux paramètres de route
  const params = useParams();
  const slug = params.slug as string;
  const [sortBy, setSortBy] = useState('popularity');

  // Catégories fictives pour la démo
  const categories = {
    fournitures: {
      id: 1,
      name: 'Fournitures scolaires',
      description: 'Cahiers, stylos, classeurs, calculatrices, imprimés et autres fournitures essentielles pour vos études.',
    },
    manuels: {
      id: 2,
      name: 'Manuels et papeterie',
      description: 'Livres, manuels scolaires, documents de référence et papeterie pour tous vos besoins académiques.',
    },
    vetements: {
      id: 3,
      name: 'Vêtements et accessoires',
      description: 'T-shirts de promo, sweats ou casquettes aux couleurs de l\'école, sacs à dos et autres accessoires.',
    },
    alimentation: {
      id: 4,
      name: 'Alimentation et boissons',
      description: 'Snacks, boissons et autres produits alimentaires disponibles sur le campus.',
    },
    billets: {
      id: 5,
      name: 'Billets et événements',
      description: 'Billets pour les événements de l\'école, soirées d\'intégration, galas et autres activités.',
    },
  };

  // Produits fictifs pour la démo
  const allProducts = [
    { id: 1, name: 'Cahier ENSPY', price: 1500, category: 'fournitures', image: '/images/carnet.jpg', popularity: 4.5 },
    { id: 2, name: 'T-shirt ENSPY', price: 5000, category: 'vetements', image: '/images/T-shirt.jpg', popularity: 4.8 },
    { id: 3, name: 'Calculatrice scientifique', price: 15000, category: 'fournitures', image: '/images/calculatrice.jpg', popularity: 4.2 },
    { id: 4, name: 'Stylo à bille (lot de 5)', price: 1000, category: 'fournitures', image: '/images/stylo.jpg', popularity: 4.0 },
    { id: 5, name: 'Manuel d\'algorithmique', price: 8000, category: 'manuels', image: '/images/livre.jpg', popularity: 4.3 },
    { id: 6, name: 'Casquette ENSPY', price: 3500, category: 'vetements', image: '/images/casque.jpg', popularity: 3.9 },
    { id: 7, name: 'Bouteille d\'eau', price: 500, category: 'alimentation', image: '/images/nourriture.jpg', popularity: 4.1 },
    { id: 8, name: 'Billet soirée d\'intégration', price: 2000, category: 'billets', image: '/images/tickets.jpg', popularity: 4.7 },
    { id: 9, name: 'Règle 30cm', price: 800, category: 'fournitures', image: '/images/fourniture.jpg', popularity: 3.8 },
    { id: 10, name: 'Classeur', price: 2500, category: 'fournitures', image: '/images/fourniture scolaire.jpg', popularity: 4.0 },
    { id: 11, name: 'Livre de mathématiques', price: 12000, category: 'manuels', image: '/images/livre.jpg', popularity: 4.5 },
    { id: 12, name: 'Sweat ENSPY', price: 8000, category: 'vetements', image: '/images/accessoire.jpg', popularity: 4.7 },
  ];

  // Récupérer la catégorie actuelle
  const currentCategory = categories[slug as keyof typeof categories];
  
  // Si la catégorie n'existe pas, on pourrait gérer une erreur ou rediriger
  if (!currentCategory) {
    return (
      <div className="py-8">
        <div className="enspy-container">
          <h1 className="text-3xl font-bold mb-8">Catégorie non trouvée</h1>
          <p className="mb-4">La catégorie que vous recherchez n&apos;existe pas.</p>
          <Link href="/shop/categories" className="btn-primary">
            Voir toutes les catégories
          </Link>
        </div>
      </div>
    );
  }

  // Filtrer les produits par catégorie
  const products = allProducts.filter(product => product.category === slug);

  // Trier les produits
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    // Par défaut, trier par popularité
    return b.popularity - a.popularity;
  });

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
            <Link href="/shop/categories" className="hover:text-primary">Catégories</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{currentCategory.name}</span>
          </nav>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{currentCategory.name}</h1>
          <p className="text-gray-dark">{currentCategory.description}</p>
        </div>

        {/* Options de tri */}
        <div className="bg-gray-light p-4 rounded-lg mb-8 flex justify-between items-center">
          <p className="text-gray-dark">
            {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
          </p>
          <div className="flex items-center">
            <label htmlFor="sortBy" className="mr-2 text-gray-dark">Trier par:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray rounded focus:outline-none focus:border-primary"
            >
              <option value="popularity">Popularité</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom</option>
            </select>
          </div>
        </div>

        {/* Liste des produits */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Aucun produit trouvé dans cette catégorie</h2>
            <p className="text-gray-dark mb-6">Nous ajouterons bientôt de nouveaux produits.</p>
            <Link href="/shop" className="btn-primary">
              Voir tous les produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div key={product.id} className="card hover:shadow-xl transition">
                <Link href={`/shop/products/${product.id}`}>
                  <div className="relative bg-gray-200 h-48 w-full">
                    {product.image ? (
                      <Image 
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-gray-500">{product.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-primary font-bold mb-4">{product.price} FCFA</p>
                    <div className="flex items-center mb-4">
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
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button className="btn-primary w-full">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
