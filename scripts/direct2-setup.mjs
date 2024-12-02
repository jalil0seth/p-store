import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function createCollections() {
  try {
    // Store Config Collection
    await pb.collections.create({
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
      ]
    });

    // Store Pages Collection
    await pb.collections.create({
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
          options: {
            pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
          }
        },
        {
          name: 'content',
          type: 'editor',
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
      ]
    });

    // Store Order Collection
    await pb.collections.create({
      name: 'store_orders',
      type: 'base',
      schema: [
        {
          name: 'order_number',
          type: 'text',
          required: true,
          options: {
            pattern: '^[A-Z0-9-]+$'
          }
        },
        {
          name: 'customer_email',
          type: 'email',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          options: {
            values: ['pending', 'paid', 'fulfilled', 'cancelled']
          }
        },
        {
          name: 'items',
          type: 'json',
          required: true,
        },
        {
          name: 'variants',
          type: 'json',
          required: false,
          options: {
            // Example of variants json structure:
            // {
            //   "product_id": "RECORD_ID",
            //   "variant_id": "VARIANT_ID",
            //   "name": "Size",
            //   "value": "XL",
            //   "price_adjustment": 0
            // }
          }
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
          name: 'payment_id',
          type: 'text',
          required: false,
        },
        {
          name: 'payment_provider',
          type: 'select',
          required: true,
          options: {
            values: ['paypal', 'stripe']
          }
        },
        {
          name: 'metadata',
          type: 'json',
          required: false,
        },
        {
          name: 'invoice_id',
          type: 'text',
          required: false,
        },
        {
          name: 'products',
          type: 'relation',
          required: true,
          options: {
            collectionId: 'store_products',
            cascadeDelete: false,
            maxSelect: null,
            minSelect: 1
          }
        }
      ]
    });

    console.log('Collections created successfully!');
  } catch (error) {
    console.error('Error creating collections:', error);
  }
}

// Run the setup
createCollections();
