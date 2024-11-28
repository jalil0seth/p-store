import LLMService from '../../dist/services/LLMService.js';

const POCKETBASE_URL = 'http://217.76.51.2:8090';

async function main() {
    try {
        // Initialize the LLM service
        const llmService = new LLMService();

        // Update metadata for all products
        await llmService.updateAllProductsMetadata();

        console.log('Successfully updated metadata for all products');
    } catch (error) {
        console.error('Failed to update metadata:', error);
    }
}

main();
