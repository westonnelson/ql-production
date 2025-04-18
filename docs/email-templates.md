# Email Templates

This document outlines the email notification system in the QuoteLinker application.

## Overview

The email notification system sends automated emails to users and agents based on form submissions and other events. Emails are sent using the Resend API and are templated using React Email.

## Email Types

The following types of emails are sent:

1. **Quote Confirmation**: Sent to users after they submit a quote form
2. **Agent Notification**: Sent to agents when a new quote is submitted
3. **Welcome Email**: Sent to users when they first sign up
4. **Follow-up Email**: Sent to users who haven't completed a quote form

## Email Templates

Email templates are located in the `emails` directory and are written using React Email components:

```tsx
// emails/QuoteConfirmation.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface QuoteConfirmationEmailProps {
  firstName: string;
  insuranceType: string;
  quoteDetails: {
    coverage: string;
    premium: string;
    term: string;
  };
}

export const QuoteConfirmationEmail = ({
  firstName,
  insuranceType,
  quoteDetails,
}: QuoteConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your {insuranceType} Quote Confirmation</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank you for your quote request!</Heading>
          <Text style={text}>
            Hi {firstName},
          </Text>
          <Text style={text}>
            We've received your {insuranceType} quote request and will be in touch shortly.
          </Text>
          <Section style={detailsContainer}>
            <Text style={details}>
              Coverage: {quoteDetails.coverage}
              Premium: {quoteDetails.premium}
              Term: {quoteDetails.term}
            </Text>
          </Section>
          <Text style={text}>
            A licensed agent will review your information and contact you within 24 hours.
          </Text>
          <Text style={footer}>
            Best regards,
            The QuoteLinker Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  margin: '16px 0',
};

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
};

const detailsContainer = {
  backgroundColor: '#f9f9f9',
  borderRadius: '4px',
  padding: '16px',
  margin: '16px 0',
};

const details = {
  color: '#4a4a4a',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
};

const footer = {
  color: '#4a4a4a',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '32px 0 0',
};
```

## Sending Emails

Emails are sent using the Resend API. Here's how to send an email:

```typescript
import { Resend } from 'resend';
import { QuoteConfirmationEmail } from '@/emails/QuoteConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

// In your API route or server action
const sendQuoteConfirmation = async (userData) => {
  try {
    await resend.emails.send({
      from: 'QuoteLinker <quotes@quotelinker.com>',
      to: userData.email,
      subject: `Your ${userData.insuranceType} Quote Confirmation`,
      react: QuoteConfirmationEmail({
        firstName: userData.firstName,
        insuranceType: userData.insuranceType,
        quoteDetails: userData.quoteDetails,
      }),
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
```

## Email Settings

Email settings are configured in the `.env.local` file:

```bash
RESEND_API_KEY=re_123...
EMAIL_FROM=quotes@quotelinker.com
```

## Best Practices

1. **Mobile Responsiveness**: Ensure all email templates are mobile-responsive
2. **Accessibility**: Use semantic HTML and proper color contrast
3. **Testing**: Test emails across different email clients
4. **Personalization**: Use dynamic content to personalize emails
5. **Unsubscribe**: Include an unsubscribe link in all marketing emails

## Troubleshooting

If you encounter issues with email sending:

1. Check the Resend API dashboard for delivery status
2. Verify that the API key is correct
3. Check the email template for syntax errors
4. Ensure all required props are passed to the email template
5. Check the server logs for error messages 