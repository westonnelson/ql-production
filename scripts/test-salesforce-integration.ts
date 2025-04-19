import { config } from 'dotenv';
import { SalesforceClient } from '../lib/salesforce';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function testSalesforceIntegration() {
  console.log('Starting Salesforce integration test...');

  // Initialize Salesforce client
  const sfClient = new SalesforceClient({
    username: process.env.SF_USERNAME || '',
    password: process.env.SF_PASSWORD || '',
    securityToken: process.env.SF_SECURITY_TOKEN || '',
    loginUrl: process.env.SF_LOGIN_URL || 'https://login.salesforce.com'
  });

  try {
    // Test authentication
    console.log('Authenticating with Salesforce...');
    const userInfo = await sfClient.authenticate();
    console.log('Successfully authenticated with Salesforce. User ID:', userInfo.id);

    // Create test opportunity
    console.log('Creating test opportunity...');
    const testOpportunity = {
      Name: `Test Opportunity ${new Date().toISOString()}`,
      StageName: 'Prospecting',
      CloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      Amount: 1000,
      Description: 'Test opportunity created by integration test',
      ProductType__c: 'Life Insurance',
      ContactInfo__c: 'Test Contact',
      SubmissionTimestamp__c: new Date().toISOString(),
      LeadSource: 'Test Integration'
    };

    const createResult = await sfClient.createOpportunity(testOpportunity);
    console.log('Successfully created test opportunity with ID:', createResult.id);

    // Retrieve the created opportunity
    console.log('Retrieving created opportunity...');
    const retrievedOpportunity = await sfClient.getOpportunity(createResult.id);
    console.log('Successfully retrieved opportunity:', retrievedOpportunity.Name);

    // Update the opportunity
    console.log('Updating opportunity...');
    const updateResult = await sfClient.updateOpportunity(createResult.id, {
      Amount: 2000,
      Description: 'Updated test opportunity'
    });
    console.log('Successfully updated opportunity');

    // Clean up - delete the test opportunity
    console.log('Cleaning up - deleting test opportunity...');
    await sfClient.deleteOpportunity(createResult.id);
    console.log('Successfully deleted test opportunity');

    console.log('Salesforce integration test completed successfully!');
  } catch (error) {
    console.error('Salesforce integration test failed:', error);
    process.exit(1);
  }
}

// Run the test
testSalesforceIntegration(); 