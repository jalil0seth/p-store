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
            await this.ensureAuthenticated();

            const response = await fetch(
                `${PocketBaseService.BASE_URL}/api/collections/store_products/records`,
                {
                    method: 'POST',
                    headers: this.getHeaders(),
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
            await this.ensureAuthenticated();

            const response = await fetch(
                `${PocketBaseService.BASE_URL}/api/collections/store_products/records/${id}`,
                {
                    method: 'PATCH',
                    headers: this.getHeaders(),
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
