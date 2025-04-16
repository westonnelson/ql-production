import jsforce from 'jsforce';

if (!process.env.SF_USERNAME || !process.env.SF_PASSWORD || !process.env.SF_SECURITY_TOKEN) {
  throw new Error('Missing Salesforce credentials in environment variables');
}

// Initialize Salesforce connection
const sf = new jsforce.Connection({
  loginUrl: process.env.SF_LOGIN_URL || 'https://login.salesforce.com'
});

// Cache the connection token
let sfToken: string | null = null;
let tokenExpiry: number | null = null;

async function getSalesforceConnection() {
  // Check if we have a valid token
  if (sfToken && tokenExpiry && Date.now() < tokenExpiry) {
    return sf;
  }

  // Login to Salesforce
  try {
    const userInfo = await sf.login(
      process.env.SF_USERNAME!,
      process.env.SF_PASSWORD! + process.env.SF_SECURITY_TOKEN!
    );
    
    // Cache the token and set expiry (token typically valid for 2 hours)
    sfToken = userInfo.accessToken;
    tokenExpiry = Date.now() + (2 * 60 * 60 * 1000); // 2 hours
    
    return sf;
  } catch (error) {
    console.error('Error connecting to Salesforce:', error);
    throw error;
  }
}

interface LeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  product_type: string;
  coverage_amount?: number;
  term_length?: number;
  tobacco_use?: boolean;
  occupation?: string;
  employment_status?: string;
  income_range?: string;
  pre_existing_conditions?: string;
  desired_coverage_type?: string;
  utm_source?: string;
  ab_test_variant?: string;
  funnel_name?: string;
  funnel_step?: string;
  funnel_variant?: string;
  ab_test_id?: string;
}

interface SalesforceResult {
  id: string;
  success: boolean;
  errors: string[];
}

export async function createSalesforceOpportunity(data: LeadData) {
  try {
    const sf = await getSalesforceConnection();

    // First, create or update the Lead
    const leadData = {
      FirstName: data.first_name,
      LastName: data.last_name,
      Email: data.email,
      Phone: data.phone,
      Age__c: data.age,
      Gender__c: data.gender,
      Product_Type__c: data.product_type,
      UTM_Source__c: data.utm_source,
      Funnel_Name__c: data.funnel_name,
      Funnel_Step__c: data.funnel_step,
      Funnel_Variant__c: data.funnel_variant,
      AB_Test_ID__c: data.ab_test_id,
      AB_Test_Variant__c: data.ab_test_variant,
    };

    // Add product-specific fields
    if (data.product_type === 'life') {
      Object.assign(leadData, {
        Coverage_Amount__c: data.coverage_amount,
        Term_Length__c: data.term_length,
        Tobacco_Use__c: data.tobacco_use,
      });
    } else if (data.product_type === 'disability') {
      Object.assign(leadData, {
        Occupation__c: data.occupation,
        Employment_Status__c: data.employment_status,
        Income_Range__c: data.income_range,
      });
    } else if (data.product_type === 'supplemental') {
      Object.assign(leadData, {
        Pre_Existing_Conditions__c: data.pre_existing_conditions,
        Desired_Coverage_Type__c: data.desired_coverage_type,
      });
    }

    // Upsert the lead based on email
    const leadResult = await sf.sobject('Lead').upsert(leadData, 'Email') as SalesforceResult;

    if (!leadResult.success) {
      throw new Error(`Failed to create/update lead: ${leadResult.errors.join(', ')}`);
    }

    // Create an Opportunity linked to the Lead
    const opportunityData = {
      Name: `${data.product_type} Insurance Quote - ${data.first_name} ${data.last_name}`,
      StageName: 'New',
      CloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      LeadId: leadResult.id,
      Type: 'New Business',
      Description: `Quote request for ${data.product_type} insurance.\n
        Contact: ${data.first_name} ${data.last_name}\n
        Email: ${data.email}\n
        Phone: ${data.phone}\n
        Age: ${data.age}\n
        Gender: ${data.gender}\n
        ${data.utm_source ? `Source: ${data.utm_source}\n` : ''}
        ${data.funnel_name ? `Funnel: ${data.funnel_name}\n` : ''}
        ${data.funnel_step ? `Step: ${data.funnel_step}\n` : ''}
        ${data.ab_test_variant ? `Test Variant: ${data.ab_test_variant}\n` : ''}`,
    };

    // Add product-specific opportunity fields
    if (data.product_type === 'life') {
      Object.assign(opportunityData, {
        Amount: data.coverage_amount,
        Term_Length__c: data.term_length,
        Tobacco_Use__c: data.tobacco_use,
      });
    } else if (data.product_type === 'disability') {
      Object.assign(opportunityData, {
        Occupation__c: data.occupation,
        Employment_Status__c: data.employment_status,
        Income_Range__c: data.income_range,
      });
    } else if (data.product_type === 'supplemental') {
      Object.assign(opportunityData, {
        Pre_Existing_Conditions__c: data.pre_existing_conditions,
        Desired_Coverage_Type__c: data.desired_coverage_type,
      });
    }

    const opportunity = await sf.sobject('Opportunity').create(opportunityData) as SalesforceResult;

    if (!opportunity.success) {
      throw new Error(`Failed to create opportunity: ${opportunity.errors.join(', ')}`);
    }

    return {
      success: true,
      leadId: leadResult.id,
      opportunityId: opportunity.id,
    };
  } catch (error) {
    console.error('Error creating Salesforce opportunity:', error);
    throw error;
  }
} 