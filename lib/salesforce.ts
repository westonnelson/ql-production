import { createClient } from '@supabase/supabase-js';
import { sendEmail } from './email';
import * as jsforce from 'jsforce';

const SALESFORCE_INSTANCE_URL = process.env.SALESFORCE_INSTANCE_URL;
const SALESFORCE_TOKEN = process.env.SALESFORCE_TOKEN;

interface SalesforceConfig {
  username: string;
  password: string;
  securityToken: string;
  loginUrl: string;
}

interface SalesforceOpportunity {
  Name: string;
  StageName: string;
  CloseDate: string;
  Amount: number;
  Description: string;
  ProductType__c: string;
  ContactInfo__c: string;
  SubmissionTimestamp__c: string;
  LeadSource: string;
}

interface SalesforceResult {
  id: string;
  success: boolean;
  errors?: Array<{
    statusCode: string;
    message: string;
    fields: string[];
  }>;
}

// Function to check if Salesforce is properly configured
export function isSalesforceConfigured(): boolean {
  return !!(
    process.env.SALESFORCE_TOKEN && 
    process.env.SALESFORCE_INSTANCE_URL
  );
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
    const opportunityData = mapFieldsToSalesforce(submission);

    const response = await fetch(`${SALESFORCE_INSTANCE_URL}/services/data/v57.0/sobjects/Opportunity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SALESFORCE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(opportunityData)
    });

    if (!response.ok) {
      throw new Error('Failed to create Salesforce opportunity');
    }

    const result = await response.json();

    // Create a task for the assigned agent
    if (result && result.id) {
      await fetch(`${SALESFORCE_INSTANCE_URL}/services/data/v57.0/sobjects/Task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SALESFORCE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          WhoId: result.id,
          Subject: `New ${INSURANCE_TYPE_MAP[submission.insuranceType as keyof typeof INSURANCE_TYPE_MAP]} Quote Request`,
          Description: `New quote request from ${submission.firstName} ${submission.lastName}.\nPhone: ${submission.phone}\nEmail: ${submission.email}\nBest Time to Call: ${submission.bestTimeToCall}`,
          Priority: 'High',
          Status: 'New',
          Type: 'Quote Request'
        })
      });
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Salesforce integration error:', error);
    // Send fallback notification
    await sendEmail({
      to: process.env.AGENT_EMAIL!,
      subject: 'New Quote Request - Salesforce Integration Failed',
      text: `A new quote request was received but failed to sync with Salesforce. Please check the system.\n\nForm Data: ${JSON.stringify(submission, null, 2)}`
    });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function getSalesforceToken(): Promise<string | null> {
  const token = process.env.SALESFORCE_TOKEN as string | undefined;
  if (!token) {
    console.warn('SALESFORCE_TOKEN is not defined');
    return null;
  }
  return token;
}

export class SalesforceClient {
  private connection: jsforce.Connection;
  private config: SalesforceConfig;

  constructor(config: SalesforceConfig) {
    this.config = config;
    this.connection = new jsforce.Connection({
      loginUrl: config.loginUrl
    });
  }

  async authenticate(): Promise<jsforce.UserInfo> {
    try {
      const userInfo = await this.connection.login(
        this.config.username,
        this.config.password + this.config.securityToken
      );
      return userInfo;
    } catch (error) {
      console.error('Salesforce authentication failed:', error);
      throw new Error('Failed to authenticate with Salesforce');
    }
  }

  async createOpportunity(opportunity: SalesforceOpportunity): Promise<SalesforceResult> {
    try {
      const result = await this.connection.sobject('Opportunity').create(opportunity) as SalesforceResult;
      
      if (!result.success) {
        throw new Error(`Failed to create opportunity: ${result.errors?.[0].message}`);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to create opportunity:', error);
      throw error;
    }
  }

  async deleteOpportunity(id: string): Promise<void> {
    try {
      await this.connection.sobject('Opportunity').destroy(id);
    } catch (error) {
      console.error('Failed to delete opportunity:', error);
      throw error;
    }
  }

  async getOpportunity(id: string): Promise<any> {
    try {
      return await this.connection.sobject('Opportunity').retrieve(id);
    } catch (error) {
      console.error('Failed to retrieve opportunity:', error);
      throw error;
    }
  }

  async updateOpportunity(id: string, data: Partial<SalesforceOpportunity>): Promise<SalesforceResult> {
    try {
      const result = await this.connection.sobject('Opportunity').update({
        Id: id,
        ...data
      }) as SalesforceResult;

      if (!result.success) {
        throw new Error(`Failed to update opportunity: ${result.errors?.[0].message}`);
      }

      return result;
    } catch (error) {
      console.error('Failed to update opportunity:', error);
      throw error;
    }
  }
}