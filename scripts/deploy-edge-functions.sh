#!/bin/bash

# Exit on error
set -e

echo "🚀 Deploying Supabase Edge Functions..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "❌ Supabase CLI is not installed. Please install it first."
  echo "Visit: https://supabase.com/docs/guides/cli/getting-started"
  exit 1
fi

# Check if logged in to Supabase
if ! supabase projects list &> /dev/null; then
  echo "❌ Not logged in to Supabase. Please run 'supabase login' first."
  exit 1
fi

# Deploy health check function
echo "📦 Deploying salesforce-health-check function..."
supabase functions deploy salesforce-health-check --no-verify-jwt --use-docker=false

# Deploy create opportunity function
echo "📦 Deploying create-salesforce-opportunity function..."
supabase functions deploy create-salesforce-opportunity --no-verify-jwt --use-docker=false

echo "✅ Edge functions deployed successfully!" 