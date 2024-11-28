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
        console.log(`Collection ${name} does not exist or could not be deleted`);
    }
}

// Function to create admin user
async function createAdminUser() {
    try {
        // First try to create the user
        const response = await fetch(`${BASE_URL}/api/collections/store_users/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify({
                email: 'admin@store.com',
                password: 'admin@store.com',
                passwordConfirm: 'admin@store.com',
                name: 'Admin',
                isAdmin: true,
                username: 'admin'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.log('Failed to create admin user:', error);
            return;
        }

        console.log('Created admin user successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

// Software products data
const SOFTWARE_PRODUCTS = [
    // Adobe Products
    {
        name: 'Adobe Creative Cloud Complete',
        brand: 'Adobe',
        type: 'mac_windows',
        category: 'Creative Suite',
        featured: 1,
        variants: [
            {
                name: 'Monthly Plan',
                description: 'Access to all Adobe creative apps with monthly billing',
                price: 79.99,
                billingCycle: 'monthly',
                discountPercentage: 0,
                features: ['All Creative Cloud apps', 'Adobe Fonts', '100GB cloud storage', 'Adobe Portfolio']
            },
            {
                name: 'Annual Plan (Monthly Billing)',
                description: 'Save 20% with annual commitment, billed monthly',
                price: 59.99,
                originalPrice: 79.99,
                billingCycle: 'monthly',
                discountPercentage: 20,
                features: ['All Creative Cloud apps', 'Adobe Fonts', '100GB cloud storage', 'Adobe Portfolio']
            },
            {
                name: 'Annual Plan (Prepaid)',
                description: 'Save 25% when you pay for a full year upfront',
                price: 599.88,
                originalPrice: 959.88,
                billingCycle: 'annual',
                discountPercentage: 25,
                features: ['All Creative Cloud apps', 'Adobe Fonts', '100GB cloud storage', 'Adobe Portfolio']
            }
        ]
    },
    {
        name: 'Adobe Photoshop',
        brand: 'Adobe',
        type: 'mac_windows',
        category: 'Photo Editing',
        featured: 1,
        variants: [
            {
                name: 'Monthly Plan',
                description: 'Adobe Photoshop with monthly billing',
                price: 31.49,
                billingCycle: 'monthly',
                discountPercentage: 0,
                features: ['Latest Photoshop features', '100GB cloud storage', 'Adobe Fonts', 'iPad version included']
            },
            {
                name: 'Annual Plan',
                description: 'Save 20% with annual commitment',
                price: 239.88,
                originalPrice: 377.88,
                billingCycle: 'annual',
                discountPercentage: 20,
                features: ['Latest Photoshop features', '100GB cloud storage', 'Adobe Fonts', 'iPad version included']
            }
        ]
    },
    // Microsoft Products
    {
        name: 'Microsoft Office 365',
        brand: 'Microsoft',
        type: 'mac_windows',
        category: 'Office Suite',
        featured: 1,
        variants: [
            {
                name: 'Personal (Monthly)',
                description: 'For 1 person, includes premium Office apps',
                price: 6.99,
                billingCycle: 'monthly',
                discountPercentage: 0,
                features: ['Word, Excel, PowerPoint', '1TB OneDrive storage', 'Mobile apps included']
            },
            {
                name: 'Personal (Annual)',
                description: 'Save 16% with annual billing',
                price: 69.99,
                originalPrice: 83.88,
                billingCycle: 'annual',
                discountPercentage: 16,
                features: ['Word, Excel, PowerPoint', '1TB OneDrive storage', 'Mobile apps included']
            },
            {
                name: 'Family (Annual)',
                description: 'For up to 6 people',
                price: 99.99,
                originalPrice: 119.88,
                billingCycle: 'annual',
                discountPercentage: 16,
                features: ['For up to 6 people', '1TB OneDrive storage per person', 'Family safety features']
            }
        ]
    },
    // Apple Products
    {
        name: 'Final Cut Pro',
        brand: 'Apple',
        type: 'mac',
        category: 'Video Editing',
        featured: 1,
        variants: [
            {
                name: 'Perpetual License',
                description: 'One-time purchase, lifetime license',
                price: 299.99,
                billingCycle: 'once',
                discountPercentage: 0,
                features: ['Full version', 'Free updates', 'Mac only']
            },
            {
                name: 'Education Bundle',
                description: 'Special pricing for students and educators',
                price: 199.99,
                originalPrice: 299.99,
                billingCycle: 'once',
                discountPercentage: 33,
                features: ['Full version', 'Free updates', 'Education ID required']
            }
        ]
    }
];

// Function to create collection
async function createCollection() {
    try {
        const productsSchema = {
            name: "store_products",
            type: "base",
            schema: [
                {
                    name: "name",
                    type: "text",
                    required: true,
                    unique: true
                },
                {
                    name: "slug",
                    type: "text",
                    required: true,
                    unique: true
                },
                {
                    name: "brand",
                    type: "text",
                    required: true
                },
                {
                    name: "description",
                    type: "text",
                    required: false
                },
                {
                    name: "type",
                    type: "text",
                    required: true
                },
                {
                    name: "category",
                    type: "text",
                    required: true
                },
                {
                    name: "featured",
                    type: "number",
                    required: true,
                    min: 0,
                    max: 1
                },
                {
                    name: "image",
                    type: "text",
                    required: false
                },
                {
                    name: "images",
                    type: "text",
                    required: false
                },
                {
                    name: "metadata",
                    type: "text",
                    required: false
                },
                {
                    name: "variants",
                    type: "text",
                    required: true
                },
                {
                    name: "isAvailable",
                    type: "number",
                    required: true,
                    min: 0,
                    max: 1,
                    default: "1"
                }
            ],
            listRule: '',
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
            body: JSON.stringify(productsSchema)
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('Failed to create products collection:', data);
            return;
        }

        console.log('Created products collection successfully');
    } catch (error) {
        console.error('Error creating products collection:', error);
    }
}

// Function to create a product
async function createProduct(product) {
    try {
        const slug = product.name.toLowerCase().replace(/\s+/g, '-');
        const basePrice = Math.min(...product.variants.map(v => v.price));
        const maxDiscount = Math.max(...product.variants.map(v => v.discountPercentage || 0));
        
        const metadata = {
            shortDescription: `Professional ${product.category} software by ${product.brand}`,
            longDescription: `${product.name} is a professional-grade ${product.category.toLowerCase()} solution that offers powerful features for ${product.category.toLowerCase()} professionals.`,
            requirements: {
                os: product.type === 'mac' ? 'macOS 11.0 or later' : 
                    product.type === 'windows' ? 'Windows 10 or later' : 
                    'macOS 11.0 or Windows 10 or later',
                processor: 'Modern multi-core processor',
                ram: '8GB RAM minimum',
                storage: '10GB available space'
            },
            highlights: [
                'Professional-grade features',
                'Regular updates and support',
                'Industry-standard compatibility',
                'Cloud integration'
            ],
            keywords: [product.category, product.brand, 'software', 'professional', product.type],
            releaseInfo: {
                version: '2024.1',
                releaseDate: '2024-01-01',
                lastUpdate: new Date().toISOString()
            },
            support: {
                website: `https://www.${product.brand.toLowerCase()}.com/support`,
                email: `support@${product.brand.toLowerCase()}.com`,
                documentation: `https://docs.${product.brand.toLowerCase()}.com/${slug}`
            }
        };

        const productData = {
            name: product.name,
            slug: slug,
            brand: product.brand,
            type: product.type,
            category: product.category,
            featured: product.featured,
            variants: JSON.stringify(product.variants),
            isAvailable: 1,
            metadata: JSON.stringify(metadata),
            images: JSON.stringify([
                'https://placehold.co/600x400',
                'https://placehold.co/600x400/png?text=Features',
                'https://placehold.co/600x400/png?text=Interface'
            ]),
            image: 'https://placehold.co/600x400'
        };

        const response = await fetch(`${BASE_URL}/api/collections/store_products/records`, {
            method: 'POST',
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error(`Failed to create product ${product.name}:`, error);
            return;
        }

        console.log(`Created product ${product.name} successfully`);
    } catch (error) {
        console.error(`Failed to create product ${product.name}:`, error);
    }
}

// Function to create users collection
async function createUsersCollection() {
    try {
        await deleteCollection('store_users');
        console.log('Deleted existing store_users collection');
    } catch (err) {
        console.log('No existing store_users collection found');
    }

    const response = await fetch(`${BASE_URL}/api/collections`, {
        method: 'POST',
        headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'store_users',
            type: 'auth',
            schema: [
                {
                    name: 'name',
                    type: 'text',
                    required: true
                },
                {
                    name: 'isAdmin',
                    type: 'bool'
                }
            ],
            listRule: '',
            viewRule: '',
            createRule: '',
            updateRule: '@request.auth.id = id || @request.auth.isAdmin = true',
            deleteRule: '@request.auth.isAdmin = true',
            options: {
                allowEmailAuth: true,
                allowUsernameAuth: true,
                minPasswordLength: 8,
                requireEmail: true
            }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        console.log('Users collection might already exist:', error);
        return;
    }
    console.log('Created store_users collection');

    // Create admin user
    const adminUser = {
        email: 'admin@store.com',
        password: 'admin@store.com',
        passwordConfirm: 'admin@store.com',
        name: 'Admin',
        username: 'admin',
        isAdmin: true
    };

    try {
        const response = await fetch(`${BASE_URL}/api/collections/store_users/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify(adminUser)
        });

        if (!response.ok) {
            const error = await response.json();
            console.log('Failed to create admin user:', error);
            return;
        }

        console.log('Created admin user successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    }

    // Create regular user
    const regularUser = {
        email: 'user@store.com',
        password: 'user@store.com',
        passwordConfirm: 'user@store.com',
        name: 'Regular User',
        username: 'user',
        isAdmin: false
    };

    try {
        const response = await fetch(`${BASE_URL}/api/collections/store_users/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify(regularUser)
        });

        if (!response.ok) {
            const error = await response.json();
            console.log('Failed to create regular user:', error);
            return;
        }

        console.log('Created regular user successfully');
    } catch (error) {
        console.error('Error creating regular user:', error);
    }
}

// Main setup function
async function setup() {
    if (await authenticate()) {
        // Delete existing collections
        await deleteCollection('store_products');
        await deleteCollection('store_users');
        
        // Create collections
        await createCollection();
        await createUsersCollection();
        
        // Create products
        for (const product of SOFTWARE_PRODUCTS) {
            await createProduct(product);
        }
        
        console.log('Setup completed successfully');
    }
}

setup();
