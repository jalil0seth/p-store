import { defineEventHandler, createError, setHeader } from 'h3';
import fetch from 'node-fetch';

const SANDBOX_CLIENT_ID = process.env.VITE_PAYPAL_SANDBOX_CLIENT_ID;
const SANDBOX_SECRET = process.env.VITE_PAYPAL_SANDBOX_SECRET;
const MODE = process.env.VITE_PAYPAL_MODE || 'sandbox';

const API_URL = MODE === 'sandbox' 
  ? 'https://api.sandbox.paypal.com' 
  : 'https://api.paypal.com';

async function getAccessToken() {
  const auth = Buffer.from(`${SANDBOX_CLIENT_ID}:${SANDBOX_SECRET}`).toString('base64');
  
  try {
    const response = await fetch(`${API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('PayPal auth error:', error);
    throw new Error('Authentication failed');
  }
}

export default defineEventHandler(async (event) => {
  try {
    const invoiceId = event.context.params.id;
    const accessToken = await getAccessToken();
    
    const response = await fetch(`${API_URL}/v2/invoicing/invoices/${invoiceId}/generate-qr-code`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        width: 500,
        height: 500,
        action: 'pay'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate QR code');
    }

    const qrCodeData = await response.arrayBuffer();
    
    // Set response headers
    setHeader(event, 'Content-Type', 'image/png');
    
    return Buffer.from(qrCodeData);

  } catch (error) {
    console.error('Error generating QR code:', error);
    throw createError({
      statusCode: 500,
      message: error.message
    });
  }
});
