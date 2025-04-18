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

# Run migrations
echo "🔄 Running migrations..."
supabase db push --linked

echo "✅ Migrations completed successfully!" 