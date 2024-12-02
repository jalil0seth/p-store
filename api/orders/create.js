// Serverless function to handle order creation and updates
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
            authToken = `Bearer ${data.token}`;
            return true;
        }
        throw new Error('No token in response');
    } catch (error) {
        console.error('Failed to authenticate:', error);
        return false;
    }
}

async function findActiveCart(deviceHash, cartRef) {
    try {
        const response = await fetch(
            `${POCKETBASE_URL}/api/collections/store_orders/records?filter=(customer_device_hash='${deviceHash}' && cart_ref='${cartRef}' && payment_status='abandoned')`,
            {
                headers: {
                    'Authorization': authToken
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch active cart');
        }

        const data = await response.json();
        return data.items?.[0] || null;
    } catch (error) {
        console.error('Error finding active cart:', error);
        return null;
    }
}

function hasOrderChanged(existingOrder, newOrder) {
    if (!existingOrder) return true;

    // Compare items
    const existingItems = JSON.parse(existingOrder.items);
    const newItems = JSON.parse(typeof newOrder.items === 'string' ? newOrder.items : JSON.stringify(newOrder.items));
    
    if (existingItems.length !== newItems.length) return true;
    
    const itemsChanged = existingItems.some((existingItem, index) => {
        const newItem = newItems[index];
        return existingItem.id !== newItem.id ||
               existingItem.variant.id !== newItem.variant.id ||
               existingItem.quantity !== newItem.quantity ||
               existingItem.price !== newItem.price;
    });
    if (itemsChanged) return true;

    // Compare info if both exist
    if (existingOrder.info && newOrder.info) {
        const existingInfo = JSON.parse(existingOrder.info);
        const newInfo = JSON.parse(typeof newOrder.info === 'string' ? newOrder.info : JSON.stringify(newOrder.info));
        
        if (existingInfo.name !== newInfo.name ||
            existingInfo.email !== newInfo.email ||
            existingInfo.whatsapp !== newInfo.whatsapp ||
            existingInfo.discountCode !== newInfo.discountCode) {
            return true;
        }
    } else if ((!existingOrder.info && newOrder.info) || (existingOrder.info && !newOrder.info)) {
        return true;
    }

    // Compare totals
    return existingOrder.subtotal !== newOrder.subtotal || 
           existingOrder.total !== newOrder.total;
}

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Authenticate with PocketBase admin
        const isAuthenticated = await authenticate();
        if (!isAuthenticated) {
            return res.status(500).json({ error: 'Failed to authenticate with PocketBase' });
        }

        const {
            items,
            info,
            subtotal,
            total,
            customer_device_hash,
            cart_ref,
            payment_status = 'abandoned'
        } = req.body;

        // Validate required fields
        if (!items || !customer_device_hash || !cart_ref || subtotal === undefined || total === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate items structure
        try {
            const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
            if (!Array.isArray(parsedItems)) {
                return res.status(400).json({ error: 'Items must be an array' });
            }
            
            // Validate each item has required fields
            for (const item of parsedItems) {
                if (!item.id || !item.name || !item.variant || 
                    !item.variant.id || !item.variant.name || 
                    typeof item.price === 'undefined' || 
                    typeof item.originalPrice === 'undefined' || 
                    typeof item.quantity === 'undefined') {
                    console.error('Invalid item structure:', item);
                    return res.status(400).json({ 
                        error: 'Invalid item structure', 
                        item: item,
                        required: {
                            id: true,
                            name: true,
                            variant: {
                                id: true,
                                name: true
                            },
                            price: true,
                            originalPrice: true,
                            quantity: true
                        }
                    });
                }
            }
        } catch (e) {
            return res.status(400).json({ error: 'Invalid items JSON' });
        }

        // Parse info if provided
        let parsedInfo = null;
        let customerEmail = null;
        if (info) {
            try {
                parsedInfo = typeof info === 'string' ? JSON.parse(info) : info;
                if (!parsedInfo.email) {
                    return res.status(400).json({ error: 'Email is required in info' });
                }
                customerEmail = parsedInfo.email;
            } catch (e) {
                console.error('Error parsing info:', e);
                return res.status(400).json({ error: 'Invalid info JSON' });
            }
        }

        // Find active cart
        const activeCart = await findActiveCart(customer_device_hash, cart_ref);

        // Prepare order data
        const orderData = {
            items: typeof items === 'string' ? items : JSON.stringify(items),
            subtotal: Number(subtotal),
            total: Number(total),
            payment_status,
            customer_device_hash,
            cart_ref
        };

        if (info) {
            orderData.info = typeof info === 'string' ? info : JSON.stringify(info);
            orderData.customer_email = customerEmail;
        }

        let response;
        let createdOrder;

        if (payment_status === 'abandoned') {
            // Only update/create order if there are changes or it's a new cart
            if (!activeCart || hasOrderChanged(activeCart, orderData)) {
                if (activeCart) {
                    // Update existing cart
                    response = await fetch(`${POCKETBASE_URL}/api/collections/store_orders/records/${activeCart.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': authToken
                        },
                        body: JSON.stringify(orderData)
                    });
                } else {
                    // Create new cart
                    orderData.order_number = cart_ref;
                    orderData.payment_provider = 'paypal';
                    orderData.delivery_status = 'pending';
                    orderData.delivery_messages = '[]';
                    orderData.abandoned_cart_processed = false;
                    orderData.recovery_email_sent = '';
                    orderData.refunded_at = null;

                    response = await fetch(`${POCKETBASE_URL}/api/collections/store_orders/records`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': authToken
                        },
                        body: JSON.stringify(orderData)
                    });
                }

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to handle order');
                }

                createdOrder = await response.json();
            } else {
                // No changes, return existing cart
                createdOrder = activeCart;
            }
        } else if (payment_status === 'completed') {
            // Create new completed order
            orderData.order_number = cart_ref;
            orderData.payment_provider = 'paypal';
            orderData.delivery_status = 'pending';
            orderData.delivery_messages = '[]';
            orderData.abandoned_cart_processed = false;
            orderData.recovery_email_sent = '';
            orderData.refunded_at = null;

            response = await fetch(`${POCKETBASE_URL}/api/collections/store_orders/records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create completed order');
            }

            createdOrder = await response.json();

            // Mark active cart as processed if it exists
            if (activeCart) {
                await fetch(`${POCKETBASE_URL}/api/collections/store_orders/records/${activeCart.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken
                    },
                    body: JSON.stringify({
                        abandoned_cart_processed: true
                    })
                });
            }
        }

        return res.status(200).json(createdOrder);
    } catch (error) {
        console.error('Error handling order:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
