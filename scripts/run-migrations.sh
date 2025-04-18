#!/bin/bash

# Exit on error
set -e

echo "🚀 Running database migrations..."

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

# Get project reference
PROJECT_REF=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '/' -f 4 | cut -d '.' -f 1)

if [ -z "$PROJECT_REF" ]; then
  echo "❌ Could not determine Supabase project reference. Please check your .env.local file."
  exit 1
fi

echo "📦 Project reference: $PROJECT_REF"

# Run migrations
echo "🔄 Running migrations..."
supabase db push --project-ref $PROJECT_REF

echo "✅ Migrations completed successfully!" 