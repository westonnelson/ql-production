import { config } from 'dotenv';
import { connectToSalesforce, createSalesforceOpportunity, getSalesforceOpportunity, updateSalesforceOpportunity } from '../lib/salesforce';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function testSalesforceIntegration() {
  console.log('Starting Salesforce integration test...');

  try {
    // Test authentication
    console.log('Authenticating with Salesforce...');
    const conn = await connectToSalesforce();
    console.log('Successfully authenticated with Salesforce');

    // Create test opportunity
    console.log('Creating test opportunity...');
    const testOpportunity = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      insuranceType: 'Life Insurance',
      source: 'Test Integration',
      description: 'Test opportunity created by integration test',
      estimatedAmount: '1000',
      stageName: 'Prospecting',
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: 'New Business'
    };

    const createResult = await createSalesforceOpportunity(testOpportunity);
    console.log('Successfully created test opportunity with ID:', createResult.id);

    // Retrieve the created opportunity
    console.log('Retrieving created opportunity...');
    const retrievedOpportunity = await getSalesforceOpportunity(createResult.id);
    console.log('Successfully retrieved opportunity:', retrievedOpportunity.Name);

    // Update the opportunity
    console.log('Updating opportunity...');
    await updateSalesforceOpportunity(createResult.id, {
      estimatedAmount: '2000',
      description: 'Updated test opportunity'
    });
    console.log('Successfully updated opportunity');

    console.log('Salesforce integration test completed successfully!');
  } catch (error) {
    console.error('Salesforce integration test failed:', error);
    process.exit(1);
  }
}

// Run the test
testSalesforceIntegration(); 