import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PocketBaseService } from '@/services/PocketBaseService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductVariant {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    billingCycle: 'monthly' | 'annual' | 'once';
    discountPercentage: number;
    features: string[];
}

interface Product {
    id: string;
    name: string;
    slug: string;
    brand: string;
    category: string;
    featured: boolean;
    metadata: {
        shortDescription: string;
        longDescription: string;
        requirements: {
            os: string;
            processor: string;
            ram: string;
            storage: string;
        };
        highlights: string[];
        support: {
            website: string;
            email: string;
            documentation: string;
        };
    };
    variants: ProductVariant[];
    images: string[];
    image: string;
    isAvailable: boolean;
}

export default function ProductDetail() {
    const router = useRouter();
    const { slug } = router.query;
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            if (!slug) return;

            try {
                const pb = PocketBaseService.getInstance();
                const productData = await pb.getProductBySlug(slug as string);
                
                if (!productData) {
                    router.push('/404');
                    return;
                }

                // Parse metadata and variants from JSON strings
                const processedProduct = {
                    ...productData,
                    metadata: typeof productData.metadata === 'string' ? JSON.parse(productData.metadata) : productData.metadata,
                    variants: typeof productData.variants === 'string' ? JSON.parse(productData.variants) : productData.variants,
                    images: typeof productData.images === 'string' ? JSON.parse(productData.images) : productData.images
                };

                setProduct(processedProduct);
                if (processedProduct.variants.length > 0) {
                    setSelectedVariant(processedProduct.variants[0]);
                }
            } catch (error) {
                console.error('Error loading product:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [slug, router]);

    if (loading || !product) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="aspect-video relative">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${product.name} ${index + 1}`}
                                className="w-full aspect-video object-cover rounded cursor-pointer"
                                onClick={() => {
                                    const newProduct = { ...product, image: img };
                                    setProduct(newProduct);
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-lg text-gray-600 mb-4">{product.brand}</p>
                    <p className="mb-4">{product.metadata.shortDescription}</p>

                    {/* Variants */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Available Plans</h3>
                        <div className="grid gap-4">
                            {product.variants.map((variant) => (
                                <Card
                                    key={variant.name}
                                    className={`p-4 cursor-pointer transition-all ${
                                        selectedVariant?.name === variant.name
                                            ? 'ring-2 ring-primary'
                                            : 'hover:shadow-md'
                                    }`}
                                    onClick={() => setSelectedVariant(variant)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold">{variant.name}</h4>
                                            <p className="text-sm text-gray-600">{variant.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">
                                                ${variant.price.toFixed(2)}
                                                {variant.billingCycle !== 'once' && (
                                                    <span className="text-sm font-normal">
                                                        /{variant.billingCycle}
                                                    </span>
                                                )}
                                            </p>
                                            {variant.originalPrice && (
                                                <p className="text-sm text-gray-500 line-through">
                                                    ${variant.originalPrice.toFixed(2)}
                                                </p>
                                            )}
                                            {variant.discountPercentage > 0 && (
                                                <p className="text-sm text-green-600">
                                                    Save {variant.discountPercentage}%
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <ul className="mt-4 space-y-2">
                                        {variant.features.map((feature, index) => (
                                            <li key={index} className="text-sm flex items-center">
                                                <svg
                                                    className="w-4 h-4 mr-2 text-green-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <Button className="w-full" size="lg" disabled={!selectedVariant}>
                        {selectedVariant ? `Buy Now - $${selectedVariant.price.toFixed(2)}` : 'Select a plan'}
                    </Button>
                </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-12">
                <Tabs defaultValue="details">
                    <TabsList>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="requirements">Requirements</TabsTrigger>
                        <TabsTrigger value="support">Support</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="mt-4">
                        <Card className="p-6">
                            <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                            <p className="mb-4">{product.metadata.longDescription}</p>
                            <h4 className="font-semibold mb-2">Highlights</h4>
                            <ul className="list-disc pl-6 space-y-2">
                                {product.metadata.highlights.map((highlight, index) => (
                                    <li key={index}>{highlight}</li>
                                ))}
                            </ul>
                        </Card>
                    </TabsContent>

                    <TabsContent value="requirements" className="mt-4">
                        <Card className="p-6">
                            <h3 className="text-xl font-semibold mb-4">System Requirements</h3>
                            <div className="grid gap-4">
                                <div>
                                    <h4 className="font-semibold">Operating System</h4>
                                    <p>{product.metadata.requirements.os}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Processor</h4>
                                    <p>{product.metadata.requirements.processor}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Memory</h4>
                                    <p>{product.metadata.requirements.ram}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Storage</h4>
                                    <p>{product.metadata.requirements.storage}</p>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="support" className="mt-4">
                        <Card className="p-6">
                            <h3 className="text-xl font-semibold mb-4">Support</h3>
                            <div className="grid gap-4">
                                <div>
                                    <h4 className="font-semibold">Support Website</h4>
                                    <a
                                        href={product.metadata.support.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        Visit Support Website
                                    </a>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Support Email</h4>
                                    <a
                                        href={`mailto:${product.metadata.support.email}`}
                                        className="text-primary hover:underline"
                                    >
                                        {product.metadata.support.email}
                                    </a>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Documentation</h4>
                                    <a
                                        href={product.metadata.support.documentation}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        View Documentation
                                    </a>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
