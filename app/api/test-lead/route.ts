import { NextResponse } from 'next/server';
import jsforce from 'jsforce';

export async function GET() {
  try {
    // Initialize Salesforce connection
    const conn = new jsforce.Connection({
      loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'
    });

    // Test authentication
    await conn.login(
      process.env.SALESFORCE_USERNAME!,
      process.env.SALESFORCE_PASSWORD! + process.env.SALESFORCE_SECURITY_TOKEN!
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

    return NextResponse.json({
      success: true,
      message: 'Test lead created successfully',
      leadId: result.id
    });
  } catch (error) {
    console.error('Test lead creation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 