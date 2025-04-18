#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# 1. Check environment variables
echo "🔍 Checking environment variables..."
required_vars=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "SUPABASE_SERVICE_ROLE_KEY"
  "SALESFORCE_USERNAME"
  "SALESFORCE_PASSWORD"
  "SALESFORCE_SECURITY_TOKEN"
  "RESEND_API_KEY"
  "NEXT_PUBLIC_GA_MEASUREMENT_ID"
  "NEXT_PUBLIC_GTM_ID"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Error: $var is not set"
    exit 1
  fi
done

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Run database migrations
echo "🗃️ Running database migrations..."
npx supabase db push

# 4. Build the project
echo "🏗️ Building the project..."
npm run build

# 5. Run tests
echo "🧪 Running tests..."
npm test

# 6. Check health endpoints
echo "🏥 Checking health endpoints..."
HEALTH_CHECK=$(curl -s http://localhost:3001/api/health)
if [[ $HEALTH_CHECK == *"\"status\":\"healthy\""* ]]; then
  echo "✅ Health check passed"
else
  echo "❌ Health check failed"
  echo $HEALTH_CHECK
  exit 1
fi

# 7. Commit changes
echo "📝 Committing changes..."
git add .
git commit -m "feat: production deployment $(date +%Y-%m-%d)"

# 8. Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push origin main

# 9. Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

# 10. Run post-deployment checks
echo "🔍 Running post-deployment checks..."
sleep 10  # Wait for deployment to complete
PROD_HEALTH_CHECK=$(curl -s https://ql-production-qg2oc103w-yield.vercel.app/api/health)
if [[ $PROD_HEALTH_CHECK == *"\"status\":\"healthy\""* ]]; then
  echo "✅ Production health check passed"
else
  echo "❌ Production health check failed"
  echo $PROD_HEALTH_CHECK
  exit 1
fi

echo "✅ Deployment complete!" 