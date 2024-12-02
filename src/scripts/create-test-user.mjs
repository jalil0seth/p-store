import PocketBase from 'pocketbase';

const POCKETBASE_URL = 'http://217.76.51.2:8090';
const pb = new PocketBase(POCKETBASE_URL);

async function createTestUser() {
    try {
        const userData = {
            email: 'test@example.com',
            password: 'testpassword123',
            passwordConfirm: 'testpassword123',
            name: 'Test User',
            isAdmin: false
        };

        console.log('Creating user with data:', userData);
        const response = await pb.collection('store_users').create(userData);
        console.log('User created successfully:', response);
    } catch (error) {
        console.error('Error:', error);
        if (error.response) {
            console.error('Error details:', error.response.data);
        }
    }
}

createTestUser();
