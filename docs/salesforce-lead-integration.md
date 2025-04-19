# Salesforce Lead Integration

This document outlines the integration between QuoteLinker's lead forms and Salesforce, which automatically creates Salesforce Opportunities when new leads are submitted.

## Overview

When a user submits a lead form on QuoteLinker, the data is stored in the Supabase `leads` table. A webhook is triggered that sends the lead data to a serverless function, which then creates a Salesforce Opportunity with the mapped fields.

## Architecture

1. **Lead Form Submission**: User submits a lead form on QuoteLinker
2. **Supabase Storage**: Lead data is stored in the `leads` table
3. **Webhook Trigger**: Supabase webhook is triggered on new lead insertion
4. **Serverless Function**: The webhook calls the `/api/webhooks/supabase-leads` endpoint
5. **Salesforce Integration**: The serverless function creates a Salesforce Opportunity
6. **Logging**: The integration activity is logged in the `salesforce_integration_logs` table

## Setup Instructions

### 1. Environment Variables

Ensure the following environment variables are set in your `.env.local` file and in your Vercel project:

```
# Salesforce Credentials
SF_USERNAME=your_salesforce_username
SF_PASSWORD=your_salesforce_password
SF_SECURITY_TOKEN=your_salesforce_security_token
SF_LOGIN_URL=https://login.salesforce.com  # or https://test.salesforce.com for sandbox

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_WEBHOOK_SECRET=your_webhook_secret
```

### 2. Database Migration

Run the migration script to create the `salesforce_integration_logs` table:

```bash
node scripts/apply-salesforce-integration-migration.js
```

### 3. Webhook Setup

Set up the Supabase webhook for the leads table:

```bash
node scripts/setup-supabase-webhook.js
```

## Field Mapping

The following fields are mapped from the Supabase `leads` table to Salesforce Opportunity fields:

| Supabase Field | Salesforce Field | Description |
|----------------|------------------|-------------|
| first_name, last_name | Name | Opportunity name formatted as "New Lead - {firstName} {lastName}" |
| email | Contact_Email__c | Lead's email address |
| phone | Contact_Phone__c | Lead's phone number |
| zip_code | Contact_ZipCode__c | Lead's zip code |
| product_type | Product_Type__c | Type of insurance product |
| utm_source, utm_medium, utm_campaign | Description | UTM parameters included in the description |
| - | StageName | Set to "Prospecting" |
| - | CloseDate | Set to 30 days from creation |
| - | Type | Set to "New Business" |
| - | LeadSource | Set to "Website" |

## Error Handling and Retry Logic

The integration includes robust error handling and retry logic:

1. **Authentication Retry**: If Salesforce authentication fails, the system will retry up to 3 times
2. **API Call Retry**: If creating a Salesforce Opportunity fails, the system will retry up to 3 times with a 1-second delay between retries
3. **Error Logging**: All errors are logged in the `salesforce_integration_logs` table

## Monitoring

You can monitor the integration by:

1. Checking the Vercel logs for the `/api/webhooks/supabase-leads` endpoint
2. Viewing the `salesforce_integration_logs` table in Supabase
3. Checking the Salesforce Opportunities created through the integration

## Troubleshooting

If you encounter issues:

1. Check the Vercel logs for error messages
2. Verify that all environment variables are set correctly
3. Ensure that the Salesforce credentials have the necessary permissions
4. Check the `salesforce_integration_logs` table for error messages

## Security Considerations

- The Salesforce credentials are stored securely in environment variables
- The webhook endpoint verifies the Supabase signature to ensure requests are legitimate
- Row Level Security (RLS) is enabled on the `salesforce_integration_logs` table 