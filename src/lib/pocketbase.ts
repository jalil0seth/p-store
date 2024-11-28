import PocketBase from 'pocketbase';

// Create PocketBase instance
const POCKETBASE_URL = 'http://217.76.51.2:8090';

// Configure PocketBase instance
export const pb = new PocketBase(POCKETBASE_URL);

// Disable auto-cancellation globally
pb.autoCancellation(false);

// Function to save auth state
const saveAuthState = () => {
    if (pb.authStore.isValid) {
        localStorage.setItem('pocketbase_auth', JSON.stringify({
            token: pb.authStore.token,
            model: pb.authStore.model
        }));
    } else {
        localStorage.removeItem('pocketbase_auth');
    }
};

// Subscribe to auth state changes using the authRefresh event
pb.authStore.onChange(() => {
    saveAuthState();
});

// Load auth state from storage
export const loadAuthState = () => {
    const savedAuth = localStorage.getItem('pocketbase_auth');
    if (savedAuth) {
        try {
            const { token, model } = JSON.parse(savedAuth);
            pb.authStore.save(token, model);
            return model;
        } catch (error) {
            console.error('Failed to load auth state:', error);
            localStorage.removeItem('pocketbase_auth');
            return null;
        }
    }
    return null;
};

// Get current auth model with proper typing
export const getCurrentUser = () => {
    return pb.authStore.model;
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return pb.authStore.isValid && pb.authStore.model !== null;
};

// Check if user is admin
export const isAdmin = () => {
    const user = getCurrentUser();
    return isAuthenticated() && user?.role === 'admin';
};

// Logout user
export const logout = () => {
    pb.authStore.clear();
    localStorage.removeItem('pocketbase_auth');
};

// Initialize auth state
export const initializeAuth = async () => {
    try {
        // Try to load saved auth state
        const user = loadAuthState();
        
        // If we have a saved token, validate it
        if (user && pb.authStore.isValid) {
            try {
                // Verify the token is still valid
                await pb.collection('users').authRefresh();
                return true;
            } catch (error) {
                console.error('Token refresh failed:', error);
                logout();
                return false;
            }
        }
        return false;
    } catch (error) {
        console.error('Failed to initialize auth:', error);
        return false;
    }
};
