import fetch from 'node-fetch';

const BASE_URL = 'http://217.76.51.2:8090';
let authToken = '';

async function authenticate() {
    try {
        const response = await fetch(`${BASE_URL}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identity: 'fc96b2ce-c8f9-4a77-a323-077f92f176ac@admin.com',
                password: 'fc96b2ce-c8f9-4a77-a323-077f92f176ac'
            })
        });

        const data = await response.json();
        if (data.token) {
            authToken = data.token;
            console.log('Successfully authenticated as admin');
            return true;
        }
        throw new Error('No token in response');
    } catch (error) {
        console.error('Failed to authenticate:', error);
        return false;
    }
}

// Function to generate slug from name
function generateSlug(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Function to delete collection
async function deleteCollection(name) {
    try {
        const response = await fetch(`${BASE_URL}/api/collections/${name}`, {
            method: 'DELETE',
            headers: {
                'Authorization': authToken
            }
        });
        if (response.ok) {
            console.log(`Deleted collection ${name}`);
        }
    } catch (error) {
        console.error(`Error deleting collection ${name}:`, error);
    }
}

async function createStoreConfigCollection() {
    try {
        const schema = {
            name: 'store_config',
            type: 'base',
            schema: [
                {
                    name: 'store_name',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'store_logo',
                    type: 'file',
                    required: false,
                    options: {
                        maxSelect: 1,
                        maxSize: 5242880,
                        mimeTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/gif'],
                    }
                },
                {
                    name: 'currency',
                    type: 'text',
                    required: true,
                    options: {
                        maxLength: 3
                    }
                },
                {
                    name: 'facebook_pixel',
                    type: 'text',
                    required: false,
                },
                {
                    name: 'google_analytics',
                    type: 'text',
                    required: false,
                },
                {
                    name: 'tiktok_pixel',
                    type: 'text',
                    required: false,
                }
            ],
            listRule: '@request.auth.isAdmin = true',
            viewRule: '',
            createRule: '@request.auth.isAdmin = true',
            updateRule: '@request.auth.isAdmin = true',
            deleteRule: '@request.auth.isAdmin = true'
        };

        const response = await fetch(`${BASE_URL}/api/collections`, {
            method: 'POST',
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(schema)
        });

        if (!response.ok) {
            throw new Error('Failed to create store_config collection');
        }

        console.log('Created store_config collection successfully');
    } catch (error) {
        console.error('Error creating store_config collection:', error);
    }
}

async function createStorePagesCollection() {
    try {
        const schema = {
            name: 'store_pages',
            type: 'base',
            schema: [
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'slug',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'content',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'is_published',
                    type: 'bool',
                    required: true,
                },
                {
                    name: 'meta_title',
                    type: 'text',
                    required: false,
                },
                {
                    name: 'meta_description',
                    type: 'text',
                    required: false,
                }
            ],
            listRule: '',
            viewRule: '@request.auth.isAdmin = true || is_published = true',
            createRule: '@request.auth.isAdmin = true',
            updateRule: '@request.auth.isAdmin = true',
            deleteRule: '@request.auth.isAdmin = true'
        };

        const response = await fetch(`${BASE_URL}/api/collections`, {
            method: 'POST',
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(schema)
        });

        if (!response.ok) {
            throw new Error('Failed to create store_pages collection');
        }

        console.log('Created store_pages collection successfully');
    } catch (error) {
        console.error('Error creating store_pages collection:', error);
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
                    type: 'text',
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
                    name: 'payment_metadata',
                    type: 'text', // JSON string containing payment provider, invoice ID, etc.
                    required: false,
                },
                {
                    name: 'delivery_status',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'delivery_messages',
                    type: 'text', // JSON array of delivery messages with timestamps
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
                    name: 'recovery_coupon',
                    type: 'text',
                    required: false,
                }
            ],
            listRule: "@request.auth.type = 'admin'",
            viewRule: "@request.auth.type = 'admin' || (@request.auth.id != '' && customer_email = @request.auth.email)",
            createRule: "@request.auth.id != ''",
            updateRule: "@request.auth.type = 'admin'",
            deleteRule: "@request.auth.type = 'admin'"
        };

        const response = await fetch(`${BASE_URL}/api/collections`, {
            method: 'POST',
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(schema)
        });

        if (!response.ok) {
            throw new Error('Failed to create store_orders collection');
        }

        console.log('Created store_orders collection successfully');
    } catch (error) {
        console.error('Error creating store_orders collection:', error);
    }
}

async function createSamplePages() {
    try {
        const samplePages = [
            {
                title: 'About Us',
                slug: 'about-us',
                content: `# About Our Store

We are a passionate team dedicated to providing high-quality products and exceptional customer service. Our journey began with a simple idea: to create a shopping experience that combines convenience with quality.

## Our Mission

To deliver outstanding products while maintaining the highest standards of customer satisfaction and service excellence.

## Our Values

- Quality First
- Customer Satisfaction
- Transparency
- Innovation`,
                is_published: true,
                meta_title: 'About Us - Your Trusted Online Store',
                meta_description: 'Learn about our story, mission, and commitment to providing quality products and exceptional service.'
            },
            {
                title: 'Privacy Policy',
                slug: 'privacy-policy',
                content: `# Privacy Policy

Last updated: ${new Date().toISOString().split('T')[0]}

## Information We Collect

We collect information that you provide directly to us, including:
- Name and contact information
- Order and transaction data
- Communication preferences

## How We Use Your Information

We use the information we collect to:
- Process your orders
- Send order confirmations
- Improve our services
- Communicate with you about products and updates`,
                is_published: true,
                meta_title: 'Privacy Policy - Your Data Security Matters',
                meta_description: 'Our commitment to protecting your privacy and how we handle your personal information.'
            },
            {
                title: 'Terms of Service',
                slug: 'terms-of-service',
                content: `# Terms of Service

## 1. Agreement to Terms

By accessing our website, you agree to these Terms of Service and to follow all applicable laws and regulations.

## 2. Products and Services

We strive to provide accurate product descriptions and pricing. However, we reserve the right to modify or discontinue products without notice.

## 3. Orders and Payments

All orders are subject to acceptance and availability. We reserve the right to refuse service to anyone.`,
                is_published: true,
                meta_title: 'Terms of Service - Our Policies',
                meta_description: 'Read our terms of service to understand your rights and responsibilities when using our store.'
            }
        ];

        for (const page of samplePages) {
            const response = await fetch(`${BASE_URL}/api/collections/store_pages/records`, {
                method: 'POST',
                headers: {
                    'Authorization': authToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(page)
            });

            if (!response.ok) {
                throw new Error(`Failed to create page: ${page.title}`);
            }
        }

        console.log('Created sample pages successfully');
    } catch (error) {
        console.error('Error creating sample pages:', error);
    }
}

async function createSampleOrders() {
    try {
        const sampleOrders = [
            {
                order_number: 'ORD-2024-001',
                customer_email: 'john.doe@example.com',
                customer_device_hash: 'hash123', // This would be generated from user's device info
                items: JSON.stringify([
                    {
                        product_id: '1',
                        title: 'Premium Software License',
                        quantity: 1,
                        price: 99.99,
                        delivery_type: 'license_key',
                        delivery_content: 'XXXX-YYYY-ZZZZ' // This would be the actual license key
                    }
                ]),
                subtotal: 99.99,
                total: 99.99,
                payment_status: 'completed',
                payment_metadata: JSON.stringify({
                    provider: 'stripe',
                    invoice_id: 'inv_123456',
                    transaction_id: 'tx_789012',
                    payment_date: '2024-01-15T10:30:00Z'
                }),
                delivery_status: 'delivered',
                delivery_messages: JSON.stringify([
                    {
                        timestamp: '2024-01-15T10:31:00Z',
                        message: 'License key generated and sent to email',
                        status: 'delivered'
                    }
                ])
            },
            {
                order_number: 'ORD-2024-002',
                customer_email: 'jane.smith@example.com',
                customer_device_hash: 'hash456',
                items: JSON.stringify([
                    {
                        product_id: '2',
                        title: 'Cloud Storage Subscription',
                        quantity: 1,
                        price: 19.99,
                        delivery_type: 'subscription',
                        delivery_content: 'sub_xyz789' // Subscription ID
                    }
                ]),
                subtotal: 19.99,
                total: 19.99,
                payment_status: 'pending',
                payment_metadata: null,
                delivery_status: 'pending',
                delivery_messages: JSON.stringify([
                    {
                        timestamp: '2024-01-16T15:00:00Z',
                        message: 'Awaiting payment confirmation',
                        status: 'pending'
                    }
                ])
            },
            {
                order_number: 'ORD-2024-003',
                customer_email: 'alice.j@example.com',
                customer_device_hash: 'hash789',
                items: JSON.stringify([
                    {
                        product_id: '3',
                        title: 'Digital Course Access',
                        quantity: 1,
                        price: 149.99,
                        delivery_type: 'course_access',
                        delivery_content: null
                    }
                ]),
                subtotal: 149.99,
                total: 149.99,
                payment_status: 'abandoned',
                payment_metadata: null,
                delivery_status: 'pending',
                delivery_messages: null,
                abandoned_cart_processed: true,
                recovery_coupon: 'COMEBACK20'
            }
        ];

        for (const order of sampleOrders) {
            const response = await fetch(`${BASE_URL}/api/collections/store_orders/records`, {
                method: 'POST',
                headers: {
                    'Authorization': authToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Failed to create order ${order.order_number}: ${JSON.stringify(error)}`);
            }
        }

        console.log('Created sample orders successfully');
    } catch (error) {
        console.error('Error creating sample orders:', error);
    }
}

async function setup() {
    try {
        const isAuthenticated = await authenticate();
        if (!isAuthenticated) {
            throw new Error('Failed to authenticate');
        }

        // Delete existing collections if they exist
        await deleteCollection('store_config');
        await deleteCollection('store_pages');
        await deleteCollection('store_orders');

        // Create collections
        await createStoreConfigCollection();
        await createStorePagesCollection();
        await createStoreOrdersCollection();

        // Create sample data
        await createSamplePages();
        await createSampleOrders();

        console.log('Setup completed successfully!');
    } catch (error) {
        console.error('Setup failed:', error);
    }
}

// Run the setup
setup();
