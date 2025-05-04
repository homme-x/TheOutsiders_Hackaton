# Backend E-commerce ENSPY avec NestJS et SQLite

Ce backend a été développé avec NestJS et SQLite pour l'application e-commerce ENSPY. Il fournit toutes les fonctionnalités nécessaires pour gérer les utilisateurs, les produits, les catégories, les commandes, les messages et le panier d'achat.

## Prérequis

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)

## Installation

1. Clonez le dépôt
2. Installez les dépendances :

```bash
npm install
```

## Configuration

Le backend utilise SQLite comme base de données, ce qui ne nécessite pas de configuration supplémentaire. La base de données sera créée automatiquement au démarrage de l'application.

## Démarrage

Pour démarrer le serveur en mode développement :

```bash
npm run start:dev
```

Le serveur sera accessible à l'adresse : http://localhost:3001/api

## Initialisation de la base de données

Pour initialiser la base de données avec des données de test :

```bash
npm run seed
```

Cette commande va créer :
- Un utilisateur administrateur (admin@enspy.com / password123)
- Un utilisateur vendeur (vendeur@enspy.com / password123)
- Un utilisateur client (client@enspy.com / password123)
- Des catégories de produits
- Des produits de test

## Structure du projet

```
src/
├── app.module.ts        # Module principal de l'application
├── main.ts              # Point d'entrée de l'application
├── common/              # Fonctionnalités communes (gardes, décorateurs, etc.)
├── config/              # Configuration et scripts d'initialisation
└── modules/             # Modules de l'application
    ├── auth/            # Module d'authentification
    ├── cart/            # Module de gestion du panier
    ├── categories/      # Module de gestion des catégories
    ├── messages/        # Module de messagerie
    ├── orders/          # Module de gestion des commandes
    ├── products/        # Module de gestion des produits
    └── users/           # Module de gestion des utilisateurs
```

## API Endpoints

### Authentification

- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `GET /api/auth/profile` - Récupérer le profil de l'utilisateur connecté

### Utilisateurs

- `GET /api/users` - Récupérer tous les utilisateurs (admin seulement)
- `GET /api/users/:id` - Récupérer un utilisateur par son ID
- `PATCH /api/users/:id` - Mettre à jour un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur (admin seulement)
- `PATCH /api/users/:id/availability` - Mettre à jour la disponibilité d'un vendeur
- `GET /api/users/vendors` - Récupérer tous les vendeurs

### Produits

- `GET /api/products` - Récupérer tous les produits
- `GET /api/products/:id` - Récupérer un produit par son ID
- `GET /api/products/search` - Rechercher des produits
- `GET /api/products/featured` - Récupérer les produits mis en avant
- `GET /api/products/category/:categoryId` - Récupérer les produits par catégorie
- `GET /api/products/vendor/:vendorId` - Récupérer les produits par vendeur
- `POST /api/products` - Créer un nouveau produit (vendeur seulement)
- `PATCH /api/products/:id` - Mettre à jour un produit (vendeur seulement)
- `DELETE /api/products/:id` - Supprimer un produit (vendeur seulement)

### Catégories

- `GET /api/categories` - Récupérer toutes les catégories
- `GET /api/categories/:id` - Récupérer une catégorie par son ID
- `GET /api/categories/slug/:slug` - Récupérer une catégorie par son slug
- `POST /api/categories` - Créer une nouvelle catégorie (admin seulement)
- `PATCH /api/categories/:id` - Mettre à jour une catégorie (admin seulement)
- `DELETE /api/categories/:id` - Supprimer une catégorie (admin seulement)

### Panier

- `GET /api/cart` - Récupérer le panier de l'utilisateur connecté
- `POST /api/cart` - Ajouter un produit au panier
- `PATCH /api/cart/:id` - Mettre à jour la quantité d'un produit dans le panier
- `DELETE /api/cart/:id` - Supprimer un produit du panier
- `DELETE /api/cart` - Vider le panier
- `GET /api/cart/total` - Récupérer le total du panier

### Commandes

- `GET /api/orders` - Récupérer toutes les commandes (admin/vendeur seulement)
- `GET /api/orders/my-orders` - Récupérer les commandes de l'utilisateur connecté
- `GET /api/orders/:id` - Récupérer une commande par son ID
- `GET /api/orders/number/:orderNumber` - Récupérer une commande par son numéro
- `POST /api/orders` - Créer une nouvelle commande
- `PATCH /api/orders/:id` - Mettre à jour une commande
- `PATCH /api/orders/:id/status` - Mettre à jour le statut d'une commande (admin/vendeur seulement)
- `PATCH /api/orders/:id/pay` - Marquer une commande comme payée

### Messages

- `GET /api/messages/conversations` - Récupérer les conversations de l'utilisateur connecté
- `GET /api/messages/conversation/:conversationId` - Récupérer les messages d'une conversation
- `POST /api/messages` - Envoyer un message
- `PATCH /api/messages/conversation/:conversationId/read` - Marquer une conversation comme lue
- `PATCH /api/messages/:id/read` - Marquer un message comme lu

## Intégration avec le Frontend

Le backend est conçu pour fonctionner avec le frontend React existant. Un service API a été créé dans le frontend pour faciliter la communication avec le backend. Ce service se trouve dans le fichier `src/lib/api/api.ts` du projet frontend.

## Licence

ISC
