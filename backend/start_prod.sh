#!/bin/bash

set -e  # Exit on error

echo "🚀 Starting production containers..."
npm run docker-up:prod

echo "⏳ Waiting for API container to be ready..."

# Wait until API container is running
until docker compose ps api | grep -q "Up"; do
  sleep 2
done

echo "📦 Running database migrations..."

docker compose exec api npm run migration:run

echo "✅ Deployment complete!"