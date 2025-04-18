import { createClient } from '@supabase/supabase-js';
import { sendEmail } from './email';

const SALESFORCE_INSTANCE_URL = process.env.SALESFORCE_INSTANCE_URL;
const SALESFORCE_TOKEN = process.env.SALESFORCE_TOKEN;

interface SalesforceOpportunity {
  Name: string;
  ProductType__c: string;
  ContactInfo__c: string;
  SubmissionTimestamp__c: string;
  LeadSource: string;
  StageName: string;
  Amount: number;
  CloseDate: string;
  Description: string;
}

export async function createSalesforceOpportunity(formData: any) {
  try {
    const opportunity: SalesforceOpportunity = {
      Name: `${formData.firstName} ${formData.lastName}`,
      ProductType__c: formData.insuranceType,
      ContactInfo__c: JSON.stringify({
        email: formData.email,
        phone: formData.phone,
        zipCode: formData.zipCode
      }),
      SubmissionTimestamp__c: new Date().toISOString(),
      LeadSource: 'Web Form',
      StageName: 'New',
      Amount: 0,
      CloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      Description: `Insurance Quote Request - ${formData.insuranceType}`
    };

    const response = await fetch(`${SALESFORCE_INSTANCE_URL}/services/data/v57.0/sobjects/Opportunity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SALESFORCE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(opportunity)
    });

    if (!response.ok) {
      throw new Error('Failed to create Salesforce opportunity');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Salesforce integration error:', error);
    // Send fallback notification
    await sendEmail({
      to: process.env.AGENT_EMAIL!,
      subject: 'New Quote Request - Salesforce Integration Failed',
      text: `A new quote request was received but failed to sync with Salesforce. Please check the system.\n\nForm Data: ${JSON.stringify(formData, null, 2)}`
    });
    throw error;
  }
}

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

// Map insurance types to Salesforce product types
const INSURANCE_TYPE_MAP = {
  term_life: 'Term Life Insurance',
  permanent_life: 'Permanent Life Insurance',
  supplemental_health: 'Supplemental Health Insurance',
  short_term_disability: 'Short-Term Disability Insurance'
};

// Map form fields to Salesforce opportunity fields
function mapFieldsToSalesforce(submission: Record<string, any>) {
  const baseFields = {
    Name: `Insurance Quote - ${INSURANCE_TYPE_MAP[submission.insuranceType as keyof typeof INSURANCE_TYPE_MAP]}`,
    StageName: 'New',
    CloseDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    LeadSource: submission.utm_source || 'Web',
    Description: JSON.stringify(submission),
  };

  // Common fields for all insurance types
  const commonFields = {
    FirstName__c: submission.firstName,
    LastName__c: submission.lastName,
    Email__c: submission.email,
    Phone__c: submission.phone,
    ZipCode__c: submission.zipCode,
    Age__c: submission.age,
    HouseholdSize__c: submission.householdSize,
    IncomeRange__c: submission.incomeRange,
    BestTimeToCall__c: submission.bestTimeToCall,
    UTM_Source__c: submission.utm_source,
    UTM_Medium__c: submission.utm_medium,
    UTM_Campaign__c: submission.utm_campaign,
    UTM_Content__c: submission.utm_content,
    UTM_Term__c: submission.utm_term,
    SubmissionTimestamp__c: submission.timestamp,
  };

  // Insurance type specific fields
  const insuranceSpecificFields = {
    term_life: {
      CoverageAmount__c: submission.coverageAmount,
      TermLength__c: submission.termLength,
      TobaccoUse__c: submission.tobaccoUse,
    },
    permanent_life: {
      CoverageAmount__c: submission.coverageAmount,
      PolicyType__c: submission.policyType,
      TobaccoUse__c: submission.tobaccoUse,
    },
    supplemental_health: {
      HealthStatus__c: submission.healthStatus,
      PreExistingConditions__c: submission.preExistingConditions,
      DesiredCoverageType__c: submission.desiredCoverageType,
    },
    short_term_disability: {
      Occupation__c: submission.occupation,
      EmploymentStatus__c: submission.employmentStatus,
      IncomeRange__c: submission.incomeRange,
      PreExistingConditions__c: submission.preExistingConditions,
    },
  };

  return {
    ...baseFields,
    ...commonFields,
    ...(insuranceSpecificFields[submission.insuranceType as keyof typeof insuranceSpecificFields] || {}),
  };
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
    
    // Map the submission data to Salesforce fields
    const opportunityData = mapFieldsToSalesforce(submission);

    // Create the opportunity in Salesforce
    const response = await fetch(`