# Gestion de Caisse (Cash Management System)

Une application moderne pour la gestion de caisse dans plusieurs locaux, permettant de suivre les entrées, sorties et retours d'argent.

## Fonctionnalités

- **Authentification** : Système de connexion sécurisé avec différents rôles (admin, gestionnaire, caissier)
- **Tableau de bord** : Vue d'ensemble des finances avec graphiques et statistiques
- **Gestion des opérations** : Enregistrement des entrées, sorties et retours d'argent
- **Impression de reçus** : Génération et impression de reçus pour chaque opération
- **Gestion des utilisateurs** : Administration des comptes utilisateurs et leurs permissions
- **Gestion des locaux** : Suivi des différents points de vente ou locaux
- **Rapports** : Génération de rapports financiers personnalisables
- **Interface multilingue** : Application entièrement en français

## Technologies utilisées

- React 18 avec TypeScript
- Material-UI pour l'interface utilisateur
- Redux Toolkit pour la gestion d'état
- React Router pour la navigation
- i18next pour l'internationalisation
- React-to-print pour l'impression des reçus

## Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn

## Installation

1. Clonez ce dépôt :
   ```
   git clone https://github.com/votre-utilisateur/caisse-management.git
   cd caisse-management
   ```

2. Installez les dépendances :
   ```
   npm install
   ```
   ou
   ```
   yarn install
   ```

3. Lancez l'application en mode développement :
   ```
   npm start -- --port 3001
   ```
   ou
   ```
   yarn start
   ```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Comptes de démonstration

Pour tester l'application, vous pouvez utiliser les comptes suivants :

- **Administrateur** : admin@example.com / password
- **Gestionnaire** : manager@example.com / password
- **Caissier** : cashier@example.com / password

## Structure du projet

```
src/
├── assets/         # Images, icônes et autres ressources
├── components/     # Composants réutilisables
├── contexts/       # Contextes React
├── hooks/          # Hooks personnalisés
├── pages/          # Pages de l'application
├── services/       # Services et logique métier
│   ├── slices/     # Slices Redux
│   └── api/        # Services d'API
├── types/          # Types TypeScript
└── utils/          # Fonctions utilitaires
```

## Déploiement

Pour construire l'application pour la production :

```
npm run build
```

ou

```
yarn build
```

Les fichiers de build seront générés dans le dossier `build/`.

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails. 