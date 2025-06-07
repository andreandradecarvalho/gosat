#!/bin/bash

# Wait for PostgreSQL to be ready
echo "Checking PostgreSQL availability..."
until pg_isready -h postgres -p 5432 -U laravel; do
  ECHO "Waiting for PostgreSQL to be ready..."
  sleep 2
done
echo "PostgreSQL is ready."

# Test PostgreSQL connection with password
echo "Testing PostgreSQL connection..."
export PGPASSWORD=secret
psql -h postgres -p 5432 -U laravel -d laravel -w -c "SELECT 1;" || { echo "PostgreSQL connection test failed"; exit 1; }
echo "PostgreSQL connection test passed."

# Debug: Display .env database settings
echo "Current .env database settings:"
grep '^DB_' .env || echo "No DB_ settings found in .env"

# Clear Laravel configuration cache
echo "Clearing Laravel configuration cache..."
php artisan config:clear || { echo "Config clear failed"; exit 1; }

# Run migrations and generate keys
echo "Running migrations..."
php artisan migrate --force || { echo "Migration failed"; exit 1; }

# Wait a moment to ensure migrations are fully complete
sleep 3

echo "Verifying migrations..."
php artisan migrate:status || { echo "Migration verification failed"; exit 1; }

echo "Running seeders..."
php artisan db:seed --class=DatabaseSeeder --force || { echo "DatabaseSeeder failed"; exit 1; }

echo "Generating application key..."
php artisan key:generate || { echo "Key generation failed"; exit 1; }
echo "Generating JWT secret..."
php artisan jwt:secret --force || { echo "JWT secret generation failed"; exit 1; }

# Start Laravel server
echo "Starting Laravel server..."
exec php artisan serve --host=0.0.0.0 --port=8000
