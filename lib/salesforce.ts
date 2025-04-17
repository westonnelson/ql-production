import axios from 'axios';

// Function to check if Salesforce is properly configured
export function isSalesforceConfigured(): boolean {
  return !!(
    process.env.SALESFORCE_TOKEN && 
    process.env.SALESFORCE_INSTANCE_URL
  );
}

async function getSalesforceToken(): Promise<string | null> {
  const token = process.env.SALESFORCE_TOKEN as string | undefined;
  if (!token) {
    console.warn('SALESFORCE_TOKEN is not defined');
    return null;
  }
  return token;
}

export async function createSalesforceOpportunity(submission: Record<string, any>): Promise<any> {
  if (!isSalesforceConfigured()) {
    console.warn('Salesforce is not configured - skipping opportunity creation');
    return { success: false, error: 'Salesforce integration not configured' };
  }

  try {
    const token = await getSalesforceToken();
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL as string | undefined;
    
    if (!token || !instanceUrl) {
      return { success: false, error: 'Missing Salesforce credentials' };
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
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to create Salesforce opportunity:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 