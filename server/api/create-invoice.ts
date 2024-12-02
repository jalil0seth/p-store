import { defineEventHandler, readBody, createError } from 'h3';
import fetch from 'node-fetch';

const SANDBOX_CLIENT_ID = process.env.VITE_PAYPAL_SANDBOX_CLIENT_ID;
const SANDBOX_SECRET = process.env.VITE_PAYPAL_SANDBOX_SECRET;
const MODE = process.env.VITE_PAYPAL_MODE || 'sandbox';
const CURRENCY = 'USD';

const API_URL = MODE === 'sandbox' 
  ? 'https://api.sandbox.paypal.com' 
  : 'https://api.paypal.com';

async function getAccessToken() {
  if (!SANDBOX_CLIENT_ID || !SANDBOX_SECRET) {
    console.error('PayPal credentials missing:', { 
      hasClientId: !!SANDBOX_CLIENT_ID, 
      hasSecret: !!SANDBOX_SECRET 
    });
    throw new Error('PayPal credentials are not configured');
  }

  const auth = Buffer.from(`${SANDBOX_CLIENT_ID}:${SANDBOX_SECRET}`).toString('base64');
  
  try {
    console.log('Requesting PayPal access token...');
    const response = await fetch(`${API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PayPal token error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully obtained PayPal access token');
    return data.access_token;
  } catch (error) {
    console.error('PayPal auth error:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Authentication failed'
    });
  }
}

export async function createInvoice(event: any) {
  try {
    // Log the raw request
    const rawBody = await readBody(event);
    console.log('Received request body:', rawBody);

    // Extract fields from the request
    const amount = rawBody?.amount?.toString();
    const orderRef = rawBody?.orderRef?.toString();
    const email = rawBody?.email?.toString();

    console.log('Extracted fields:', { amount, orderRef, email });

    // Validate required fields
    const missingFields = [];
    if (!amount) missingFields.push('amount');
    if (!orderRef) missingFields.push('orderRef');
    if (!email) missingFields.push('email');

    if (missingFields.length > 0) {
      throw createError({
        statusCode: 400,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Get shop details from environment variables
    const shopName = process.env.VITE_SHOP_NAME || 'Store Name';
    const shopNotes = process.env.VITE_SHOP_NOTES || '';
    const shopTerms = process.env.VITE_SHOP_TERMS || '';

    // Split shop name for given_name and surname
    const [firstName, lastName] = shopName.split(' ');

    console.log('Getting PayPal access token...');
    const accessToken = await getAccessToken();

    console.log('Creating PayPal invoice...');

    // Create invoice draft
    const invoiceData = {
      detail: {
        invoice_number: `INV-${Date.now()}`,
        currency_code: CURRENCY,
        note: shopNotes,
        terms_and_conditions: shopTerms
      },
      invoicer: {
        name: {
          given_name: firstName,
          surname: lastName || '',
        },
      },
      primary_recipients: [{
        billing_info: {
          email_address: email
        }
      }],
      items: [{
        name: `Order ${orderRef}`,
        description: 'Support & Service provided',
        quantity: '1',
        unit_amount: {
          currency_code: CURRENCY,
          value: amount
        }
      }],
      amount: {
        breakdown: {
          item_total: {
            currency_code: CURRENCY,
            value: amount
          }
        }
      }
    };

    // Create invoice
    const invoiceResponse = await fetch(`${API_URL}/v2/invoicing/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(invoiceData),
    });

    if (!invoiceResponse.ok) {
      const errorData = await invoiceResponse.json();
      console.error('PayPal invoice creation error:', errorData);
      throw new Error(`Failed to create invoice: ${invoiceResponse.status} ${invoiceResponse.statusText}`);
    }

    const invoiceDataResponse = await invoiceResponse.json();
    console.log('Invoice created:', invoiceDataResponse);
    
    // Extract invoice ID from href
    const parts = invoiceDataResponse.href.split('/');
    const invoiceId = parts[parts.length - 1];

    console.log('Sending PayPal invoice...');
    // Send the invoice
    const sendResponse = await fetch(`${API_URL}/v2/invoicing/invoices/${invoiceId}/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({}) // Empty body but required
    });

    if (!sendResponse.ok) {
      const errorData = await sendResponse.json();
      console.error('PayPal send invoice error:', {
        status: sendResponse.status,
        statusText: sendResponse.statusText,
        error: JSON.stringify(errorData)
      });
      throw new Error(`Failed to send invoice: ${sendResponse.status} ${sendResponse.statusText}`);
    }

    const sendData = await sendResponse.json();
    console.log('Invoice sent successfully:', sendData);
    
    // Get the payment URL
    const paymentUrl = `https://www.sandbox.paypal.com/invoice/p/#${invoiceId}`;
    
    return {
      url: paymentUrl,
      id: invoiceId,
      total: amount
    };

  } catch (error: any) {
    console.error('Error creating invoice:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create invoice'
    });
  }
}

export async function getInvoiceStatus(invoiceId: string) {
  try {
    const accessToken = await getAccessToken();
    
    const response = await fetch(`${API_URL}/v2/invoicing/invoices/${invoiceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get invoice status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const status = data.status;

    // Convert PayPal status to simplified status
    let statusResponse = status.toLowerCase();
    if (status === 'PAYMENT_PENDING') {
      statusResponse = 'pending';
    } else if (status === 'PAID') {
      statusResponse = 'paid';
    }

    return { status: statusResponse };
    
  } catch (error) {
    console.error('Error getting invoice status:', error);
    throw error;
  }
}

export async function generateQRCode(invoiceId: string) {
  try {
    console.log('Generating QR code for invoice:', invoiceId);
    const accessToken = await getAccessToken();

    const response = await fetch(`${API_URL}/v2/invoicing/invoices/${invoiceId}/generate-qr-code`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        width: 500,
        height: 500,
        action: 'pay'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('PayPal QR code generation error:', errorData);
      throw new Error(`Failed to generate QR code: ${response.status} ${response.statusText}`);
    }

    // PayPal returns a multipart response, we need to extract the image data
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);

  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}
