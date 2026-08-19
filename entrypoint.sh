#!/bin/bash
set -e

# Vérification et création du lien symbolique pour le stockage
if [ ! -L /var/www/html/public/storage ]; then
    echo "Le lien symbolique public/storage n'existe pas. Création en cours..."
    php artisan storage:link
else
    echo "Le lien symbolique public/storage existe déjà."
fi

# Optimisation des performances pour la production
echo "Mise en cache de la configuration et des routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Exécution des migrations (force = oui, pour la production)
echo "Exécution des migrations..."
php artisan migrate --force

# Démarrage d'Apache en premier plan
echo "Démarrage d'Apache..."
exec apache2-foreground
