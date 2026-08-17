# Utilisez l'image officielle PHP 8.3 avec Apache
FROM php:8.3-apache

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libwebp-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm

# Nettoyage du cache apt
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Configuration et Installation des extensions PHP requises pour Laravel
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Définition du répertoire de travail
WORKDIR /var/www/html

# Copie des fichiers de l'application
COPY . .

# Installation des dépendances PHP
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Installation des dépendances Node et build du frontend (React/Vite)
RUN npm install
RUN npm run build

# Configuration d'Apache : pointer sur le dossier 'public' de Laravel
RUN sed -i -e 's/html/html\/public/g' /etc/apache2/sites-available/000-default.conf

# Activation du module rewrite d'Apache (nécessaire pour le routage Laravel)
RUN a2enmod rewrite

# Gestion des permissions pour que Laravel puisse écrire dans les dossiers de cache et de stockage
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Exposition du port 80 pour Render
EXPOSE 80

# Commande de démarrage par défaut pour Apache
CMD ["apache2-foreground"]
