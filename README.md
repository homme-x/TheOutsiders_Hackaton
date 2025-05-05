# ENSPY E-Commerce Platform

## Description du projet

Ce projet est une plateforme e-commerce complète développée pour ENSPY. L'application est composée de deux parties principales :

1. **Frontend** : Une application web Next.js avec une interface utilisateur moderne et réactive
2. **Backend** : Une API RESTful développée avec NestJS et SQLite

L'application permet la gestion complète d'une boutique en ligne avec différents rôles d'utilisateurs (administrateur, vendeur, client), la gestion des produits, des commandes, des catégories, et des messages entre utilisateurs.

## Prérequis

- Node.js (v18 ou supérieur)
- npm (v9 ou supérieur)

## Installation

### Cloner le dépôt

```bash
git clone https://github.com/homme-x/TheOutsiders_Hackaton.git

```

### Installation du Backend

```bash
cd e-commerce-backend
npm install
```

### Installation du Frontend

```bash
cd e-commerce
npm install
```

## Configuration

### Backend

Le backend utilise SQLite comme base de données, ce qui ne nécessite pas de configuration supplémentaire. La base de données sera automatiquement créée lors du premier démarrage.

### Frontend

Le frontend utilise un fichier `.env` pour la configuration. Un fichier `.env` par défaut est déjà présent dans le dossier `e-commerce`.

## Lancement du projet

Vous pouvez lancer le projet en utilisant le script batch fourni ou en démarrant manuellement les deux parties de l'application.

### Utilisation du script batch (recommandé)

```bash
# À la racine du projet
start-app.bat
```

Ce script lancera automatiquement le backend et le frontend dans deux fenêtres de terminal distinctes.

### Lancement manuel

#### Backend

```bash
cd e-commerce-backend
npm run start:dev
```

Le backend sera accessible à l'adresse : http://localhost:3001

#### Frontend

```bash
cd e-commerce
npm run dev
```

Le frontend sera accessible à l'adresse : http://localhost:3000

## Accès aux différentes parties de l'application

### Interface client (accessible à tous)

- **URL** : http://localhost:3000
- **Description** : Interface principale de l'application où les clients peuvent parcourir les produits, les ajouter au panier et passer des commandes.

### Espace administrateur

- **URL** : http://localhost:3000/admin
- **Connexion** : Utilisez un compte avec des droits d'administrateur
- **Fonctionnalités** :
  - Tableau de bord : `/admin/dashboard`
  - Gestion des utilisateurs : `/admin/users`
  - Gestion des catégories : `/admin/categories`
  - Gestion des commandes : `/admin/orders`
  - Paramètres : `/admin/settings`

### Espace vendeur d'un utilisateur (dans son menu)

- **URL** : http://localhost:3000/vendor
- **Fonctionnalités** :
  - Tableau de bord : `/vendor/dashboard`
  - Gestion des produits : `/vendor/products`
  - Inventaire : `/vendor/inventory`
  - Commandes : `/vendor/orders`
  - Messages : `/vendor/messages`
  - Disponibilité : `/vendor/availability`
  - Promotions : `/vendor/promotions`
  - Rapports : `/vendor/reports`
  - Paramètres : `/vendor/settings`

### Espace utilisateur

- **URL** : http://localhost:3000/account
- **Connexion** : Tout utilisateur connecté
- **Fonctionnalités** :
  - Profil : `/profile`
  - Commandes : `/account/orders`
  - Adresses : `/account/addresses`
  - Messages : `/messages`

## Comptes par défaut pour l'admin

- **Email** : admin
- **Mot de passe** : admin



## Structure du projet

### Backend (e-commerce-backend)

```
e-commerce-backend/
├── src/
│   ├── common/           # Utilitaires et fonctions communes
│   ├── config/           # Configuration de l'application
│   ├── modules/          # Modules de l'application
│   │   ├── auth/         # Authentification
│   │   ├── cart/         # Panier d'achat
│   │   ├── categories/   # Catégories de produits
│   │   ├── messages/     # Messagerie
│   │   ├── orders/       # Commandes
│   │   ├── products/     # Produits
│   │   └── users/        # Utilisateurs
│   ├── app.module.ts     # Module principal
│   └── main.ts           # Point d'entrée
├── database.sqlite       # Base de données SQLite
└── package.json          # Dépendances
```

### Frontend (e-commerce)

```
e-commerce/
├── public/               # Fichiers statiques
├── src/
│   ├── app/              # Pages de l'application
│   │   ├── admin/        # Interface d'administration
│   │   ├── auth/         # Pages d'authentification
│   │   ├── shop/         # Pages de la boutique
│   │   ├── vendor/       # Interface vendeur
│   │   └── ...
│   ├── components/       # Composants réutilisables
│   ├── lib/              # Bibliothèques et utilitaires
│   │   └── api/          # Client API
│   └── styles/           # Styles CSS
└── package.json          # Dépendances
```

## Fonctionnalités principales

1. **Authentification** : Inscription, connexion, gestion des rôles
2. **Catalogue de produits** : Ajout, modification, suppression de produits
3. **Panier d'achat** : Ajout, modification, suppression d'articles
4. **Commandes** : Création et suivi des commandes
5. **Messagerie** : Communication entre vendeurs et clients
6. **Administration** : Gestion des utilisateurs, des catégories et des commandes
7. **Espace vendeur** : Gestion des produits, des commandes et des promotions

## Développement

### Backend

Pour ajouter de nouvelles fonctionnalités au backend :

```bash
cd e-commerce-backend
# Générer un nouveau module
npx nest generate module nom-du-module
# Générer un nouveau contrôleur
npx nest generate controller nom-du-module
# Générer un nouveau service
npx nest generate service nom-du-module
```

### Frontend

Pour ajouter de nouvelles pages au frontend :

```bash
cd e-commerce
# Créer un nouveau dossier dans src/app
mkdir src/app/nouvelle-page
# Créer un fichier page.tsx dans ce dossier
touch src/app/nouvelle-page/page.tsx
```

## Déploiement

Pour déployer l'application en production :

### Backend

```bash
cd e-commerce-backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd e-commerce
npm run build
npm run start
```

## Support

Pour toute question ou problème, veuillez contacter l'équipe de développement.
