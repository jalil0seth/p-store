import { defineEventHandler, readBody, createError } from 'h3';
import fetch from 'node-fetch';

const POCKETBASE_URL = 'http://217.76.51.2:8090';
const ADMIN_EMAIL = 'fc96b2ce-c8f9-4a77-a323-077f92f176ac@admin.com';
const ADMIN_PASSWORD = 'fc96b2ce-c8f9-4a77-a323-077f92f176ac';

let authToken = '';

async function authenticate() {
    try {
        const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identity: ADMIN_EMAIL,
                password: ADMIN_PASSWORD
            })
        });

        const data = await response.json();
        if (data.token) {
            authToken = data.token;
            console.log('Successfully authenticated with PocketBase');
            return true;
        }
        throw new Error('No token in response');
    } catch (error) {
        console.error('Failed to authenticate with PocketBase:', error);
        return false;
    }
}

export async function createOrder(event: any) {
    try {
        // Get request body
        const body = await readBody(event);
        console.log('Received order data:', body);

        // Validate required fields
        if (!body.customer_email || !body.items || !body.customer_device_hash) {
            throw createError({
                statusCode: 400,
                message: 'Missing required fields'
            });
        }

        // Authenticate with PocketBase
        const isAuthenticated = await authenticate();
        if (!isAuthenticated) {
            throw createError({
                statusCode: 500,
                message: 'Failed to authenticate with PocketBase'
            });
        }

        // Create order data
        const orderData = {
            order_number: `ORD-${Date.now()}`,
            customer_email: body.customer_email,
            items: JSON.stringify(body.items),
            info: JSON.stringify(body.info),
            subtotal: Number(body.subtotal),
            total: Number(body.total),
            customer_device_hash: body.customer_device_hash,
            payment_status: 'abandoned',
            payment_provider: 'paypal',
            delivery_status: 'pending',
            delivery_messages: '[]',
            abandoned_cart_processed: false,
            recovery_email_sent: '',
            refunded_at: null
        };

        console.log('Creating order with data:', orderData);

        // Create order in PocketBase
        const response = await fetch(`${POCKETBASE_URL}/api/collections/store_orders/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw createError({
                statusCode: response.status,
                message: error.message || 'Failed to create order'
            });
        }

        const createdOrder = await response.json();
        console.log('Order created successfully:', createdOrder);
        return createdOrder;
    } catch (error) {
        console.error('Error in create-order handler:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Internal server error'
        });
    }
}

export async function updateOrder(event: any) {
    try {
        // Get order ID from URL parameters
        const orderId = event.context.params?.id;
        if (!orderId) {
            throw createError({
                statusCode: 400,
                message: 'Order ID is required'
            });
        }

        // Get request body
        const body = await readBody(event);
        console.log('Received order update data:', body);

        // Validate required fields
        if (!body.customer_email || !body.items || !body.customer_device_hash) {
            throw createError({
                statusCode: 400,
                message: 'Missing required fields'
            });
        }

        // Authenticate with PocketBase
        const isAuthenticated = await authenticate();
        if (!isAuthenticated) {
            throw createError({
                statusCode: 500,
                message: 'Failed to authenticate with PocketBase'
            });
        }

        // Prepare order data
        const orderData = {
            customer_email: body.customer_email,
            items: JSON.stringify(body.items),
            info: JSON.stringify(body.info),
            subtotal: Number(body.subtotal),
            total: Number(body.total),
            customer_device_hash: body.customer_device_hash,
            payment_status: 'abandoned',
            payment_provider: 'paypal',
            delivery_status: 'pending',
            delivery_messages: '[]',
            abandoned_cart_processed: false
        };

        console.log('Updating order with data:', orderData);

        // Update order in PocketBase
        const response = await fetch(`${POCKETBASE_URL}/api/collections/store_orders/records/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('PocketBase update error:', error);
            throw createError({
                statusCode: response.status,
                message: error.message || 'Failed to update order'
            });
        }

        const updatedOrder = await response.json();
        console.log('Order updated successfully:', updatedOrder);
        return updatedOrder;
    } catch (error) {
        console.error('Error in update-order handler:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Internal server error'
        });
    }
}
