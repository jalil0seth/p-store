import axios from 'axios';

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
        const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const defaultVariants = [
            {
                name: "Basic",
                price: 99,
                original_price: 129,
                slug: `${slugify(productName)}-basic`,
                available: true
            },
            {
                name: "Pro",
                price: 199,
                original_price: 249,
                slug: `${slugify(productName)}-pro`,
                available: true
            },
            {
                name: "Enterprise",
                price: 399,
                original_price: 499,
                slug: `${slugify(productName)}-enterprise`,
                available: true
            }
        ];

        if (!Array.isArray(variants) || variants.length !== 3) {
            return defaultVariants;
        }

        return variants.map((variant, index) => ({
            name: variant.name || defaultVariants[index].name,
            price: Number(variant.price) || defaultVariants[index].price,
            original_price: Number(variant.original_price) || defaultVariants[index].original_price,
            slug: slugify(variant.name ? `${productName}-${variant.name}` : defaultVariants[index].slug),
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

    async generateProductContent(userInput: string): Promise<any> {
        const systemPrompt = `You are a professional product content writer for an e-commerce store. Generate product content in a specific format.

BRAND DETECTION RULES:
- Known Technology Brands: Apple, Samsung, Sony, Microsoft, Google, Intel, AMD, NVIDIA, Dell, HP, Lenovo, Asus, Acer, LG, Logitech
- Known Software Brands: Adobe, Microsoft, Autodesk, Oracle, SAP, Salesforce, VMware, Symantec, McAfee, Norton
- If the first word is a recognizable brand name, use it as the brand
- If no clear brand is present, use "Generic" as the brand

VARIANT STRUCTURE (exactly 3 variants required):
- Basic: Entry-level features, price range $49-$149
- Pro: Advanced features, price range $149-$299
- Enterprise: All features, price range $299-$599

METADATA STRUCTURE:
- Sales pitch: 15-25 words highlighting key value proposition
- Bullet points: Exactly 3 points, each starting with "✓"

IMPORTANT: Respond with a JSON object wrapped in markdown code block, like this:
\`\`\`json
{
    "brand": "string",
    "name": "string",
    ...
}
\`\`\``;

        const userContent = `Generate product content for: ${userInput}

Response must be a valid JSON object with these exact fields:
{
    "brand": "string",
    "name": "string",
    "category": "string",
    "subcategory": "string",
    "variants": [
        {
            "name": "Basic",
            "price": number,
            "original_price": number,
            "slug": "string",
            "available": true
        },
        {
            "name": "Pro",
            "price": number,
            "original_price": number,
            "slug": "string",
            "available": true
        },
        {
            "name": "Enterprise",
            "price": number,
            "original_price": number,
            "slug": "string",
            "available": true
        }
    ],
    "metadata": {
        "sales_pitch": "string",
        "bullet_points": ["string", "string", "string"]
    },
    "short_description": "string",
    "detailed_description": "string",
    "tags": ["string"],
    "specs": {}
}`;

        try {
            const response = await this.makeRequest(systemPrompt, userContent);
            
            // Standardize the response structure
            const parsedContent = {
                ...response,
                variants: this.standardizeVariants(response.name || userInput, response.variants || []),
                metadata: this.standardizeMetadata(response.metadata),
                brand: response.brand || 'Generic',
                name: response.name || userInput,
                category: response.category || 'Software',
                subcategory: response.subcategory || 'Application',
                short_description: response.short_description || `${userInput} - Professional software solution for modern businesses.`,
                detailed_description: response.detailed_description || `<p>${userInput} is a comprehensive software solution designed for modern businesses.</p>`,
                tags: Array.isArray(response.tags) ? response.tags : [response.category || 'Software'],
                specs: response.specs || {}
            };

            return parsedContent;
        } catch (error) {
            console.error('Failed to generate product content:', error);
            throw new Error('Failed to generate product content');
        }
    }
}

export const llmService = LLMService.getInstance();
