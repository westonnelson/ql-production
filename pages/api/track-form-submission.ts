import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      insuranceType,
      step,
      timeSpent,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
    } = req.body;

    const { data, error } = await supabase
      .from('form_analytics')
      .insert([
        {
          event_type: 'form_submission',
          insurance_type: insuranceType,
          step,
          time_spent: timeSpent,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
          utm_term,
          timestamp: new Date().toISOString(),
        },
      ]);

    if (error) throw error;

    return res.status(200).json({ message: 'Success', data });
  } catch (error) {
    console.error('Error tracking form submission:', error);
    return res.status(500).json({ message: 'Error tracking form submission' });
  }
} 