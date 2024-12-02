import 'dotenv/config';
import { createServer } from 'node:http'
import { createApp, eventHandler, toNodeListener, setHeader, createError, createRouter } from 'h3'
import { createInvoice, getInvoiceStatus } from './api/create-invoice'
import { createOrder, updateOrder } from './api/create-order'

// Verify env variables are loaded
console.log('PayPal Mode:', process.env.VITE_PAYPAL_MODE);
console.log('Client ID exists:', !!process.env.VITE_PAYPAL_SANDBOX_CLIENT_ID);
console.log('Secret exists:', !!process.env.VITE_PAYPAL_SANDBOX_SECRET);

const app = createApp()
const router = createRouter()

// Enable CORS
app.use('*', eventHandler(async (event) => {
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.end()
    return
  }
}))

// Create PayPal Invoice
router.post('/api/create-invoice', eventHandler(async (event) => {
  try {
    const response = await createInvoice(event);
    return response;
  } catch (error: any) {
    console.error('Error in create-invoice handler:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    });
  }
}))

// Get Invoice Status
router.get('/api/invoice-status/:id', eventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Invoice ID is required'
      })
    }

    return await getInvoiceStatus(id)
  } catch (error: any) {
    console.error('Error in invoice-status handler:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
}))

// Create Order
router.post('/api/orders', eventHandler(async (event) => {
  try {
    return await createOrder(event);
  } catch (error: any) {
    console.error('Error in create-order handler:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    });
  }
}))

// Update Order
router.patch('/api/orders/:id', eventHandler(async (event) => {
  try {
    // Extract id from URL
    const id = event.context.params?.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Order ID is required'
      });
    }

    // Set the id in the event context
    event.context.params = { id };

    return await updateOrder(event);
  } catch (error: any) {
    console.error('Error in update-order handler:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    });
  }
}))

// Use router
app.use(router)

// Create server
const server = createServer(toNodeListener(app))

// Start server
const port = process.env.PORT || 8090
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
