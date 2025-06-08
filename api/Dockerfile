FROM php:8.4-fpm

# Install system dependencies, PostgreSQL client, and nano
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    curl \
    zip \
    unzip \
    postgresql-client \
    nano \
    libicu-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) pdo pdo_pgsql pcntl intl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . /var/www/html

# Install PHP dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev || { echo "Composer install failed"; exit 1; }

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port
EXPOSE 8000

# Use entrypoint script to handle startup
#ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
#CMD php -S 0.0.0.0:8000 -t public

# Use entrypoint script to handle startup
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
