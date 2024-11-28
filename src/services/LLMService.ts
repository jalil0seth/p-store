import axios from 'axios';

export const generateId = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const generateVariantId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `VAR-${timestamp}-${randomStr}`.toUpperCase();
};

export class LLMService {
    private static instance: LLMService;
    private static baseUrl = 'https://api.livepolls.app/api';

    private constructor() {}

    public static getInstance(): LLMService {
        if (!LLMService.instance) {
            LLMService.instance = new LLMService();
        }
        return LLMService.instance;
    }

    private standardizeVariants(productName: string, variants: any[]): any[] {
        const defaultVariants = [
            {
                id: generateVariantId(),
                name: "Basic",
                price: 99,
                original_price: 129,
                available: true
            },
            {
                id: generateVariantId(),
                name: "Pro",
                price: 199,
                original_price: 249,
                available: true
            },
            {
                id: generateVariantId(),
                name: "Enterprise",
                price: 399,
                original_price: 499,
                available: true
            }
        ];

        if (!Array.isArray(variants) || variants.length !== 3) {
            return defaultVariants;
        }

        return variants.map((variant, index) => ({
            id: generateVariantId(),
            name: variant.name || defaultVariants[index].name,
            price: Number(variant.price) || defaultVariants[index].price,
            original_price: Number(variant.original_price) || defaultVariants[index].original_price,
            available: true
        }));
    }

    private standardizeMetadata(metadata: any): any {
        const defaultMetadata = {
            sales_pitch: "Transform your workflow with our powerful solution. Boost productivity and streamline operations.",
            bullet_points: [
                "Easy to use and intuitive interface",
                "Seamless integration with existing tools",
                "24/7 customer support and updates"
            ]
        };

        if (!metadata || typeof metadata !== 'object') {
            return defaultMetadata;
        }

        return {
            sales_pitch: metadata.sales_pitch || defaultMetadata.sales_pitch,
            bullet_points: Array.isArray(metadata.bullet_points) && metadata.bullet_points.length > 0
                ? metadata.bullet_points.map((point: string) => 
                    point.startsWith('') ? point : ` ${point}`
                ).slice(0, 3)
                : defaultMetadata.bullet_points
        };
    }

    private extractJsonFromMarkdown(content: string): any {
        try {
            // Remove markdown code block markers and find JSON content
            const jsonMatch = content.replace(/```json\n|\n```/g, '').match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON content found in response');
            }
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error('Failed to extract JSON from markdown:', error);
            throw error;
        }
    }

    private async makeRequest(systemPrompt: string, userContent: string): Promise<any> {
        try {
            const response = await axios.post(`${LLMService.baseUrl}/write-with-role`, {
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userContent }
                ]
            });

            const initialData = response.data;
            const taskId = initialData.task_id;

            // Poll for results
            while (true) {
                const statusResponse = await axios.get(`${LLMService.baseUrl}/async-task-result/${taskId}`);
                const statusData = statusResponse.data;

                if (!(statusData.running ?? false)) {
                    const result = JSON.parse(statusData.result ?? '{}');
                    return this.extractJsonFromMarkdown(result.content);
                }

                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before next poll
            }
        } catch (error) {
            console.error('Error making request:', error);
            throw error;
        }
    }

    async generateProductContent(productName: string): Promise<any> {
        const systemPrompt = `You are a helpful AI that generates product content. Please generate realistic product content based on the product name. The response should be in JSON format and match this schema:
{
    "brand": "string",
    "name": "string",
    "description": "string",
    "type": "string",
    "category": "string",
    "featured": 0,
    "metadata": {
        "sales_pitch": "string",
        "bullet_points": ["string", "string", "string"]
    },
    "variants": [
        {
            "name": "Basic",
            "price": 99,
            "original_price": 129,
            "available": true
        },
        {
            "name": "Pro",
            "price": 199,
            "original_price": 249,
            "available": true
        },
        {
            "name": "Enterprise",
            "price": 399,
            "original_price": 499,
            "available": true
        }
    ]
}`;

        const userContent = `Generate product content for: ${productName}

Please ensure:
1. The content is realistic and detailed
2. The description highlights key features and benefits
3. The prices make sense for the product category
4. The variants follow a good/better/best pricing strategy
5. The metadata includes compelling sales pitch and bullet points`;

        try {
            const response = await this.makeRequest(systemPrompt, userContent);
            
            // Standardize the response and ensure numeric fields
            const standardizedResponse = {
                name: response.name || productName,
                brand: response.brand || '',
                description: response.description || '',
                type: response.type || '',
                category: response.category || '',
                featured: 0, // Always set to 0 for new products
                metadata: JSON.stringify(this.standardizeMetadata(response.metadata)),
                variants: JSON.stringify(this.standardizeVariants(response.name, response.variants || [])),
                isAvailable: 0 // Always set to 0 for new products
            };

            return standardizedResponse;
        } catch (error) {
            console.error('Error generating product content:', error);
            // Return default values if generation fails
            return {
                name: productName,
                brand: '',
                description: '',
                type: '',
                category: '',
                featured: 0,
                metadata: JSON.stringify(this.standardizeMetadata({})),
                variants: JSON.stringify(this.standardizeVariants(productName, [])),
                isAvailable: 0
            };
        }
    }
}

export const llmService = LLMService.getInstance();
