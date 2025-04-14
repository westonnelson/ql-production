#!/bin/bash

# Test Life Insurance Form
echo "Testing Life Insurance Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "test@example.com",
    "phone": "555-555-5555",
    "age": "35",
    "gender": "male",
    "coverageAmount": "500000",
    "termLength": "20",
    "tobaccoUse": "false",
    "productType": "life",
    "utmSource": "google",
    "utmMedium": "cpc",
    "utmCampaign": "life_insurance_2024",
    "funnelName": "life_main",
    "funnelStep": "quote",
    "funnelVariant": "variant_a",
    "abTestId": "cta_color_test",
    "abTestVariant": "blue"
  }'

sleep 2

echo -e "\n\nTesting Disability Insurance Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "test2@example.com",
    "phone": "555-555-5556",
    "age": "40",
    "gender": "female",
    "occupation": "Software Engineer",
    "employmentStatus": "full-time",
    "incomeRange": "100000-150000",
    "productType": "disability",
    "utmSource": "facebook",
    "utmMedium": "social",
    "utmCampaign": "disability_awareness",
    "funnelName": "disability_main",
    "funnelStep": "quote",
    "funnelVariant": "variant_b",
    "abTestId": "form_layout_test",
    "abTestVariant": "single_page"
  }'

sleep 2

echo -e "\n\nTesting Supplemental Health Form..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Bob",
    "lastName": "Wilson",
    "email": "test3@example.com",
    "phone": "555-555-5557",
    "age": "45",
    "gender": "male",
    "preExistingConditions": "none",
    "desiredCoverageType": "accident",
    "productType": "supplemental",
    "utmSource": "linkedin",
    "utmMedium": "social",
    "utmCampaign": "health_benefits",
    "funnelName": "supplemental_main",
    "funnelStep": "quote",
    "funnelVariant": "variant_c",
    "abTestId": "hero_image_test",
    "abTestVariant": "family_photo"
  }' 