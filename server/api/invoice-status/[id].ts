import { H3Event, createError } from 'h3'
import fetch from 'node-fetch'

const SANDBOX_CLIENT_ID = process.env.VITE_PAYPAL_SANDBOX_CLIENT_ID
const SANDBOX_SECRET = process.env.VITE_PAYPAL_SANDBOX_SECRET
const MODE = process.env.VITE_PAYPAL_MODE || 'sandbox'

const API_URL = MODE === 'sandbox' 
  ? 'https://api.sandbox.paypal.com' 
  : 'https://api.paypal.com'

async function getAccessToken() {
  const auth = Buffer.from(`${SANDBOX_CLIENT_ID}:${SANDBOX_SECRET}`).toString('base64')
  
  try {
    const response = await fetch(`${API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    if (!response.ok) {
      throw new Error('Failed to get access token')
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('PayPal auth error:', error)
    throw new Error('Authentication failed')
  }
}

export async function getInvoiceStatus(event: H3Event) {
  try {
    const invoiceId = event.context.params.id
    const accessToken = await getAccessToken()
    
    const response = await fetch(`${API_URL}/v2/invoicing/invoices/${invoiceId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get invoice status')
    }

    const invoice = await response.json()
    let status = invoice.status

    // Map PayPal status to our status
    if (status === 'PAID') {
      status = 'paid'
    } else if (status === 'PAYMENT_PENDING') {
      status = 'pending'
    }

    return { status }

  } catch (error) {
    console.error('Error getting invoice status:', error)
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
}
