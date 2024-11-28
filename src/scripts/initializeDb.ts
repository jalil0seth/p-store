import { setupCollections } from '../utils/setupCollections';
import { pb, initializeAuth } from '../lib/pocketbase';

export async function initializeDatabase() {
    try {
        console.log('Initializing database...');
        
        // Initialize auth
        const authSuccess = await initializeAuth();
        if (!authSuccess) {
            throw new Error('Failed to initialize auth');
        }

        // Setup collections
        await setupCollections();

        // Add sample products
        const products = [
            {
                name: 'Adobe Creative Cloud',
                description: 'Complete collection of 20+ creative desktop and mobile apps',
                image: 'https://5.imimg.com/data5/SELLER/Default/2023/12/372690413/AN/EO/SN/3538534/adobe-creative-cloud-software-2023-500x500.jpg',
                price: 54.99,
                originalPrice: 79.99,
                discount: 30,
                category: 'Design',
                rating: 4.9,
                reviews: 2547,
                badge: 'Best Seller'
            },
            {
                name: 'AutoCAD 2024',
                description: '2D and 3D CAD design, drafting, modeling, architectural drawing',
                image: 'https://i.etsystatic.com/26517593/r/il/0948ca/6340830501/il_794xN.6340830501_glkw.jpg',
                price: 219.99,
                originalPrice: 299.99,
                discount: 25,
                category: 'Design',
                rating: 4.8,
                reviews: 1823,
                badge: 'Popular'
            },
            {
                name: 'Visual Studio Enterprise',
                description: 'Professional IDE for software development',
                image: 'https://au.softvire.com/wp-content/uploads/sites/17/2023/06/Visual-Studio-Enterprise-Standard-Subscription-Box.jpg',
                price: 45.99,
                originalPrice: 69.99,
                discount: 35,
                category: 'Development',
                rating: 4.9,
                reviews: 1890,
                badge: 'Trending'
            }
        ];

        for (const product of products) {
            try {
                await pb.collection('store_products').create(product);
                console.log(`Created product: ${product.name}`);
            } catch (error) {
                console.error(`Error creating product ${product.name}:`, error);
            }
        }

        console.log('Database initialized successfully');
        return true;
    } catch (error) {
        console.error('Failed to initialize database:', error);
        return false;
    }
}

// Run the initialization
initializeDatabase().catch(console.error);
