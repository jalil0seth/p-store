import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useProductStore } from '@/store/productStore';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, Loader2, Plus, RefreshCw } from 'lucide-react';

interface ProductVariant {
  name: string;
  description: string;
  price: number;
  discountPercentage?: number;
}

interface ProductMetadata {
  shortDescription: string;
  longDescription: string;
  requirements: {
    os: string;
    processor: string;
    ram: string;
    storage: string;
  };
  highlights: string[];
  keywords: string[];
  releaseInfo: {
    version: string;
    releaseDate: string;
    lastUpdate: string;
  };
  support: {
    website: string;
    email: string;
    documentation: string;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  type: 'mac' | 'windows' | 'mac_windows';
  description: string;
  category: string;
  featured: boolean;
  image: string;
  images: string[];
  variants: ProductVariant[];
  metadata: ProductMetadata;
  isAvailable: boolean;
}

interface ProductFormData extends Omit<Product, 'id' | 'slug'> {
  newImages?: File[];
}

export default function ProductsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { products, isLoading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProductStore();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    brand: '',
    type: 'mac',
    description: '',
    category: '',
    featured: false,
    image: '',
    images: [],
    variants: [],
    metadata: {
      shortDescription: '',
      longDescription: '',
      requirements: {
        os: '',
        processor: '',
        ram: '',
        storage: '',
      },
      highlights: [],
      keywords: [],
      releaseInfo: {
        version: '',
        releaseDate: '',
        lastUpdate: '',
      },
      support: {
        website: '',
        email: '',
        documentation: '',
      },
    },
    isAvailable: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const parseProduct = (product: any): Product => {
    return {
      ...product,
      variants: typeof product.variants === 'string' ? JSON.parse(product.variants) : [],
      metadata: typeof product.metadata === 'string' ? JSON.parse(product.metadata) : {
        shortDescription: '',
        longDescription: '',
        requirements: {
          os: '',
          processor: '',
          ram: '',
          storage: ''
        },
        highlights: [],
        keywords: [],
        releaseInfo: {
          version: '',
          releaseDate: '',
          lastUpdate: ''
        },
        support: {
          website: '',
          email: '',
          documentation: ''
        }
      },
      images: typeof product.images === 'string' ? JSON.parse(product.images) : []
    };
  };

  const filteredProducts = products
    .map(parseProduct)
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleBulkAction = async (action: 'delete' | 'activate' | 'deactivate') => {
    try {
      switch (action) {
        case 'delete':
          await Promise.all(selectedProducts.map(id => deleteProduct(id)));
          toast({ title: 'Success', description: 'Selected products deleted' });
          break;
        case 'activate':
        case 'deactivate':
          await Promise.all(selectedProducts.map(id => 
            updateProduct(id, { isAvailable: action === 'activate' ? true : false })
          ));
          toast({ title: 'Success', description: `Selected products ${action}d` });
          break;
      }
      setSelectedProducts([]);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to perform bulk action', 
        variant: 'destructive' 
      });
    }
  };

  const handleGenerateProducts = async () => {
    setIsGenerating(true);
    try {
      // Generate 5 sample products
      const sampleProducts = Array.from({ length: 5 }, (_, i) => ({
        name: `Sample Product ${i + 1}`,
        slug: `sample-product-${i + 1}`,
        brand: 'Sample Brand',
        type: 'mac',
        description: 'This is a sample product description.',
        category: 'Sample Category',
        featured: false,
        image: 'https://via.placeholder.com/300',
        images: ['https://via.placeholder.com/300'],
        variants: [
          {
            name: 'Sample Variant',
            description: 'This is a sample variant description.',
            price: Math.floor(Math.random() * 1000) + 1,
          },
        ],
        metadata: {
          shortDescription: 'This is a short description.',
          longDescription: 'This is a long description.',
          requirements: {
            os: 'macOS',
            processor: 'Intel Core i5',
            ram: '8GB',
            storage: '256GB',
          },
          highlights: ['Highlight 1', 'Highlight 2'],
          keywords: ['Keyword 1', 'Keyword 2'],
          releaseInfo: {
            version: '1.0.0',
            releaseDate: '2022-01-01',
            lastUpdate: '2022-01-01',
          },
          support: {
            website: 'https://example.com',
            email: 'support@example.com',
            documentation: 'https://example.com/docs',
          },
        },
        isAvailable: true,
      }));

      await Promise.all(sampleProducts.map(product => createProduct(product)));
      toast({ title: 'Success', description: 'Sample products generated' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to generate products', 
        variant: 'destructive' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast({ title: 'Success', description: 'Product updated' });
        setShowEditDialog(false);
      } else {
        await createProduct(formData);
        toast({ title: 'Success', description: 'Product created' });
        setShowAddDialog(false);
      }
      setFormData({
        name: '',
        slug: '',
        brand: '',
        type: 'mac',
        description: '',
        category: '',
        featured: false,
        image: '',
        images: [],
        variants: [],
        metadata: {
          shortDescription: '',
          longDescription: '',
          requirements: {
            os: '',
            processor: '',
            ram: '',
            storage: '',
          },
          highlights: [],
          keywords: [],
          releaseInfo: {
            version: '',
            releaseDate: '',
            lastUpdate: '',
          },
          support: {
            website: '',
            email: '',
            documentation: '',
          },
        },
        isAvailable: true,
      });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to save product', 
        variant: 'destructive' 
      });
    }
  };

  const ProductDialog = ({ isEdit = false }) => (
    <Dialog 
      open={isEdit ? showEditDialog : showAddDialog} 
      onOpenChange={isEdit ? setShowEditDialog : setShowAddDialog}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            Fill in the product details below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'mac' | 'windows' | 'mac_windows') => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mac">Mac</SelectItem>
                  <SelectItem value="windows">Windows</SelectItem>
                  <SelectItem value="mac_windows">Mac & Windows</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="featured" className="text-right">Featured</Label>
              <Checkbox
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">Image</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="images" className="text-right">Images</Label>
              <Input
                id="images"
                value={formData.images.join(', ')}
                onChange={(e) => setFormData({ ...formData, images: e.target.value.split(', ') })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="variants" className="text-right">Variants</Label>
              <Textarea
                id="variants"
                value={JSON.stringify(formData.variants, null, 2)}
                onChange={(e) => setFormData({ ...formData, variants: JSON.parse(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="metadata" className="text-right">Metadata</Label>
              <Textarea
                id="metadata"
                value={JSON.stringify(formData.metadata, null, 2)}
                onChange={(e) => setFormData({ ...formData, metadata: JSON.parse(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isAvailable" className="text-right">Is Available</Label>
              <Checkbox
                checked={formData.isAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEdit ? 'Save Changes' : 'Add Product'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleGenerateProducts}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Generate Products
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {selectedProducts.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction('delete')}>
                  Delete Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                  Set Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                  Set Draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProducts.length === filteredProducts.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price Range</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked) => handleSelectProduct(product.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/40';
                      }}
                    />
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {product.metadata.shortDescription}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {product.type === 'mac_windows' ? 'Mac & Windows' : 
                     product.type === 'mac' ? 'Mac' : 'Windows'}
                  </span>
                </TableCell>
                <TableCell>
                  {product.variants.length > 0 ? (
                    <div>
                      <div className="font-medium">
                        ${Math.min(...product.variants.map(v => v.price))} - 
                        ${Math.max(...product.variants.map(v => v.price))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.variants.length} variants
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">No variants</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.isAvailable ? 'Available' : 'Not Available'}
                    </span>
                    {product.featured && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Featured
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingProduct(product);
                      setFormData(product);
                      setShowEditDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductDialog isEdit={false} />
      <ProductDialog isEdit={true} />
    </div>
  );
}