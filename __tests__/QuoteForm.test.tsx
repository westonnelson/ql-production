import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuoteForm from '@/components/QuoteForm';
import { act } from 'react-dom/test-utils';

// Mock the analytics hook
jest.mock('@/lib/hooks/useFormAnalytics', () => ({
  useFormAnalytics: () => ({
    trackSubmission: jest.fn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
);

describe('QuoteForm', () => {
  const insuranceTypes = ['auto', 'life', 'homeowners', 'disability', 'health', 'supplemental'];
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  insuranceTypes.forEach((type) => {
    it(`submits ${type} insurance form successfully`, async () => {
      render(<QuoteForm insuranceType={type} />);

      // Fill out the form
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/First Name/i), {
          target: { value: 'John' },
        });
        fireEvent.change(screen.getByLabelText(/Last Name/i), {
          target: { value: 'Doe' },
        });
        fireEvent.change(screen.getByLabelText(/Email/i), {
          target: { value: 'john@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/Phone/i), {
          target: { value: '1234567890' },
        });
        fireEvent.change(screen.getByLabelText(/ZIP Code/i), {
          target: { value: '12345' },
        });
        fireEvent.change(screen.getByLabelText(/Age/i), {
          target: { value: '30' },
        });
      });

      // Submit the form
      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /Get Your Quote/i }));
      });

      // Verify form submission
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/submit-quote', expect.any(Object));
      });

      // Verify payload
      const fetchCall = (fetch as jest.Mock).mock.calls[0];
      const payload = JSON.parse(fetchCall[1].body);
      expect(payload.insuranceType).toBe(type);
      expect(payload.firstName).toBe('John');
      expect(payload.lastName).toBe('Doe');
    });
  });

  it('displays validation errors for required fields', async () => {
    render(<QuoteForm insuranceType="life" />);

    // Submit empty form
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Get Your Quote/i }));
    });

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock fetch to return an error
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'API Error' }),
      })
    );

    render(<QuoteForm insuranceType="life" />);

    // Fill and submit form
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/First Name/i), {
        target: { value: 'John' },
      });
      fireEvent.change(screen.getByLabelText(/Last Name/i), {
        target: { value: 'Doe' },
      });
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'john@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/Phone/i), {
        target: { value: '1234567890' },
      });
      fireEvent.change(screen.getByLabelText(/ZIP Code/i), {
        target: { value: '12345' },
      });
      fireEvent.change(screen.getByLabelText(/Age/i), {
        target: { value: '30' },
      });
      fireEvent.submit(screen.getByRole('button', { name: /Get Your Quote/i }));
    });

    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });
}); 