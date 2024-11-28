export class PocketBaseService {
    private static instance: PocketBaseService;
    private static BASE_URL = 'http://217.76.51.2:8090';
    private token: string = '';
    private isAdmin: boolean = false;
    private currentUser: any = null;
    
    private constructor() {
        this.loadSession();
    }

    public static getInstance(): PocketBaseService {
        if (!PocketBaseService.instance) {
            PocketBaseService.instance = new PocketBaseService();
        }
        return PocketBaseService.instance;
    }

    private loadSession() {
        const savedToken = localStorage.getItem('pb_token');
        const savedUser = localStorage.getItem('pb_user');
        const savedIsAdmin = localStorage.getItem('pb_is_admin');

        if (savedToken) {
            this.token = savedToken;
            this.isAdmin = savedIsAdmin === 'true';
            this.currentUser = savedUser ? JSON.parse(savedUser) : null;
        }
    }

    private saveSession() {
        if (this.token) {
            localStorage.setItem('pb_token', this.token);
            localStorage.setItem('pb_is_admin', String(this.isAdmin));
            if (this.currentUser) {
                localStorage.setItem('pb_user', JSON.stringify(this.currentUser));
            }
        } else {
            localStorage.removeItem('pb_token');
            localStorage.removeItem('pb_is_admin');
            localStorage.removeItem('pb_user');
        }
    }

    private getHeaders() {
        return {
            'Authorization': this.token ? `${this.isAdmin ? 'Admin' : 'Bearer'} ${this.token}` : '',
            'Content-Type': 'application/json'
        };
    }

    private async authenticate() {
        try {
            const response = await fetch(`${PocketBaseService.BASE_URL}/api/admins/auth-with-password`, {
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
                this.token = data.token;
                this.isAdmin = true;
                this.saveSession();
                return true;
            }
            throw new Error('No token in response');
        } catch (error) {
            console.error('Failed to authenticate:', error);
            return false;
        }
    }

    private async ensureAuthenticated() {
        if (!this.token) {
            await this.authenticate();
        }
    }

    async login(email: string, password: string) {
        try {
            const response = await fetch(`${PocketBaseService.BASE_URL}/api/collections/store_users/auth-with-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identity: email,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            if (data.token) {
                this.token = data.token;
                this.isAdmin = false;
                this.currentUser = data.record;
                this.saveSession();
                return data;
            }
            throw new Error('No token in response');
        } catch (error) {
            console.error('Failed to login:', error);
            throw error;
        }
    }

    async register(userData: { email: string; password: string; passwordConfirm: string; name: string }) {
        try {
            const response = await fetch(`${PocketBaseService.BASE_URL}/api/collections/store_users/records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to register:', error);
            throw error;
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    async refreshCurrentUser() {
        if (!this.token || !this.currentUser?.id) return null;

        try {
            const response = await fetch(
                `${PocketBaseService.BASE_URL}/api/collections/store_users/records/${this.currentUser.id}`,
                { headers: this.getHeaders() }
            );

            if (!response.ok) {
                throw new Error('Failed to refresh user');
            }

            const data = await response.json();
            this.currentUser = data;
            this.saveSession();
            return data;
        } catch (error) {
            console.error('Failed to refresh user:', error);
            this.logout();
            return null;
        }
    }

    async getProducts(filter = '') {
        try {
            await this.ensureAuthenticated();
            
            const response = await fetch(
                `${PocketBaseService.BASE_URL}/api/collections/store_products/records?filter=${filter}`,
                { headers: this.getHeaders() }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            return data.items;
        } catch (error) {
            console.error('Failed to fetch products:', error);
            throw error;
        }
    }

    async getProduct(id: string) {
        try {
            await this.ensureAuthenticated();

            const response = await fetch(
                `${PocketBaseService.BASE_URL}/api/collections/store_products/records/${id}`,
                { headers: this.getHeaders() }
            );

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`Failed to fetch product: ${JSON.stringify(errorData)}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch product:', error);
            throw error;
        }
    }

    async createProduct(data: any) {
        try {
            // For new products, always set featured and isAvailable to 0
            const requestData = {
                ...data,
                featured: 0,
                isAvailable: 0
            };

            console.log('Creating product with data:', requestData);

            const response = await fetch(
                `${PocketBaseService.BASE_URL}/api/collections/store_products/records`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                console.error('Full error data:', JSON.stringify(errorData, null, 2));
                throw new Error(errorData.message || 'Failed to create product');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in createProduct:', error);
            throw error;
        }
    }

    async updateProduct(id: string, data: any) {
        try {
            await this.ensureAuthenticated();

            // First verify the product exists
            const product = await this.getProduct(id);
            if (!product) {
                throw new Error(`Product with ID ${id} not found`);
            }

            // Validate required fields
            const requiredFields = ['name', 'brand', 'category', 'type', 'featured', 'isAvailable'];
            console.log('Data received in updateProduct:', data);
            console.log('Featured value:', data.featured, typeof data.featured);
            const missingFields = requiredFields.filter(field => {
                const value = data[field];
                console.log(`Field ${field}:`, value, typeof value);
                return value === undefined || value === null;
            });
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // Convert boolean values to integers and clean the data
            const cleanData = {
                ...data,
                isAvailable: Number(data.isAvailable || 0), // Default to 0 if undefined
                featured: Number(data.featured || 0), // Default to 0 if undefined
                variants: typeof data.variants === 'string' ? data.variants : JSON.stringify(data.variants || []),
                metadata: typeof data.metadata === 'string' ? data.metadata : JSON.stringify(data.metadata || {}),
                images: typeof data.images === 'string' ? data.images : JSON.stringify(data.images || [])
            };

            console.log('Clean data being sent to API:', cleanData);
            console.log('Featured value in cleanData:', cleanData.featured, typeof cleanData.featured);
            console.log('Full request payload:', JSON.stringify(cleanData, null, 2));

            // Validate against schema requirements
            if (cleanData.featured === undefined || cleanData.featured === null || 
                cleanData.featured < 0 || cleanData.featured > 1) {
                throw new Error('Featured must be a number between 0 and 1');
            }

            console.log('Request data with schema validation:', cleanData);
            console.log('Featured value type:', typeof cleanData.featured);

            const response = await fetch(
                `${PocketBaseService.BASE_URL}/api/collections/store_products/records/${id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cleanData)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                console.error('Full error data:', JSON.stringify(errorData, null, 2));
                
                // If there are specific field validation errors, include them in the error message
                if (errorData.data) {
                    const fieldErrors = Object.entries(errorData.data)
                        .map(([field, error]) => `${field}: ${error}`)
                        .join(', ');
                    throw new Error(`Validation error: ${fieldErrors}`);
                }
                
                if (response.status === 404) {
                    throw new Error(`Product with ID ${id} not found`);
                }
                throw new Error(errorData.message || 'Failed to update product');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in updateProduct:', error);
            throw error;
        }
    }

    async deleteProduct(id: string) {
        try {
            await this.ensureAuthenticated();

            const response = await fetch(
                `${PocketBaseService.BASE_URL}/api/collections/store_products/records/${id}`,
                {
                    method: 'DELETE',
                    headers: this.getHeaders()
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
            throw error;
        }
    }

    isAuthenticated() {
        return !!this.token;
    }

    isAdminAuthenticated() {
        return this.isAdmin && !!this.token;
    }

    logout() {
        this.token = '';
        this.isAdmin = false;
        this.currentUser = null;
        this.saveSession();
    }
}

export const pocketBaseService = PocketBaseService.getInstance();
