#!/bin/bash
set -e

# Vérification et création du lien symbolique pour le stockage
if [ ! -L /var/www/html/public/storage ]; then
    echo "Le lien symbolique public/storage n'existe pas. Création en cours..."
    php artisan storage:link
else
    echo "Le lien symbolique public/storage existe déjà."
fi

# Ajustement du port Apache pour Render
# Render injecte la variable $PORT. Par défaut, Apache écoute sur 80.
PORT=${PORT:-80}
sed -i "s/80/$PORT/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Optimisation des performances pour la production
echo "Mise en cache de la configuration et des routes..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Exécution des migrations (force = oui, pour la production)
echo "Exécution des migrations..."
php artisan migrate --force || true

# Démarrage d'Apache en premier plan
echo "Démarrage d'Apache..."
exec apache2-foreground
