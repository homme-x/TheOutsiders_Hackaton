import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { CategoriesService } from '../modules/categories/categories.service';
import { ProductsService } from '../modules/products/products.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const categoriesService = app.get(CategoriesService);
  const productsService = app.get(ProductsService);

  // Créer un utilisateur administrateur
  const admin = await usersService.create({
    firstName: 'Admin',
    lastName: 'ENSPY',
    email: 'admin@enspy.com',
    password: 'password123',
    isAdmin: true,
  });

  console.log('Administrateur créé:', admin.email);

  // Créer un utilisateur client qui peut aussi être vendeur
  const user1 = await usersService.create({
    firstName: 'Thomas',
    lastName: 'Dupont',
    email: 'thomas@example.com',
    password: 'password123',
  });

  // Mettre à jour la disponibilité du vendeur
  await usersService.updateAvailability(user1.id, true);

  console.log('Utilisateur créé:', user1.email);

  // Créer un autre utilisateur client
  const user2 = await usersService.create({
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie@example.com',
    password: 'password123',
  });

  console.log('Utilisateur créé:', user2.email);

  // Créer les catégories
  const categories = [
    {
      name: 'Fournitures scolaires',
      description: 'Tout ce dont vous avez besoin pour réussir vos études',
      image: '/images/acceuil1.jpg',
      slug: 'fournitures',
    },
    {
      name: 'Manuels et papeterie',
      description: 'Les livres et documents essentiels pour vos cours',
      image: '/images/fourniture scolaire.jpg',
      slug: 'manuels',
    },
    {
      name: 'Vêtements et accessoires',
      description: 'Représentez votre école avec style',
      image: '/images/accessoire.jpg',
      slug: 'vetements',
    },
    {
      name: 'Alimentation et boissons',
      description: 'Restez énergisé pendant vos longues sessions d\'étude',
      image: '/images/nourriture.jpg',
      slug: 'alimentation',
    },
    {
      name: 'Billets et événements',
      description: 'Ne manquez aucun événement important du campus',
      image: '/images/tickets.jpg',
      slug: 'billets',
    },
  ];

  for (const category of categories) {
    const createdCategory = await categoriesService.create(category);
    console.log('Catégorie créée:', createdCategory.name);
  }

  // Récupérer les catégories créées
  const createdCategories = await categoriesService.findAll();

  // Créer des produits pour chaque catégorie
  const products = [
    {
      name: 'Calculatrice scientifique',
      description: 'Calculatrice scientifique avancée, parfaite pour les cours de mathématiques et de physique.',
      price: 15000,
      stock: 50,
      mainImage: '/images/calculatrice.jpg',
      images: ['/images/calculatrice.jpg'],
      featured: true,
      categoryId: createdCategories.find(c => c.slug === 'fournitures').id,
      vendorId: user1.id,
    },
    {
      name: 'Livre de mathématiques avancées',
      description: 'Manuel complet couvrant tous les aspects des mathématiques avancées pour les étudiants en ingénierie.',
      price: 25000,
      stock: 30,
      mainImage: '/images/livre.jpg',
      images: ['/images/livre.jpg'],
      featured: true,
      categoryId: createdCategories.find(c => c.slug === 'manuels').id,
      vendorId: user1.id,
    },
    {
      name: 'T-shirt ENSPY',
      description: 'T-shirt officiel de l\'ENSPY, 100% coton, disponible en plusieurs tailles.',
      price: 8000,
      stock: 100,
      mainImage: '/images/T-shirt.jpg',
      images: ['/images/T-shirt.jpg'],
      featured: true,
      categoryId: createdCategories.find(c => c.slug === 'vetements').id,
      vendorId: user1.id,
    },
    {
      name: 'Billet pour la soirée d\'intégration',
      description: 'Billet pour la soirée d\'intégration annuelle de l\'ENSPY. Places limitées !',
      price: 5000,
      stock: 200,
      mainImage: '/images/tickets.jpg',
      images: ['/images/tickets.jpg'],
      featured: true,
      categoryId: createdCategories.find(c => c.slug === 'billets').id,
      vendorId: user1.id,
    },
    {
      name: 'Stylo ENSPY',
      description: 'Stylo à bille avec le logo de l\'ENSPY, encre bleue, écriture fluide.',
      price: 1500,
      stock: 150,
      mainImage: '/images/stylo.jpg',
      images: ['/images/stylo.jpg'],
      featured: false,
      categoryId: createdCategories.find(c => c.slug === 'fournitures').id,
      vendorId: user1.id,
    },
    {
      name: 'Carnet de notes',
      description: 'Carnet de notes A5 avec couverture rigide, 200 pages, papier de qualité.',
      price: 3000,
      stock: 80,
      mainImage: '/images/carnet.jpg',
      images: ['/images/carnet.jpg'],
      featured: false,
      categoryId: createdCategories.find(c => c.slug === 'manuels').id,
      vendorId: user1.id,
    },
    {
      name: 'Casquette ENSPY',
      description: 'Casquette réglable avec le logo brodé de l\'ENSPY.',
      price: 6000,
      stock: 60,
      mainImage: '/images/casque.jpg',
      images: ['/images/casque.jpg'],
      featured: false,
      categoryId: createdCategories.find(c => c.slug === 'vetements').id,
      vendorId: user1.id,
    },
    {
      name: 'Clé USB 32GB',
      description: 'Clé USB 32GB avec le logo de l\'ENSPY, idéale pour stocker vos cours et projets.',
      price: 7500,
      stock: 40,
      mainImage: '/images/cle.jpg',
      images: ['/images/cle.jpg'],
      featured: false,
      categoryId: createdCategories.find(c => c.slug === 'fournitures').id,
      vendorId: user1.id,
    },
  ];

  for (const product of products) {
    const createdProduct = await productsService.create(product);
    console.log('Produit créé:', createdProduct.name);
  }

  console.log('Initialisation de la base de données terminée !');
  await app.close();
}

bootstrap();
