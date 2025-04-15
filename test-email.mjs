import { sendConfirmationEmail, sendLeadNotificationEmail } from './lib/email.ts';

async function testEmails() {
  console.log('Testing email functionality...');
  
  const testData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '1234567890',
    age: 30,
    gender: 'male',
    productType: 'life',
    coverageAmount: 250000,
    termLength: 20,
    tobaccoUse: false,
    utmSource: 'test_script'
  };
  
  try {
    // Test confirmation email
    console.log('\nTesting confirmation email...');
    const confirmationResult = await sendConfirmationEmail(testData);
    console.log('Confirmation email result:', confirmationResult);
    
    // Test notification email
    console.log('\nTesting notification email...');
    const notificationResult = await sendLeadNotificationEmail(testData);
    console.log('Notification email result:', notificationResult);
    
  } catch (error) {
    console.error('Error testing emails:', error);
  }
}

testEmails(); 