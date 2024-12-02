import { NextApiRequest, NextApiResponse } from 'next';

const SUMUP_API_KEY = process.env.SUMUP_API_KEY;
const SUMUP_API_URL = 'https://api.sumup.com/v0.1';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, description, redirectUrl } = req.body;

    const response = await fetch(`${SUMUP_API_URL}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUMUP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkout_reference: `order-${Date.now()}`,
        amount,
        currency: 'EUR', // Change this according to your currency
        description,
        return_url: redirectUrl,
        merchant_code: process.env.SUMUP_MERCHANT_CODE,
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
