export class PocketBaseService {
    private static instance: PocketBaseService;
    private static BASE_URL = 'http://217.76.51.2:8090';
    private token: string = '';
    private isAdmin: boolean = false;
    private currentUser: any = null;
    private pb: any;

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

    private getHeaders(forceAdmin = false) {
        const useAdmin = forceAdmin || this.isAdmin;
        return {
            'Authorization': this.token ? `Bearer ${this.token}` : '',
            'Content-Type': 'application/json'
        };
    }

    private async authenticate() {
        try {
            console.log('Authenticating as admin...');
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

            if (!response.ok) {
                console.error('Admin auth failed:', await response.text());
                throw new Error('Admin auth failed');
            }

            const data = await response.json();
            console.log('Admin auth response:', data);
            if (data.token) {
                this.token = data.token;
                this.isAdmin = true;
                this.saveSession();
                return true;
            }
            throw new Error('No token in response');
        } catch (error) {
            console.error('Failed to authenticate:', error);
            throw error;
        }
    }

    private async ensureAuthenticated(forceAdmin = false) {
        if (!this.token || (forceAdmin && !this.isAdmin)) {
            console.log('Need to authenticate. Current state:', { 
                hasToken: !!this.token, 
                isAdmin: this.isAdmin, 
                forceAdmin 
            });
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
                throw new Error('Failed to fetch product');
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch product:', error);
            throw error;
        }
    }

    async createProduct(data: any) {
        try {
            await this.ensureAuthenticated(true);
            
            const response = await fetch(
                `${PocketBaseService.BASE_URL}/api/collections/store_products/records`,
                {
                    method: 'POST',
                    headers: this.getHeaders(true),
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) {
                throw new Error('Failed to create product');
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to create product:', error);
            throw error;
        }
    }

    async updateProduct(id: string, data: any) {
        try {
            await this.ensureAuthenticated(true);
            
            const response = await fetch(
                `${PocketBaseService.BASE_URL}/api/collections/store_products/records/${id}`,
                {
                    method: 'PATCH',
                    headers: this.getHeaders(true),
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to update product:', error);
            throw error;
        }
    }

    async deleteProduct(id: string) {
        try {
            await this.ensureAuthenticated(true);
            
            const response = await fetch(
                `${PocketBaseService.BASE_URL}/api/collections/store_products/records/${id}`,
                {
                    method: 'DELETE',
                    headers: this.getHeaders(true)
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            return true;
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

    async getOrders() {
        console.log('PocketBaseService: Getting orders with admin auth');
        try {
            await this.ensureAuthenticated(true);
            console.log('PocketBaseService: Admin auth status:', this.isAdmin);
            console.log('PocketBaseService: Token:', this.token);
            
            const headers = this.getHeaders(true);
            console.log('PocketBaseService: Request headers:', headers);
            
            const url = `${PocketBaseService.BASE_URL}/api/collections/store_orders/records?sort=-created`;
            console.log('PocketBaseService: Fetching from URL:', url);
            
            const response = await fetch(url, { headers });

            console.log('PocketBaseService: Response status:', response.status);
            const responseText = await response.text();
            console.log('PocketBaseService: Response text:', responseText);

            if (!response.ok) {
                console.error('Failed to fetch orders:', responseText);
                throw new Error('Failed to fetch orders');
            }

            const data = JSON.parse(responseText);
            console.log('PocketBaseService: Successfully parsed orders:', data);
            return data.items || [];
        } catch (error) {
            console.error('PocketBaseService: Error fetching orders:', error);
            throw error;
        }
    }

    async updateOrder(id: string, updates: any) {
        console.log('PocketBaseService: Updating order:', id, updates);
        try {
            await this.ensureAuthenticated(true);
            
            const updateData = { ...updates };
            if (updates.items && typeof updates.items !== 'string') {
                updateData.items = JSON.stringify(updates.items);
            }
            if (updates.shipping_address && typeof updates.shipping_address !== 'string') {
                updateData.shipping_address = JSON.stringify(updates.shipping_address);
            }

            const response = await fetch(
                `${PocketBaseService.BASE_URL}/api/collections/store_orders/records/${id}`,
                {
                    method: 'PATCH',
                    headers: this.getHeaders(true),
                    body: JSON.stringify(updateData)
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update order');
            }

            const record = await response.json();
            console.log('PocketBaseService: Successfully updated order:', record);
            return record;
        } catch (error) {
            console.error('PocketBaseService: Error updating order:', error);
            throw error;
        }
    }
}

export const pocketBaseService = PocketBaseService.getInstance();
