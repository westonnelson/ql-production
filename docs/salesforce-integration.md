# Salesforce Integration

This document outlines how to set up and use the Salesforce integration for the QuoteLinker application.

## Overview

The Salesforce integration allows form submissions to be automatically converted into Leads and Opportunities in Salesforce. This enables a seamless flow from paid traffic to Salesforce Opportunity creation in real-time.

## Prerequisites

- A Salesforce account with API access
- Supabase project with Edge Functions enabled
- Environment variables configured (see below)

## Environment Variables

The following environment variables need to be set in your `.env.local` file and in your Supabase project:

```
# Salesforce Credentials
SALESFORCE_USERNAME=your_salesforce_username
SALESFORCE_PASSWORD=your_salesforce_password
SALESFORCE_SECURITY_TOKEN=your_salesforce_security_token
SALESFORCE_LOGIN_URL=https://login.salesforce.com  # or https://test.salesforce.com for sandbox

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Database Tables

The integration uses the following tables in Supabase:

1. `health_check` - Used for health monitoring
2. `salesforce_integration_logs` - Logs all Salesforce integration activities

## Edge Functions

The integration uses two Supabase Edge Functions:

1. `salesforce-health-check` - Checks the health of the Salesforce connection
2. `create-salesforce-opportunity` - Creates Leads and Opportunities in Salesforce

## Deployment

To deploy the Edge Functions, run:

```bash
./scripts/deploy-edge-functions.sh
```

## How It Works

1. When a user submits a form, the data is sent to the `/api/submit-quote` endpoint
2. The endpoint validates the data and stores it in Supabase
3. Confirmation emails are sent to the user and agent
4. The endpoint calls the `create-salesforce-opportunity` Edge Function
5. The Edge Function:
   - Connects to Salesforce
   - Creates or updates a Lead
   - Creates an Opportunity linked to the Lead
   - Logs the activity in Supabase

## Monitoring

You can monitor the health of the integration by:

1. Checking the `/api/health` endpoint
2. Viewing the logs in the Supabase dashboard
3. Checking the `salesforce_integration_logs` table

## Troubleshooting

If you encounter issues:

1. Check the Supabase logs for the Edge Functions
2. Verify that all environment variables are set correctly
3. Ensure that the Salesforce credentials have the necessary permissions
4. Check the `salesforce_integration_logs` table for error messages

## Customization

You can customize the Salesforce integration by:

1. Modifying the field mappings in the `create-salesforce-opportunity` Edge Function
2. Adding additional fields to the Lead or Opportunity objects
3. Implementing custom validation or business logic

## Security Considerations

- The Salesforce credentials are stored securely in environment variables
- The Edge Functions use the Supabase service role key for authentication
- Row Level Security (RLS) is enabled on the `salesforce_integration_logs` table 