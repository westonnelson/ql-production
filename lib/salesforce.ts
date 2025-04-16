import axios from 'axios';

async function getSalesforceToken(): Promise<string> {
  // Return the stored token from environment variables
  return process.env.SALESFORCE_TOKEN as string;
}

export async function createSalesforceOpportunity(submission: Record<string, any>): Promise<any> {
  const token = await getSalesforceToken();
  const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
  
  // Map dynamic submission data to your Salesforce Opportunity fields.
  const opportunityData = {
    Name: `Insurance Quote - ${submission.insuranceType}`,
    StageName: 'New',
    CloseDate: new Date(new Date().setDate(new Date().getDate() + 30))
                .toISOString().split('T')[0],
    LeadSource: submission.utm_source || 'Web',
    Description: JSON.stringify(submission),
    Email__c: submission.email, // Example custom field for email
    // Add additional field mappings as needed.
  };

  const response = await axios.post(
    `${instanceUrl}/services/data/v57.0/sobjects/Opportunity`,
    opportunityData,
    {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }
  );
  return response.data;
} 