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

interface QuoteStatusEmailProps {
  firstName: string;
  insuranceType: string;
  quoteId: string;
  status: 'processing' | 'completed' | 'cancelled';
  statusMessage: string;
  nextSteps?: string[];
}

export const QuoteStatusEmail = ({
  firstName,
  insuranceType,
  quoteId,
  status,
  statusMessage,
  nextSteps,
}: QuoteStatusEmailProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return '#FFA500';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#FF0000';
      default:
        return '#4a4a4a';
    }
  };

  const previewText = `Update on your ${insuranceType} quote request`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Quote Status Update</Heading>
          <Text style={text}>Hi {firstName},</Text>
          <Text style={text}>
            We wanted to let you know about the status of your {insuranceType} quote request.
          </Text>
          <Section style={section}>
            <Text style={text}>
              Status: <span style={{ color: getStatusColor(status), fontWeight: '600' }}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </Text>
            <Text style={text}>
              {statusMessage}
            </Text>
            {nextSteps && nextSteps.length > 0 && (
              <>
                <Text style={text}>Next Steps:</Text>
                <ul style={list}>
                  {nextSteps.map((step, index) => (
                    <li key={index} style={listItem}>{step}</li>
                  ))}
                </ul>
              </>
            )}
          </Section>
          <Text style={text}>
            Your quote request ID is: <strong>{quoteId}</strong>
          </Text>
          <Text style={text}>
            If you have any questions about your quote status, please contact our support team at{' '}
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

export default QuoteStatusEmail;

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
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '16px 0',
  paddingLeft: '24px',
};

const listItem = {
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