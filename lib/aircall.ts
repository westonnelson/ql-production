import axios from 'axios';

// Aircall API configuration
const AIRCALL_API_URL = process.env.AIRCALL_API_URL || 'https://api.aircall.io/v1';
const AIRCALL_API_ID = process.env.AIRCALL_API_ID;
const AIRCALL_API_TOKEN = process.env.AIRCALL_API_TOKEN;

// Check if Aircall is configured
export const isAircallConfigured = () => {
  return Boolean(AIRCALL_API_ID && AIRCALL_API_TOKEN);
};

// Aircall API client
const aircallClient = axios.create({
  baseURL: AIRCALL_API_URL,
  auth: {
    username: AIRCALL_API_ID || '',
    password: AIRCALL_API_TOKEN || ''
  }
});

// Interfaces
interface AircallContactData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  metadata?: Record<string, any>;
}

interface AircallCallData {
  contactId: number;
  direction: 'inbound' | 'outbound';
  scheduledAt?: string;
  metadata?: Record<string, any>;
}

interface AircallSMSData {
  contactId: number;
  message: string;
}

// Create or update a contact in Aircall
export const createAircallContact = async (data: AircallContactData) => {
  if (!isAircallConfigured()) {
    throw new Error('Aircall is not configured');
  }

  try {
    const response = await aircallClient.post('/contacts', {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phone,
      metadata: data.metadata
    });

    return response.data.contact;
  } catch (error) {
    console.error('Error creating Aircall contact:', error);
    throw error;
  }
};

// Create a call in Aircall
export const createAircallCall = async (data: AircallCallData) => {
  if (!isAircallConfigured()) {
    throw new Error('Aircall is not configured');
  }

  try {
    const response = await aircallClient.post('/calls', {
      contact_id: data.contactId,
      direction: data.direction,
      scheduled_at: data.scheduledAt,
      metadata: data.metadata
    });

    return response.data.call;
  } catch (error) {
    console.error('Error creating Aircall call:', error);
    throw error;
  }
};

// Send SMS via Aircall
export const sendAircallSMS = async (data: AircallSMSData) => {
  if (!isAircallConfigured()) {
    throw new Error('Aircall is not configured');
  }

  try {
    const response = await aircallClient.post('/messages', {
      contact_id: data.contactId,
      content: data.message,
      direction: 'outbound'
    });

    return response.data.message;
  } catch (error) {
    console.error('Error sending Aircall SMS:', error);
    throw error;
  }
}; 