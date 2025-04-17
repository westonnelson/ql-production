import { NextResponse } from 'next/server';
import jsforce from 'jsforce';

// Function to check if Salesforce is properly configured
function isSalesforceConfigured(): boolean {
  return !!(
    process.env.SALESFORCE_USERNAME &&
    process.env.SALESFORCE_PASSWORD &&
    process.env.SALESFORCE_SECURITY_TOKEN
  );
}

export async function GET() {
  try {
    // Check if Salesforce credentials are available
    if (!isSalesforceConfigured()) {
      console.warn('Salesforce credentials not configured');
      return NextResponse.json({
        success: false,
        message: 'Salesforce integration not configured',
        details: 'Required environment variables are missing'
      }, { status: 503 });
    }

    try {
      // Initialize Salesforce connection
      const conn = new jsforce.Connection({
        loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'
      });

      // Test authentication
      const username = process.env.SALESFORCE_USERNAME as string;
      const password = process.env.SALESFORCE_PASSWORD as string;
      const securityToken = process.env.SALESFORCE_SECURITY_TOKEN as string;

      if (!username || !password || !securityToken) {
        throw new Error('Missing Salesforce credentials');
      }

      await conn.login(
        username,
        password + securityToken
      );

      // Test lead data
      const testLead = {
        FirstName: 'Test',
        LastName: 'User',
        Email: 'test@example.com',
        Phone: '1234567890',
        Age__c: 30,
        Gender__c: 'other',
        Product_Type__c: 'life',
        LeadSource: 'Test API',
        Status: 'Open - Not Contacted',
        Company: 'Test Company'
      };

      // Create test lead
      const result = await conn.sobject('Lead').create(testLead);

      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Failed to create test lead');
      }

      return NextResponse.json({
        success: true,
        message: 'Test lead created successfully',
        leadId: result.id
      });
    } catch (error) {
      console.error('Salesforce operation error:', error);
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Salesforce operation failed',
        details: 'Error occurred while interacting with Salesforce'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Test lead creation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Error occurred while processing the request'
    }, { status: 500 });
  }
} 