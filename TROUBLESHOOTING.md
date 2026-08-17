# Guide de Dépannage Rapide : Pages Blanches (Celebra Cameroon)

Ce document a été créé pour vous aider à diagnostiquer rapidement toute future "page blanche" ou crash silencieux, avant même de faire appel à un agent IA.

## Checklist de Diagnostic

Si l'application affiche une page blanche ou ne charge pas correctement, suivez ces étapes dans l'ordre :

### 1. Vérifier les Logs Serveur (Backend)
Ouvrez le fichier `storage/logs/laravel.log`. Faites défiler jusqu'en bas. 
- Y a-t-il une erreur du type `[2026-...] production.ERROR: ...` ? 
- Si oui, l'erreur vient du code PHP (Laravel) ou de la base de données. 

### 2. Examiner le Navigateur (Frontend)
Sur la page blanche, appuyez sur la touche `F12` (ou faites Clic Droit > Inspecter) et allez dans l'onglet **Console**.
- Voyez-vous des erreurs en rouge ?
- Si oui, c'est un crash JavaScript/React. Normalement, l'`ErrorBoundary` devrait intercepter ces erreurs, mais si elle ne le fait pas, la cause est ici (ex: variable non définie, import manquant).

### 3. Vérifier les Requêtes Réseau
Toujours dans `F12`, allez dans l'onglet **Network (Réseau)** et rechargez la page.
- Regardez le code de statut de la requête de la page.
- **Code 500** : Erreur serveur Laravel (voir étape 1).
- **Code 404** : La route n'existe pas.
- **Code 200 mais contenu vide** : C'est probablement un middleware qui bloque de façon silencieuse ou Inertia qui n'arrive pas à rendre le composant.

### 4. Lancer le Script de Diagnostic Global
Ouvrez votre terminal à la racine du projet et tapez :
```bash
php artisan diagnose:routes
```
Ce script va tester automatiquement TOUTES les routes de votre application en tant qu'administrateur et vous afficher un tableau clair. Si une route renvoie une "PAGE BLANCHE (Vide)" ou "ERREUR SERVEUR", vous saurez immédiatement laquelle pose problème.

### 5. Vider les Caches
Un classique : parfois Laravel garde en mémoire une ancienne configuration erronée.
```bash
php artisan optimize:clear
```
Puis relancez votre serveur.

---
*Ce système a été mis en place pour garantir qu'aucune erreur ne reste jamais invisible.*
