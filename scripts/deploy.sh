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

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

if [ $? -ne 0 ]; then
  echo "❌ Deployment failed"
  exit 1
fi

echo "✅ Deployment successful"

# Verify the deployment
echo "Verifying deployment..."
curl -s "$NEXT_PUBLIC_SITE_URL" | grep -q "QuoteLinker"

if [ $? -ne 0 ]; then
  echo "❌ Deployment verification failed"
  exit 1
fi

echo "✅ Deployment verified"
echo "🎉 Application is now live at $NEXT_PUBLIC_SITE_URL" 