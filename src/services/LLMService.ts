import axios from 'axios';

export class LLMService {
    private static instance: LLMService;
    private static API_URL = 'https://api.together.xyz/inference';
    private static API_KEY = import.meta.env.VITE_TOGETHER_API_KEY;

    private constructor() {}

    public static getInstance(): LLMService {
        if (!LLMService.instance) {
            LLMService.instance = new LLMService();
        }
        return LLMService.instance;
    }

    async generateProductContent(userInput: string) {
        const prompt = `You are a professional product content writer for an e-commerce store. Your task is to analyze the given product information and generate detailed, accurate product content.

BRAND DETECTION RULES:
- Known Technology Brands: Apple, Samsung, Sony, Microsoft, Google, Intel, AMD, NVIDIA, Dell, HP, Lenovo, Asus, Acer, LG, Logitech, Corsair, Razer, HyperX, Beats, Bose
- Known Software Brands: Adobe, Microsoft, Autodesk, Oracle, SAP, Salesforce, VMware, Symantec, McAfee, Norton
- If the first word is a recognizable brand name, use it as the brand
- If no clear brand is present, use "Generic" as the brand
- Never generate fake brand names

PRODUCT CATEGORIES:
1. Hardware
   - Computers (Desktop, Laptop, Tablet)
   - Components (CPU, GPU, RAM, Storage)
   - Peripherals (Monitor, Keyboard, Mouse, Headset)
   - Networking (Router, Switch, Access Point)
2. Software
   - Operating Systems
   - Applications (Office, Creative, Development)
   - Security (Antivirus, Firewall)
   - Utilities
3. Gaming
   - Consoles
   - Games
   - Accessories
4. Mobile
   - Smartphones
   - Tablets
   - Accessories
5. Audio/Visual
   - Headphones
   - Speakers
   - Cameras
   - TVs

PRICING GUIDELINES:
- Premium Hardware: $500-$3000
- Standard Hardware: $100-$499
- Budget Hardware: $20-$99
- Premium Software: $299-$999/year
- Standard Software: $49-$299/year
- Budget Software: $0-$49/year
- Discounts: 10-30% off regular price

DESCRIPTION REQUIREMENTS:
1. Overview Paragraph:
   - Product purpose and target audience
   - Key benefits and value proposition
   - Brand positioning and quality tier
2. Features Paragraph:
   - Technical specifications
   - Key features and capabilities
   - Performance metrics
3. Use Cases Paragraph:
   - Practical applications
   - Ideal usage scenarios
   - Comparisons to similar products

Please analyze this product information and generate a detailed product listing:
${userInput}

Respond in this exact JSON format:
{
    "brand": "string (detected brand name or 'Generic')",
    "name": "string (product name without brand)",
    "category": "string (main category)",
    "subcategory": "string (specific subcategory)",
    "regular_price": number,
    "sale_price": number (if applicable, otherwise same as regular_price),
    "short_description": "string (150-200 characters)",
    "detailed_description": "string (formatted in HTML with <p> tags for each paragraph)",
    "pitch": "string (25-35 words compelling sales pitch)",
    "tags": ["array of relevant search tags"],
    "specs": {
        "key technical specifications as key-value pairs"
    }
}`;

        try {
            const response = await axios.post(
                LLMService.API_URL,
                {
                    model: "togethercomputer/llama-2-70b-chat",
                    prompt: prompt,
                    temperature: 0.7,
                    top_p: 0.7,
                    top_k: 50,
                    repetition_penalty: 1,
                    max_tokens: 1500,
                    stop: ["</s>"]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${LLMService.API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data && response.data.output && response.data.output.choices) {
                const generatedText = response.data.output.choices[0].text;
                try {
                    // Find the start of the JSON object
                    const jsonStart = generatedText.indexOf('{');
                    const jsonText = generatedText.slice(jsonStart);
                    return JSON.parse(jsonText);
                } catch (parseError) {
                    console.error('Failed to parse LLM response:', parseError);
                    throw new Error('Invalid response format from LLM');
                }
            }
            throw new Error('Invalid response structure from API');
        } catch (error) {
            console.error('Failed to generate product content:', error);
            throw error;
        }
    }
}

export const llmService = LLMService.getInstance();
