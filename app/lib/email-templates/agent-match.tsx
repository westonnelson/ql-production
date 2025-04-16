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

interface AgentMatchEmailProps {
  firstName: string;
  insuranceType: string;
  quoteId: string;
  agentName: string;
  agentEmail: string;
  agentPhone: string;
}

export const AgentMatchEmail = ({
  firstName,
  insuranceType,
  quoteId,
  agentName,
  agentEmail,
  agentPhone,
}: AgentMatchEmailProps) => {
  const previewText = `We've found a qualified agent for your ${insuranceType} quote`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Agent Match Found</Heading>
          <Text style={text}>Hi {firstName},</Text>
          <Text style={text}>
            Great news! We've found a qualified agent to help you with your {insuranceType} quote request.
          </Text>
          <Section style={section}>
            <Text style={text}>
              Your agent's details:
            </Text>
            <Text style={agentInfo}>
              Name: <strong>{agentName}</strong><br />
              Email: <Link href={`mailto:${agentEmail}`} style={link}>{agentEmail}</Link><br />
              Phone: {agentPhone}
            </Text>
          </Section>
          <Text style={text}>
            Your agent will contact you shortly to discuss your {insuranceType} needs and provide personalized quotes.
          </Text>
          <Text style={text}>
            Your quote request ID is: <strong>{quoteId}</strong>
          </Text>
          <Text style={text}>
            If you have any questions or need to make changes to your request, please contact our support team at{' '}
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

export default AgentMatchEmail;

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

const agentInfo = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '16px 0',
  padding: '16px',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
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