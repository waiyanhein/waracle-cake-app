#!/bin/bash

set -e

cd backend && npm install && cp .env.production .env
cd ../frontend && npm install && cp .env.production .env

echo "Setup complete"

cd ../

COMPOSE_FILE="docker-compose.prod.yaml"

echo "📁 Ensuring storage exists..."
mkdir -p backend/prod_storage

echo "🚀 Starting containers..."
docker compose -f $COMPOSE_FILE up -d --build

echo "⏳ Waiting for DB container..."

until docker compose -f $COMPOSE_FILE ps db | grep -q "Up"; do
  sleep 2
done

cd backend

echo "📦 Running migrations..."
npm run migration:run

echo "🚀 Starting API..."
npm run build

echo -e "\033[32mFrontend is running on http://localhost:3001 and API is running on http://localhost:3000\033[0m"
npm run start:prod