import { NextRequest, NextResponse } from 'next/server';
import { isAircallConfigured } from '@/lib/aircall';
import { isSalesforceConfigured } from '@/lib/salesforce';

export async function GET(request: NextRequest) {
  try {
    const aircallStatus = isAircallConfigured();
    const salesforceStatus = isSalesforceConfigured();

    return NextResponse.json({
      success: true,
      integrations: {
        aircall: {
          configured: aircallStatus,
          message: aircallStatus 
            ? 'Aircall is properly configured' 
            : 'Aircall is not configured. Please set AIRCALL_API_ID and AIRCALL_API_TOKEN'
        },
        salesforce: {
          configured: salesforceStatus,
          message: salesforceStatus 
            ? 'Salesforce is properly configured' 
            : 'Salesforce is not configured. Please set SALESFORCE_INSTANCE_URL, SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, and SALESFORCE_REFRESH_TOKEN'
        }
      }
    });
  } catch (error) {
    console.error('Error testing integrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 