import { createClient } from '@supabase/supabase-js';
import { sendEmail } from './email';
import * as jsforce from 'jsforce';

// Salesforce API configuration
const SALESFORCE_INSTANCE_URL = process.env.SALESFORCE_INSTANCE_URL;
const SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID;
const SALESFORCE_CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET;
const SALESFORCE_REFRESH_TOKEN = process.env.SALESFORCE_REFRESH_TOKEN;

interface SalesforceConfig {
  username: string;
  password: string;
  securityToken: string;
  loginUrl: string;
}

export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  age: string;
  gender: string;
  insuranceType: string;
  estimatedAmount?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  bestTimeToCall?: string;
  preferredContactMethod?: 'phone' | 'sms';
  company?: string;
  source?: string;
  description?: string;
}

interface AccountData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode?: string;
  company?: string;
}

export interface OpportunityData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode?: string;
  company?: string;
  source?: string;
  description?: string;
  insuranceType?: string;
  estimatedAmount?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  stageName?: string;
  closeDate?: string;
  leadId?: string;
  type?: string;
}

interface SalesforceQueryResult {
  totalSize: number;
  records: Array<{
    Id: string;
    [key: string]: any;
  }>;
}

// Initialize Salesforce connection
const sf = new jsforce.Connection({
  loginUrl: process.env.SF_LOGIN_URL || 'https://login.salesforce.com'
});

// Connect to Salesforce using OAuth
export const connectToSalesforce = async () => {
  try {
    // Check if we have OAuth credentials
    if (SALESFORCE_CLIENT_ID && SALESFORCE_CLIENT_SECRET && SALESFORCE_REFRESH_TOKEN) {
      // Use OAuth refresh token flow
      await new Promise((resolve, reject) => {
        sf.oauth2.refreshToken(SALESFORCE_REFRESH_TOKEN, (err, tokenResponse) => {
          if (err) {
            reject(err);
          } else {
            resolve(tokenResponse);
          }
        });
      });
      console.log('Connected to Salesforce using OAuth');
      return sf;
    } else if (process.env.SF_USERNAME && process.env.SF_PASSWORD && process.env.SF_SECURITY_TOKEN) {
      // Fall back to username/password authentication
      await sf.login(
        process.env.SF_USERNAME,
        process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN
      );
      console.log('Connected to Salesforce using username/password');
      return sf;
    } else {
      throw new Error('No Salesforce credentials available');
    }
  } catch (error) {
    console.error('Error connecting to Salesforce:', error);
    throw error;
  }
};

// Function to check if Salesforce is properly configured
export function isSalesforceConfigured(): boolean {
  return !!(
    (SALESFORCE_CLIENT_ID && SALESFORCE_CLIENT_SECRET && SALESFORCE_REFRESH_TOKEN) ||
    (process.env.SF_USERNAME && process.env.SF_PASSWORD && process.env.SF_SECURITY_TOKEN)
  );
}

// Create or update an Account in Salesforce
export const createOrUpdateSalesforceAccount = async (data: AccountData) => {
  try {
    const conn = await connectToSalesforce();
    
    // Check if account already exists by email
    const existingAccounts = await conn.query(
      `SELECT Id FROM Account WHERE PersonEmail = '${data.email}' OR PersonContact.Email = '${data.email}'`
    ) as SalesforceQueryResult;
    
    if (existingAccounts.totalSize > 0) {
      // Account exists, update it
      const accountId = existingAccounts.records[0].Id;
      const account = {
        Id: accountId,
        PersonContact: {
          FirstName: data.firstName,
          LastName: data.lastName,
          Email: data.email,
          Phone: data.phone,
          MailingPostalCode: data.zipCode || '',
          Company: data.company || 'Not provided'
        }
      };
      
      const result = await conn.sobject('Account').update(account);
      
      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Failed to update account');
      }
      
      console.log('Account updated successfully:', accountId);
      return { success: true, id: accountId };
    } else {
      // Create new account
      const account = {
        FirstName: data.firstName,
        LastName: data.lastName,
        PersonContact: {
          FirstName: data.firstName,
          LastName: data.lastName,
          Email: data.email,
          Phone: data.phone,
          MailingPostalCode: data.zipCode || '',
          Company: data.company || 'Not provided'
        }
      };
      
      const result = await conn.sobject('Account').create(account);
      
      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Failed to create account');
      }
      
      console.log('Account created successfully:', result.id);
      return { success: true, id: result.id };
    }
  } catch (error) {
    console.error('Error creating/updating Salesforce account:', error);
    throw error;
  }
};

// Create a Lead in Salesforce
export const createSalesforceLead = async (data: LeadData) => {
  try {
    const conn = await connectToSalesforce();
    
    const leadData = {
      FirstName: data.firstName,
      LastName: data.lastName,
      Email: data.email,
      Phone: data.phone,
      PostalCode: data.zipCode,
      Age__c: data.age,
      Gender__c: data.gender,
      Insurance_Type__c: data.insuranceType,
      Company: data.company || 'Not provided',
      LeadSource: data.source || 'Website',
      Description: data.description || '',
      Estimated_Amount__c: data.estimatedAmount || '',
      UTM_Source__c: data.utmSource || '',
      UTM_Medium__c: data.utmMedium || '',
      UTM_Campaign__c: data.utmCampaign || '',
      Best_Time_to_Call__c: data.bestTimeToCall || '',
      Preferred_Contact_Method__c: data.preferredContactMethod || 'phone'
    };

    const result = await conn.sobject('Lead').create(leadData);
    
    if (!result.success) {
      throw new Error(result.errors?.[0]?.message || 'Failed to create lead');
    }
    
    console.log('Lead created successfully:', result.id);
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Error creating Salesforce lead:', error);
    throw error;
  }
};

// Create an opportunity in Salesforce
export const createSalesforceOpportunity = async (data: OpportunityData) => {
  try {
    const conn = await connectToSalesforce();
    
    // Create or update account first
    const accountResult = await createOrUpdateSalesforceAccount({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      zipCode: data.zipCode,
      company: data.company
    });
    
    const opportunity = {
      AccountId: accountResult.id,
      Name: `${data.firstName} ${data.lastName} - ${data.insuranceType || 'Insurance'} Quote`,
      StageName: data.stageName || 'New',
      CloseDate: data.closeDate || new Date().toISOString().split('T')[0],
      Type: data.type || 'New Business',
      Description: `Quote request for ${data.insuranceType || 'insurance'}\nUTM Source: ${data.utmSource}\nUTM Medium: ${data.utmMedium}\nUTM Campaign: ${data.utmCampaign}`,
      LeadSource: data.source || 'Website',
      Contact_Email__c: data.email,
      Insurance_Type__c: data.insuranceType || '',
      Estimated_Amount__c: data.estimatedAmount || '',
      UTM_Source__c: data.utmSource || '',
      UTM_Medium__c: data.utmMedium || '',
      UTM_Campaign__c: data.utmCampaign || ''
    };

    const result = await conn.sobject('Opportunity').create(opportunity);
    
    if (!result.success) {
      throw new Error(result.errors?.[0]?.message || 'Failed to create opportunity');
    }

    // Create a task for follow-up
    await conn.sobject('Task').create({
      WhoId: accountResult.id,
      WhatId: result.id,
      Subject: `New ${data.insuranceType || 'Insurance'} Quote Request`,
      Description: `New quote request from ${data.firstName} ${data.lastName}.\nPhone: ${data.phone}\nEmail: ${data.email}`,
      Priority: 'High',
      Status: 'New',
      Type: 'Quote Request'
    });

    console.log('Opportunity created successfully:', result.id);
    return result;
  } catch (error) {
    console.error('Error creating Salesforce opportunity:', error);
    throw error;
  }
};

// Update an opportunity in Salesforce
export const updateSalesforceOpportunity = async (id: string, data: Partial<OpportunityData>) => {
  try {
    const conn = await connectToSalesforce();
    
    const result = await conn.sobject('Opportunity').update({
      Id: id,
      ...data
    });

    if (!result.success) {
      throw new Error(result.errors?.[0]?.message || 'Failed to update opportunity');
    }

    console.log('Opportunity updated successfully:', id);
    return result;
  } catch (error) {
    console.error('Error updating Salesforce opportunity:', error);
    throw error;
  }
};

// Define the Salesforce record type
interface SalesforceRecord {
  Id: string;
  Name: string;
  [key: string]: any;
}

// Get an Opportunity from Salesforce
export const getSalesforceOpportunity = async (id: string): Promise<SalesforceRecord> => {
  try {
    const conn = await connectToSalesforce();
    const opportunity = await conn.sobject('Opportunity').retrieve(id) as SalesforceRecord;
    return opportunity;
  } catch (error) {
    console.error('Error retrieving opportunity from Salesforce:', error);
    throw error;
  }
};