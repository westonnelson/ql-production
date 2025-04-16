#!/bin/bash

# Test script for form submissions
# This script tests the form submissions for different insurance types

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Base URL for the API
BASE_URL="https://ql-production-k6gbhwrrj-yield.vercel.app"

# Function to test a form submission
test_form() {
  local form_type=$1
  local data=$2
  local expected_status=$3

  echo -e "\nTesting ${form_type} form submission..."
  
  response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$data" \
    "${BASE_URL}/api/submit-quote")

  status_code=$(echo "$response" | tail -n1)
  response_body=$(echo "$response" | sed '$d')

  if [ "$status_code" -eq "$expected_status" ]; then
    echo -e "${GREEN}✓ Success${NC}"
    echo "Response: $response_body"
  else
    echo -e "${RED}✗ Failed${NC}"
    echo "Expected status: $expected_status"
    echo "Got status: $status_code"
    echo "Response: $response_body"
  fi
}

# Test data for Life Insurance
life_data='{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "5551234567",
  "age": 30,
  "gender": "male",
  "insuranceType": "life",
  "coverageAmount": 500000,
  "termLength": 20,
  "tobaccoUse": false
}'

# Test data for Disability Insurance
disability_data='{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "5559876543",
  "age": 35,
  "gender": "female",
  "insuranceType": "disability",
  "occupation": "Software Engineer",
  "employmentStatus": "full-time",
  "incomeRange": "100000-150000"
}'

# Test data for Supplemental Health Insurance
supplemental_data='{
  "firstName": "Robert",
  "lastName": "Johnson",
  "email": "robert.johnson@example.com",
  "phone": "5555555555",
  "age": 45,
  "gender": "male",
  "insuranceType": "supplemental",
  "healthStatus": "good",
  "preExistingConditions": false
}'

# Test data for Auto Insurance
auto_data='{
  "firstName": "Sarah",
  "lastName": "Williams",
  "email": "sarah.williams@example.com",
  "phone": "5552223333",
  "age": 25,
  "gender": "female",
  "insuranceType": "auto",
  "vehicleYear": 2020,
  "vehicleMake": "Toyota",
  "vehicleModel": "Camry"
}'

# Run the tests
echo "Starting form submission tests..."

test_form "Life Insurance" "$life_data" 200
test_form "Disability Insurance" "$disability_data" 200
test_form "Supplemental Health Insurance" "$supplemental_data" 200
test_form "Auto Insurance" "$auto_data" 200

echo -e "\nAll form tests completed." 