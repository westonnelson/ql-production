import axios from 'axios';

async function getSalesforceToken(): Promise<string> {
  const token = process.env.SALESFORCE_TOKEN;
  if (!token) {
    throw new Error('SALESFORCE_TOKEN is not defined');
  }
  return token;
}

export async function createSalesforceOpportunity(submission: Record<string, any>): Promise<any> {
  const token = await getSalesforceToken();
  const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
  
  if (!instanceUrl) {
    throw new Error('SALESFORCE_INSTANCE_URL is not defined');
  }
  
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