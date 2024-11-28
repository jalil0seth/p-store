import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types";
import { ImageIcon, X, Wand2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from "@/lib/utils";
import { llmService } from "@/services/LLMService";
import { toast } from "sonner";

interface AddEditProductModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Partial<Product>) => Promise<void>;
}

interface Variant {
  id: string;
  name: string;
  price: number;
  original_price: number;
  available: boolean;
}

interface ProductFeatures {
  tax_included: boolean;
  requires_shipping: boolean;
  track_quantity: boolean;
  continue_selling: boolean;
}

const defaultFeatures: ProductFeatures = {
  tax_included: false,
  requires_shipping: true,
  track_quantity: true,
  continue_selling: false,
};

const defaultProduct: Partial<Product> = {
  name: '',
  description: '',
  type: '',
  category: '',
  brand: '',
  featured: false,
  image: '',
  images: '[]',
  metadata: '{}',
  variants: '[]',
  isAvailable: true,
  features: JSON.stringify(defaultFeatures)
};

function generateId(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
  product,
  open,
  onOpenChange,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>(defaultProduct);
  const [activeTab, setActiveTab] = useState('basic');
  const [features, setFeatures] = useState<ProductFeatures>(defaultFeatures);
  const [jsonErrors, setJsonErrors] = useState<{
    images?: string;
    variants?: string;
    metadata?: string;
  }>({});
  const [variants, setVariants] = useState<Variant[]>([]);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (open) {
      if (product) {
        setFormData({
          ...defaultProduct,
          ...product,
        });
        try {
          const parsedVariants = JSON.parse(product.variants || '[]');
          if (!Array.isArray(parsedVariants)) {
            console.error('Variants is not an array:', parsedVariants);
            setVariants([]);
          } else {
            setVariants(parsedVariants);
          }
          const parsedFeatures = JSON.parse(product.features || JSON.stringify(defaultFeatures));
          setFeatures(parsedFeatures);
        } catch (error) {
          console.error('Error parsing variants or features:', error);
          setVariants([]);
          setFeatures(defaultFeatures);
        }
      } else {
        setFormData(defaultProduct);
        setVariants([]);
        setFeatures(defaultFeatures);
      }
      setJsonErrors({});
      setEditingVariant(null);
      setEditingVariantIndex(null);
    }
  }, [open, product]);

  const handleVariantSubmit = () => {
    if (!editingVariant) return;

    const newVariants = [...variants];
    if (editingVariantIndex !== null) {
      newVariants[editingVariantIndex] = editingVariant;
    } else {
      // Ensure new variant has an ID
      newVariants.push({
        ...editingVariant,
        id: editingVariant.id || generateId()
      });
    }

    setVariants(newVariants);
    setFormData(prev => ({ ...prev, variants: JSON.stringify(newVariants) }));
    setEditingVariant(null);
    setEditingVariantIndex(null);
  };

  const handleVariantChange = (field: keyof Variant, value: string | number | boolean) => {
    if (!editingVariant) return;
    setEditingVariant(prev => ({
      ...prev,
      [field]: field === 'price' || field === 'original_price' ? Number(value) : value
    }));
  };

  const handleAddVariant = () => {
    setEditingVariant({
      id: generateId(),
      name: '',
      price: 0,
      original_price: 0,
      available: true
    });
    setEditingVariantIndex(null);
  };

  const handleEditVariant = (index: number) => {
    const variant = variants[index];
    setEditingVariant({
      ...variant,
      id: variant.id || generateId()
    });
    setEditingVariantIndex(index);
  };

  const handleVariantDelete = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
    setFormData(prev => ({ ...prev, variants: JSON.stringify(newVariants) }));
  };

  const handleGenerateContent = async () => {
    if (!formData.name) {
      toast.error("Please enter a product name first");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await llmService.generateProductContent(formData.name);
      
      setFormData(prev => ({
        ...prev,
        brand: result.brand,
        description: result.description,
        category: result.category,
        type: result.type,
        metadata: result.metadata,
        variants: result.variants
      }));

      try {
        // Parse variants from the result
        const parsedVariants = JSON.parse(result.variants);
        if (Array.isArray(parsedVariants)) {
          setVariants(parsedVariants);
        } else {
          console.error('Generated variants is not an array:', parsedVariants);
          setVariants([]);
        }
      } catch (error) {
        console.error('Error parsing generated variants:', error);
        setVariants([]);
      }
      
      toast.success("Product content generated successfully!");
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate product content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleJsonChange = (value: string, field: 'images' | 'variants' | 'metadata') => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateJson(value, field);
  };

  const handleSubmit = async () => {
    
    const imagesValid = validateJson(formData.images || '[]', 'images');
    const variantsValid = validateJson(formData.variants || '[]', 'variants');
    const metadataValid = validateJson(formData.metadata || '{}', 'metadata');

    if (!imagesValid || !variantsValid || !metadataValid) {
      return;
    }

    const updatedFormData = {
      ...formData,
      variants: JSON.stringify(variants),
      features: JSON.stringify(features)
    };
    await onSave(updatedFormData);
    onOpenChange(false);
  };

  const imagesToText = (jsonStr: string): string => {
    try {
      const urls = JSON.parse(jsonStr || '[]');
      return Array.isArray(urls) ? urls.join('\n') : '';
    } catch {
      return '';
    }
  };

  const textToImages = (text: string): string => {
    const urls = text
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    return JSON.stringify(urls, null, 2);
  };

  const validateJson = (value: string, field: 'images' | 'variants' | 'metadata'): boolean => {
    try {
      const parsed = JSON.parse(value);
      if (field === 'images' && !Array.isArray(parsed)) {
        setJsonErrors(prev => ({ ...prev, [field]: 'Must be a JSON array' }));
        return false;
      }
      setJsonErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    } catch (e) {
      setJsonErrors(prev => ({ ...prev, [field]: 'Invalid JSON format' }));
      return false;
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value ?? '' }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-white dark:text-gray-900">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">{product ? 'Edit' : 'Add'} Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">
                Media
              </TabsTrigger>
              <TabsTrigger value="variants" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">
                Variants
              </TabsTrigger>
              <TabsTrigger value="availability" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">
                Availability
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 pt-4">
              <div className="grid grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="col-span-2 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="name" className="text-base font-semibold text-gray-900">
                        Product Name
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateContent}
                        disabled={isGenerating}
                        className="flex items-center gap-2"
                      >
                        <Wand2 className="w-4 h-4" />
                        {isGenerating ? "Generating..." : "Generate Content"}
                      </Button>
                    </div>
                    <Input
                      id="name"
                      value={formData.name ?? ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter product name"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="description" className="text-base font-semibold text-gray-900">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description ?? ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter product description"
                      className="h-[200px] resize-none"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="image" className="text-base font-semibold text-gray-900">
                      Main Image URL
                    </Label>
                    <div className="space-y-4">
                      <Input
                        id="image"
                        value={formData.image ?? ''}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        placeholder="Enter image URL"
                        className="w-full"
                      />
                      {formData.image && (
                        <div className="relative aspect-square w-full rounded-lg border-2 border-dashed border-gray-200 p-2">
                          <img
                            src={formData.image}
                            alt="Product preview"
                            className="h-full w-full object-contain rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="brand" className="text-base font-semibold text-gray-900">
                      Brand
                    </Label>
                    <Input
                      id="brand"
                      value={formData.brand ?? ''}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      placeholder="Enter brand name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <Label htmlFor="category" className="text-base font-semibold text-gray-900">
                        Category
                      </Label>
                      <Input
                        id="category"
                        value={formData.category ?? ''}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        placeholder="Enter category"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="type" className="text-base font-semibold text-gray-900">
                        Type
                      </Label>
                      <Input
                        id="type"
                        value={formData.type ?? ''}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        placeholder="Enter type"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Media</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Add Media
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {JSON.parse(formData.images || '[]').map((url: string, index: number) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                          onClick={() => {
                            const images = JSON.parse(formData.images || '[]');
                            images.splice(index, 1);
                            handleInputChange('images', JSON.stringify(images));
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Image URLs (One per line)</Label>
                  <Textarea
                    id="images"
                    value={imagesToText(formData.images || '[]')}
                    onChange={(e) => handleInputChange('images', textToImages(e.target.value))}
                    placeholder="Enter image URLs"
                    className="h-[150px]"
                  />
                  {jsonErrors.images && (
                    <p className="text-sm text-red-500">{jsonErrors.images}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="variants" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Product Variants</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddVariant}
                    className="flex items-center gap-2"
                  >
                    Add Variant
                  </Button>
                </div>

                {editingVariant && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={editingVariant.name}
                          onChange={(e) => handleVariantChange('name', e.target.value)}
                          placeholder="Variant name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          type="number"
                          value={editingVariant.price}
                          onChange={(e) => handleVariantChange('price', e.target.value)}
                          placeholder="Price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Original Price</Label>
                        <Input
                          type="number"
                          value={editingVariant.original_price}
                          onChange={(e) => handleVariantChange('original_price', e.target.value)}
                          placeholder="Original price"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="available"
                          checked={editingVariant.available}
                          onCheckedChange={(checked) => handleVariantChange('available', checked)}
                        />
                        <Label htmlFor="available">Available</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingVariant(null);
                          setEditingVariantIndex(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleVariantSubmit}>
                        {editingVariantIndex !== null ? 'Update' : 'Add'} Variant
                      </Button>
                    </div>
                  </div>
                )}

                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">ID</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Price</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Original</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Available</th>
                        <th className="px-4 py-2 text-right text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {variants.map((variant, index) => (
                        <tr key={variant.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-500">{variant.id}</td>
                          <td className="px-4 py-2">{variant.name}</td>
                          <td className="px-4 py-2">${variant.price}</td>
                          <td className="px-4 py-2">${variant.original_price}</td>
                          <td className="px-4 py-2">{variant.available ? 'Yes' : 'No'}</td>
                          <td className="px-4 py-2 text-right space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditVariant(index)}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleVariantDelete(index)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="availability" className="space-y-4">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sales Channels</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isAvailable"
                      checked={formData.isAvailable}
                      onCheckedChange={(checked) => handleInputChange('isAvailable', checked as boolean)}
                    />
                    <Label htmlFor="isAvailable">Available for sale</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Inventory & Shipping</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="track_quantity"
                        checked={features.track_quantity}
                        onCheckedChange={(checked) => {
                          const newFeatures = { ...features, track_quantity: checked as boolean };
                          setFeatures(newFeatures);
                          handleInputChange('features', JSON.stringify(newFeatures));
                        }}
                      />
                      <Label htmlFor="track_quantity">Track quantity</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="continue_selling"
                        checked={features.continue_selling}
                        onCheckedChange={(checked) => {
                          const newFeatures = { ...features, continue_selling: checked as boolean };
                          setFeatures(newFeatures);
                          handleInputChange('features', JSON.stringify(newFeatures));
                        }}
                      />
                      <Label htmlFor="continue_selling">Continue selling when out of stock</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requires_shipping"
                        checked={features.requires_shipping}
                        onCheckedChange={(checked) => {
                          const newFeatures = { ...features, requires_shipping: checked as boolean };
                          setFeatures(newFeatures);
                          handleInputChange('features', JSON.stringify(newFeatures));
                        }}
                      />
                      <Label htmlFor="requires_shipping">This is a physical product</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pricing</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tax_included"
                      checked={features.tax_included}
                      onCheckedChange={(checked) => {
                        const newFeatures = { ...features, tax_included: checked as boolean };
                        setFeatures(newFeatures);
                        handleInputChange('features', JSON.stringify(newFeatures));
                      }}
                    />
                    <Label htmlFor="tax_included">Charge tax on this product</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>
              {product ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
