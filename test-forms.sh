#!/bin/bash

API_URL="https://www.quotelinker.com"

# Test data for life insurance lead
echo "Testing life insurance lead submission..."
curl -X POST -H "Content-Type: application/json" -d '{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "phone": "1234567890",
  "age": 35,
  "gender": "male",
  "productType": "life",
  "coverageAmount": 500000,
  "termLength": 20,
  "tobaccoUse": false,
  "utmSource": "test_script",
  "utmMedium": "direct",
  "funnelName": "test_funnel",
  "funnelStep": "test"
}' $API_URL/api/leads

sleep 2

echo "\n\nTesting disability insurance lead submission..."
curl -X POST -H "Content-Type: application/json" -d '{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "9876543210",
  "age": 45,
  "gender": "female",
  "productType": "disability",
  "occupation": "Software Engineer",
  "employmentStatus": "Full-time",
  "incomeRange": "100000-150000",
  "coverageAmount": 5000,
  "termLength": 12,
  "tobaccoUse": false,
  "utmSource": "test_script",
  "utmMedium": "direct",
  "funnelName": "test_funnel",
  "funnelStep": "test"
}' $API_URL/api/leads

sleep 2

echo "\n\nTesting supplemental insurance lead submission..."
curl -X POST -H "Content-Type: application/json" -d '{
  "firstName": "Bob",
  "lastName": "Smith",
  "email": "bob@example.com",
  "phone": "5555555555",
  "age": 55,
  "gender": "male",
  "productType": "supplemental",
  "preExistingConditions": "None",
  "desiredCoverageType": "Accident",
  "coverageAmount": 10000,
  "termLength": 12,
  "tobaccoUse": false,
  "utmSource": "test_script",
  "utmMedium": "direct",
  "funnelName": "test_funnel",
  "funnelStep": "test"
}' $API_URL/api/leads 