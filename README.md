# CoreGab - Plateforme E-commerce

## 🚀 Déploiement

### Lovable
Le projet est configuré pour être déployé sur Lovable avec le domaine personnalisé `coreegab.com`.

### Configuration
- **Framework**: Vite + React + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Base de données**: Supabase
- **Paiements**: Stripe
- **Déploiement**: Lovable, Netlify, Vercel

### Commandes de développement
```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview
```

### Structure du projet
```
src/
├── components/     # Composants React
├── pages/         # Pages de l'application
├── hooks/         # Hooks personnalisés
├── contexts/      # Contextes React
├── services/      # Services API
├── types/         # Types TypeScript
└── integrations/  # Intégrations externes
```

### Déploiement automatique
Le projet est configuré pour un déploiement automatique via :
- **Lovable** : Configuration dans `.lovable/config.json`
- **Netlify** : Configuration dans `netlify.toml`
- **Vercel** : Configuration dans `vercel.json`

### Domaine personnalisé
Le site sera accessible sur : https://coreegab.com/

## 🔧 Configuration GitHub
Le projet est connecté au repository GitHub : https://github.com/okatech-org/coregab.git

Pour pousser les modifications :
```bash
git add .
git commit -m "Description des modifications"
git push origin main
```

## 📱 Fonctionnalités
- Interface responsive
- PWA (Progressive Web App)
- Système d'authentification
- Panier d'achat
- Paiements sécurisés
- Dashboard administrateur
- Chatbot commercial
- Recherche IA