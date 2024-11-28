import axios from 'axios';

function generateId(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
                id: generateId(),
                name: "Basic",
                price: 99,
                original_price: 129,
                available: true
            },
            {
                id: generateId(),
                name: "Pro",
                price: 199,
                original_price: 249,
                available: true
            },
            {
                id: generateId(),
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
            id: generateId(),
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
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userContent
                    }
                ]
            });

            const initialData = response.data;
            const taskId = initialData.task_id;

            while (true) {
                const statusResponse = await axios.get(`${LLMService.baseUrl}/async-task-result/${taskId}`);
                const statusData = statusResponse.data;

                if (!(statusData.running ?? false)) {
                    const result = JSON.parse(statusData.result);
                    return this.extractJsonFromMarkdown(result.content);
                }

                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error('API request failed:', error);
            throw new Error('Failed to generate content');
        }
    }

    async generateProductContent(productName: string): Promise<any> {
        const systemPrompt = `You are a helpful AI that generates product content. Please generate realistic product content based on the product name. The response should be in JSON format and match this schema:
\`\`\`json
{
    "brand": "string",
    "name": "string",
    "description": "string",
    "type": "string",
    "category": "string",
    "featured": false,
    "metadata": {
        "sales_pitch": "string",
        "bullet_points": ["string", "string", "string"]
    },
    "variants": [
        {
            "name": "Basic",
            "price": number,
            "original_price": number,
            "available": true,
            "id": "string"
        },
        {
            "name": "Pro",
            "price": number,
            "original_price": number,
            "available": true,
            "id": "string"
        },
        {
            "name": "Enterprise",
            "price": number,
            "original_price": number,
            "available": true,
            "id": "string"
        }
    ]
}`;

        const userContent = `Generate product content for: ${productName}

Please ensure the content is realistic and the prices make sense for the product category. The variants should follow a good/better/best pricing strategy.`;

        try {
            const response = await this.makeRequest(systemPrompt, userContent);
            
            // Process the response
            return {
                name: response.name,
                brand: response.brand,
                description: response.description,
                type: response.type,
                category: response.category,
                featured: response.featured || false,
                metadata: JSON.stringify({
                    sales_pitch: response.metadata?.sales_pitch || "",
                    bullet_points: response.metadata?.bullet_points || []
                }),
                variants: JSON.stringify(this.standardizeVariants(response.name, response.variants || [])),
                isAvailable: true
            };
        } catch (error) {
            console.error('Error generating product content:', error);
            throw error;
        }
    }
}

export const llmService = LLMService.getInstance();
