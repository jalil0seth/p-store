import { Request, Response } from 'express';
import fetch from 'node-fetch';

const SUMUP_API_KEY = process.env.VITE_SUMUP_API_KEY;
const SUMUP_API_URL = 'https://api.sumup.com/v0.1/checkouts';
const TEST_API_URL = 'https://api.sumup.com/v0.1/checkouts/test';

export async function createPayment(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, description, redirectUrl } = req.body;

    // Use test endpoint in development
    const apiUrl = process.env.NODE_ENV === 'production' ? SUMUP_API_URL : TEST_API_URL;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUMUP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkout_reference: `order-${Date.now()}`,
        amount,
        currency: 'EUR',
        description,
        return_url: redirectUrl,
        merchant_code: process.env.VITE_SUMUP_MERCHANT_CODE,
        payment_type: process.env.NODE_ENV === 'production' ? 'card' : 'test',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create payment');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Payment creation error:', error);
    return res.status(500).json({ error: 'Failed to create payment' });
  }
}
