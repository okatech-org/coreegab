# Guide Complet : Workflow Cursor → GitHub → Lovable → Production

## 🚀 Vue d'ensemble

Ce guide détaille le workflow complet de développement et déploiement pour COREEGAB, utilisant l'écosystème Cursor + GitHub + Lovable + Supabase + Netlify.

### Architecture du Workflow

```
Cursor (Dev Local) → GitHub (Version Control) → Lovable (AI Dev) → Production (Netlify)
                                  ↓
                            Supabase (Database)
```

## 📋 Prérequis

- [x] Repository GitHub : `https://github.com/okatech-org/coreegab.git`
- [x] Projet Supabase : `vpxsyxbxbilqyikmyznf`
- [x] Projet Lovable connecté à GitHub
- [x] Compte Netlify configuré
- [x] Domaines : `coreegab.com`, `coreegab.lovable.app`

## 🔧 Configuration Initiale

### 1. Configuration Cursor avec MCP

Le fichier `.cursor/mcp.json` est déjà configuré pour l'intégration Supabase :

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase",
        "--read-only",
        "--project-ref=vpxsyxbxbilqyikmyznf"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "[YOUR-SUPABASE-ACCESS-TOKEN]"
      }
    }
  }
}
```

**Action requise :** Remplacer `[YOUR-SUPABASE-ACCESS-TOKEN]` par votre token d'accès Supabase.

### 2. Variables d'Environnement

Créez un fichier `.env.local` avec ces variables :

```env
# Configuration Supabase
VITE_SUPABASE_URL=https://vpxsyxbxbilqyikmyznf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweHN5eGJ4YmlscXlpa215em5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTMxMjQsImV4cCI6MjA3MzA2OTEyNH0._FiLlN7wR9-A85SPPCS3jY1B2oFrBnTFbJFSDg_duWw
VITE_SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.vpxsyxbxbilqyikmyznf.supabase.co:5432/postgres

# Configuration de l'application
VITE_APP_NAME=COREEGAB
VITE_APP_VERSION=1.0.5
VITE_APP_URL=http://localhost:5173

# APIs externes
DATA_GO_KR_API_KEY=FREE_PUBLIC_KEY
KRW_TO_FCFA_RATE=0.65

# Déploiement (optionnel pour développement local)
NETLIFY_SITE_ID=[YOUR-NETLIFY-SITE-ID]
NETLIFY_AUTH_TOKEN=[YOUR-NETLIFY-AUTH-TOKEN]
```

### 3. Vérification de la Configuration

```bash
npm run check:env
```

## 🔄 Workflow de Développement

### Stratégie de Branching

```
main (sync Lovable) ← develop ← feature/nom-feature
```

**Règles importantes :**
- Lovable synchronise uniquement avec la branche `main`
- Développez sur des branches de fonctionnalités
- Mergez vers `main` pour synchroniser avec Lovable

### Commandes de Développement

```bash
# Démarrage du développement
npm run setup:dev    # Installation + vérification
npm run dev         # Serveur de développement

# Validation du code
npm run validate    # Lint + Tests + Build
npm run lint:fix    # Correction automatique du linting

# Synchronisation avec GitHub
npm run sync:github # Commit + Push automatique

# Déploiement
npm run deploy:lovable    # Sync vers Lovable
npm run deploy:production # Déploiement Netlify
```

## 🚀 Processus de Déploiement

### 1. Déploiement vers Lovable

```bash
# Méthode automatique
npm run deploy:lovable

# Méthode manuelle
git checkout main
git pull origin main
git merge feature/ma-fonctionnalite
git push origin main
```

**Étapes automatiques :**
1. Vérification de la branche `main`
2. Synchronisation avec GitHub
3. Test du build
4. Push vers GitHub
5. Synchronisation automatique Lovable

### 2. Déploiement en Production

```bash
# Déploiement automatique via GitHub Actions
git tag v1.0.5
git push origin v1.0.5

# Déploiement manuel
npm run deploy:production
```

**Pipeline de production :**
1. Tests automatiques
2. Audit de sécurité
3. Build de production
4. Déploiement Netlify
5. Notification de statut

## 🔗 Configuration des Domaines

### Domaine Principal (coreegab.com)

**Configuration DNS :**
```dns
@    A    185.158.133.1
www  A    185.158.133.1
```

**Vérification :**
```bash
dig coreegab.com A
nslookup coreegab.com 8.8.8.8
```

### Domaine Lovable (coreegab.lovable.app)

Configuration automatique via l'interface Lovable.

## 🛠️ Scripts Disponibles

### Scripts de Développement

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run validate` | Validation complète |
| `npm run check:env` | Vérification des variables d'environnement |

### Scripts de Déploiement

| Script | Description |
|--------|-------------|
| `npm run deploy:lovable` | Synchronisation vers Lovable |
| `npm run deploy:production` | Déploiement en production |
| `npm run sync:github` | Sync rapide vers GitHub |

### Scripts de Maintenance

| Script | Description |
|--------|-------------|
| `npm run import:vehicles` | Import des données véhicules |
| `npm run lint:fix` | Correction automatique du code |

## 🔍 Dépannage

### Problèmes de Synchronisation Lovable

**Symptômes :** Les changements n'apparaissent pas dans Lovable

**Solutions :**
1. Vérifier la branche active : `git branch`
2. S'assurer d'être sur `main` : `git checkout main`
3. Synchroniser : `git pull origin main`
4. Push : `git push origin main`

### Problèmes de Déploiement

**Symptômes :** Échec du déploiement Netlify

**Solutions :**
1. Vérifier les secrets GitHub :
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
2. Tester le build local : `npm run build`
3. Vérifier les logs GitHub Actions

### Problèmes de Domaines

**Symptômes :** coreegab.com inaccessible

**Solutions :**
1. Vérifier la propagation DNS : `dig coreegab.com A`
2. Attendre jusqu'à 48h pour la propagation
3. Vérifier la configuration Netlify

## 📊 Monitoring et Maintenance

### Surveillance Post-Déploiement

1. **Métriques de Performance**
   - Temps de chargement
   - Taux d'erreur
   - Utilisation des ressources

2. **Logs d'Erreur**
   - GitHub Actions logs
   - Netlify function logs
   - Supabase logs

3. **Sauvegardes**
   - Configuration GitHub
   - Variables d'environnement
   - Base de données Supabase

### Maintenance Régulière

- **Hebdomadaire :** Mise à jour des dépendances
- **Mensuelle :** Audit de sécurité
- **Trimestrielle :** Review de l'architecture

## 🚨 Alertes et Notifications

### GitHub Actions
- Notifications automatiques en cas d'échec
- Commentaires sur les PR avec statut de déploiement

### Netlify
- Webhooks de déploiement
- Alertes de performance

## 📚 Ressources

### Documentation
- [GitHub Actions](https://docs.github.com/en/actions)
- [Netlify Docs](https://docs.netlify.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Lovable Docs](https://docs.lovable.app/)

### Support
- Issues GitHub pour les bugs
- Discussions GitHub pour les questions
- Documentation interne dans `/docs`

---

**Dernière mise à jour :** $(date)
**Version du workflow :** 1.0.5
