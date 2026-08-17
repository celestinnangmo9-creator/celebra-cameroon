# Checklist de Déploiement (Celebra Cameroon)

> [!WARNING]
> Avant toute mise en production, vous DEVEZ respecter scrupuleusement cette checklist pour éviter toute faille de sécurité majeure (notamment la fuite de données via le mode Debug).

## 1. Sécurité et Environnement (CRITIQUE)
- [ ] Le fichier `.env` de production a bien la variable `APP_ENV=production`.
- [ ] Le fichier `.env` de production a bien la variable `APP_DEBUG=false`.
- [ ] Les clés API réelles (Google OAuth, Passerelles de paiement) sont renseignées.
- [ ] Les identifiants de la base de données de production sont sécurisés et configurés.

## 2. Optimisation
- [ ] Le cache de configuration est généré : `php artisan config:cache`
- [ ] Le cache des routes est généré : `php artisan route:cache`
- [ ] Le cache des vues est généré : `php artisan view:cache`
- [ ] Le build frontend est prêt : `npm run build`

## 3. Base de données
- [ ] Les migrations ont été lancées : `php artisan migrate --force`

## 4. Permissions serveur
- [ ] Le dossier `storage` et ses sous-dossiers ont les droits d'écriture pour le serveur web.
- [ ] Le dossier `bootstrap/cache` a les droits d'écriture.

> [!CAUTION]
> Ne laissez JAMAIS `APP_DEBUG=true` sur un serveur accessible au public. Cela exposerait vos mots de passe de base de données et vos clés API à n'importe quel visiteur déclenchant une erreur.
