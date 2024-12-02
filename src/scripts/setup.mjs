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
        console.log('Authentication successful');
        return data;
    } catch (error) {
        console.error('Authentication error:', error);
        throw error;
    }
}

async function createStoreOrdersCollection() {
    try {
        const schema = {
            name: 'store_orders',
            type: 'base',
            schema: [
                {
                    name: 'order_number',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'customer_email',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'customer_device_hash',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'items',
                    type: 'json',
                    required: true,
                },
                {
                    name: 'info',
                    type: 'json',
                    required: true,
                },
                {
                    name: 'subtotal',
                    type: 'number',
                    required: true,
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'total',
                    type: 'number',
                    required: true,
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'payment_status',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'payment_provider',
                    type: 'text',
                    required: false,
                },
                {
                    name: 'delivery_status',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'delivery_messages',
                    type: 'json',
                    required: false,
                },
                {
                    name: 'abandoned_cart_processed',
                    type: 'bool',
                    required: false,
                    options: {
                        default: false
                    }
                },
                {
                    name: 'recovery_email_sent',
                    type: 'text',
                    required: false,
                },
                {
                    name: 'refunded_at',
                    type: 'date',
                    required: false,
                }
            ],
            listRule: "@request.auth.type = 'admin'",
            viewRule: "@request.auth.type = 'admin' || (@request.auth.id != '' && customer_email = @request.auth.email)",
            createRule: "@request.auth.id != ''",
            updateRule: "@request.auth.type = 'admin'",
            deleteRule: "@request.auth.type = 'admin'"
        };

        const response = await fetch(`${POCKETBASE_URL}/api/collections`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(schema)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to create store_orders collection: ${JSON.stringify(errorData)}`);
        }

        console.log('Created store_orders collection successfully');
    } catch (error) {
        console.error('Error creating store_orders collection:', error);
        throw error;
    }
}

async function setup() {
    try {
        await authenticate();
        await createStoreOrdersCollection();
        console.log('Setup completed successfully');
    } catch (error) {
        console.error('Setup failed:', error);
    }
}

// Run the setup
setup();
