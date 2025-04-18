#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Build the project
echo "🏗️ Building the project..."
npm run build

# 3. Run tests
echo "🧪 Running tests..."
npm test

# 4. Commit changes
echo "📝 Committing changes..."
git add .
git commit -m "feat: implement Salesforce integration and GTM tracking"

# 5. Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push origin main

# 6. Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!" 