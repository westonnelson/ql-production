#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Check if required environment variables are set
echo "Checking environment variables..."
required_vars=(
  "NEXT_PUBLIC_SITE_URL"
  "NEXT_PUBLIC_GA_MEASUREMENT_ID"
  "NEXT_PUBLIC_GTM_ID"
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "RESEND_API_KEY"
  "SF_USERNAME"
  "SF_PASSWORD"
  "SF_SECURITY_TOKEN"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Error: $var is not set"
    exit 1
  fi
done

echo "✅ Environment variables verified"

# Build the application
echo "Building application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

echo "✅ Build successful"

# Run integration tests
echo "Running integration tests..."
npm run test:integration

if [ $? -ne 0 ]; then
  echo "❌ Integration tests failed"
  exit 1
fi

echo "✅ Integration tests passed"

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

if [ $? -ne 0 ]; then
  echo "❌ Deployment failed"
  exit 1
fi

echo "✅ Deployment successful"

# Verify integrations
echo "Verifying integrations..."
curl -s "$NEXT_PUBLIC_SITE_URL/api/health" | grep -q '"status":"healthy"'

if [ $? -ne 0 ]; then
  echo "❌ Health check failed"
  exit 1
fi

echo "✅ Health check passed"

echo "🎉 Deployment complete! The application is live and ready for paid traffic." 