import { Resend } from 'resend';

// Initialize Resend with a placeholder key if not available
const resendApiKey = process.env.RESEND_API_KEY || 'placeholder_key';

// Create the Resend client
export const resendClient = new Resend(resendApiKey);

// Export a function to check if Resend is properly configured
export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
} 