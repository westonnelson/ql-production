import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface QuoteConfirmationEmailProps {
  firstName: string;
  insuranceType: string;
  quoteId: string;
}

export const QuoteConfirmationEmail = ({
  firstName,
  insuranceType,
  quoteId,
}: QuoteConfirmationEmailProps) => {
  const previewText = `Thank you for requesting a ${insuranceType} quote`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Quote Request Confirmation</Heading>
          <Text style={text}>Hi {firstName},</Text>
          <Text style={text}>
            Thank you for requesting a {insuranceType} quote through QuoteLinker. We've received your request and will match you with a qualified agent shortly.
          </Text>
          <Section style={section}>
            <Text style={text}>
              Your quote request ID is: <strong>{quoteId}</strong>
            </Text>
          </Section>
          <Text style={text}>
            What happens next?
          </Text>
          <ul style={list}>
            <li style={listItem}>We'll review your requirements</li>
            <li style={listItem}>Match you with a qualified agent in your area</li>
            <li style={listItem}>The agent will contact you within 24 hours</li>
          </ul>
          <Text style={text}>
            If you have any questions, please don't hesitate to contact our support team at{' '}
            <Link href="mailto:support@quotelinker.com" style={link}>
              support@quotelinker.com
            </Link>
          </Text>
          <Text style={footer}>
            Best regards,<br />
            The QuoteLinker Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default QuoteConfirmationEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const section = {
  padding: '24px',
  backgroundColor: '#f6f9fc',
  borderRadius: '4px',
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

const list = {
  margin: '16px 0',
  padding: '0 0 0 20px',
};

const listItem = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '8px 0',
};

const link = {
  color: '#00E0FF',
  textDecoration: 'underline',
};

const footer = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '32px 0 0',
}; 