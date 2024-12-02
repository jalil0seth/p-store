import fetch from 'node-fetch';

const POCKETBASE_URL = 'http://217.76.51.2:8090';
const ADMIN_EMAIL = 'fc96b2ce-c8f9-4a77-a323-077f92f176ac@admin.com';
const ADMIN_PASSWORD = 'fc96b2ce-c8f9-4a77-a323-077f92f176ac';
let authToken = '';

async function authenticate() {
    const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            identity: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        })
    });

    if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    authToken = data.token;
    return data;
}

async function createTestOrder() {
    try {
        // First authenticate
        const authData = await authenticate();
        console.log('Authenticated successfully:', authData);
        
        const orderData = {
            order_number: `ORD-TEST-${Date.now()}`,
            customer_email: 'jalilosum@gmail.com',
            items: JSON.stringify([
                {
                    id: '113g0npfjtdgw9a',
                    name: 'All-in-One Digital Planner 2024-2026',
                    variant: {
                        id: 'pro',
                        name: 'Pro'
                    },
                    price: 49,
                    originalPrice: 59,
                    quantity: 1
                },
                {
                    id: '113g0npfjtdgw9a',
                    name: 'All-in-One Digital Planner 2024-2026',
                    variant: {
                        id: 'basic',
                        name: 'Basic'
                    },
                    price: 29,
                    originalPrice: 39,
                    quantity: 1
                }
            ]),
            info: JSON.stringify({
                name: 'Seth Jalil',
                whatsapp: '',
                discountCode: ''
            }),
            subtotal: 177,
            total: 177,
            customer_device_hash: 'device-xvxog2184v',
            payment_status: 'abandoned',
            payment_provider: 'paypal',
            delivery_status: 'pending',
            delivery_messages: '[]',
            abandoned_cart_processed: false,
            recovery_email_sent: '',
            refunded_at: null
        };

        console.log('Creating order with data:', orderData);
        const createResponse = await fetch(`${POCKETBASE_URL}/api/collections/store_orders/records`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!createResponse.ok) {
            const errorData = await createResponse.json();
            throw new Error(`Failed to create order: ${JSON.stringify(errorData)}`);
        }

        const response = await createResponse.json();
        console.log('Order created successfully:', response);

        // Now test updating the order
        const updateData = {
            items: JSON.stringify([
                {
                    id: '113g0npfjtdgw9a',
                    name: 'All-in-One Digital Planner 2024-2026',
                    variant: {
                        id: 'pro',
                        name: 'Pro'
                    },
                    price: 49,
                    originalPrice: 59,
                    quantity: 2  // Changed quantity
                }
            ]),
            info: JSON.stringify({
                name: 'Seth Jalil',
                whatsapp: '+1234567890',  // Added whatsapp
                discountCode: 'TEST10'    // Added discount code
            }),
            subtotal: 98,  // Updated for new quantity
            total: 98
        };

        console.log('Updating order with data:', updateData);
        const updateResponse = await fetch(`${POCKETBASE_URL}/api/collections/store_orders/records/${response.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(`Failed to update order: ${JSON.stringify(errorData)}`);
        }

        const updatedResponse = await updateResponse.json();
        console.log('Order updated successfully:', updatedResponse);
    } catch (error) {
        console.error('Error:', error);
    }
}

createTestOrder();
