'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Categories() {
  // Catégories fictives pour la démo
  const categories = [
    {
      id: 1,
      name: 'Fournitures scolaires',
      description: 'Cahiers, stylos, classeurs, calculatrices, imprimés et autres fournitures essentielles pour vos études.',
      image: '/images/fourniture scolaire.jpg',
      slug: 'fournitures',
      itemCount: 24
    },
    {
      id: 2,
      name: 'Manuels et papeterie',
      description: 'Livres, manuels scolaires, documents de référence et papeterie pour tous vos besoins académiques.',
      image: '/images/livre.jpg',
      slug: 'manuels',
      itemCount: 18
    },
    {
      id: 3,
      name: 'Vêtements et accessoires',
      description: 'T-shirts de promo, sweats ou casquettes aux couleurs de l\'école, sacs à dos et autres accessoires.',
      image: '/images/accessoire.jpg',
      slug: 'vetements',
      itemCount: 15
    },
    {
      id: 4,
      name: 'Alimentation et boissons',
      description: 'Snacks, boissons et autres produits alimentaires disponibles sur le campus.',
      image: '/images/nourriture.jpg',
      slug: 'alimentation',
      itemCount: 12
    },
    {
      id: 5,
      name: 'Billets et événements',
      description: 'Billets pour les événements de l\'école, soirées d\'intégration, galas et autres activités.',
      image: '/images/tickets.jpg',
      slug: 'billets',
      itemCount: 8
    },
  ];

  return (
    <div className="py-8">
      <div className="enspy-container">
        <h1 className="text-3xl font-bold mb-8">Catégories</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/shop/categories/${category.slug}`}>
              <div className="card hover:shadow-xl transition h-full">
                <div className="relative bg-gray-200 h-48 w-full">
                  {category.image ? (
                    <Image 
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-500 text-xl">{category.name}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{category.name}</h2>
                  <p className="text-gray-dark mb-4">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-semibold">{category.itemCount} produits</span>
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                      Voir
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bannière promotionnelle */}
        <div className="mt-12 bg-primary text-white rounded-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Produits exclusifs ENSPY</h2>
            <p className="text-lg mb-6">
              Découvrez notre collection de produits exclusifs aux couleurs de l&apos;École Nationale Supérieure Polytechnique de Yaoundé.
            </p>
            <Link href="/shop" className="bg-white text-primary font-bold py-3 px-6 rounded-md hover:bg-gray-100 transition inline-block">
              Voir tous les produits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
