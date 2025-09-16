# Checklist de Déploiement COREEGAB

## ✅ Configuration Initiale

### Environnement de Développement
- [ ] Git configuré avec nom et email
- [ ] Repository cloné : `https://github.com/okatech-org/coreegab.git`
- [ ] Branche `main` configurée comme upstream
- [ ] Dépendances installées : `npm install`

### Variables d'Environnement
- [ ] Fichier `.env.local` créé
- [ ] `VITE_SUPABASE_URL` configuré
- [ ] `VITE_SUPABASE_ANON_KEY` configuré
- [ ] `VITE_APP_URL` configuré
- [ ] Variables optionnelles configurées si nécessaire

### Configuration Supabase
- [ ] Token d'accès Supabase obtenu
- [ ] Configuration MCP Cursor mise à jour
- [ ] Connexion testée avec `npm run check:env`

## 🚀 Déploiement Lovable

### Synchronisation GitHub → Lovable
- [ ] Changements commitées sur la branche `main`
- [ ] Build testé localement : `npm run build`
- [ ] Push vers GitHub : `git push origin main`
- [ ] Synchronisation Lovable vérifiée (2-5 minutes)

### Configuration Lovable
- [ ] Projet Lovable connecté à GitHub
- [ ] Intégration Supabase configurée dans Lovable
- [ ] Variables d'environnement configurées dans Lovable
- [ ] Domaine `coreegab.lovable.app` accessible

## 🌐 Déploiement Production

### Configuration Netlify
- [ ] Site Netlify créé et connecté à GitHub
- [ ] Secrets GitHub configurés :
  - [ ] `NETLIFY_AUTH_TOKEN`
  - [ ] `NETLIFY_SITE_ID`
- [ ] GitHub Actions workflow configuré
- [ ] Build automatique testé

### Configuration DNS
- [ ] Enregistrements DNS configurés :
  - [ ] `@ A 185.158.133.1`
  - [ ] `www A 185.158.133.1`
- [ ] Propagation DNS vérifiée : `dig coreegab.com A`
- [ ] Certificat SSL actif

### Tests de Production
- [ ] Site accessible sur `https://coreegab.com`
- [ ] Fonctionnalités principales testées
- [ ] Performance vérifiée
- [ ] Logs d'erreur surveillés

## 🔄 Workflow de Développement

### Branches et Synchronisation
- [ ] Branche `develop` créée pour l'intégration
- [ ] Branches de fonctionnalités créées depuis `develop`
- [ ] Merge vers `main` pour synchronisation Lovable
- [ ] Workflow de code review en place

### Tests et Validation
- [ ] Tests unitaires passent : `npm run test`
- [ ] Linting configuré : `npm run lint`
- [ ] Build de production fonctionne : `npm run build`
- [ ] Validation complète : `npm run validate`

## 🛠️ Maintenance

### Surveillance Continue
- [ ] Monitoring des métriques de performance
- [ ] Surveillance des logs d'erreur
- [ ] Vérification des sauvegardes
- [ ] Mise à jour des dépendances

### Documentation
- [ ] `WORKFLOW_GUIDE.md` à jour
- [ ] `README.md` mis à jour
- [ ] Scripts de déploiement documentés
- [ ] Procédures d'urgence documentées

## 🚨 Dépannage

### Problèmes Courants
- [ ] Synchronisation Lovable lente → Vérifier la branche `main`
- [ ] Échec de déploiement → Vérifier les secrets GitHub
- [ ] Domaine inaccessible → Vérifier la propagation DNS
- [ ] Erreurs Supabase → Vérifier les variables d'environnement

### Contacts et Support
- [ ] Équipe de développement notifiée
- [ ] Accès aux outils de monitoring
- [ ] Procédures d'escalade définies
- [ ] Documentation de support accessible

---

**Dernière vérification :** $(date)
**Responsable :** [Nom du responsable]
**Version :** 1.0.5
