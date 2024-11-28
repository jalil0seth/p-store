import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import toast from 'react-hot-toast';
import { ProductTable } from './components/ProductTable';
import { AddEditProductModal } from './components/AddEditProductModal';
import { BulkAddModal } from './components/BulkAddModal';
import { Product } from '@/types';
import { useProductStore } from '@/store/productStore';

const ProductsPage: React.FC = () => {
  const { products, loading, error, fetchProducts, updateProduct, deleteProduct } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkAddOpen, setIsBulkAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts(searchTerm ? `name ~ "${searchTerm}" || description ~ "${searchTerm}"` : '');
  }, [searchTerm, fetchProducts]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleAddProduct = async (data: Partial<Product>) => {
    try {
      await useProductStore.getState().createProduct(data.name || '', data.status || 'draft');
      toast.success('Product added successfully');
      setIsAddModalOpen(false);
      await fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleEditProduct = async (data: Partial<Product>) => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, data);
      toast.success('Product updated successfully');
      setIsEditModalOpen(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleBulkAdd = async (products: Partial<Product>[]) => {
    try {
      await Promise.all(products.map(product => 
        useProductStore.getState().createProduct(product.name || '', product.status || 'draft')
      ));
      toast.success(`${products.length} products created successfully`);
      setIsBulkAddOpen(false);
      await fetchProducts();
    } catch (error) {
      console.error('Error creating products:', error);
      toast.error('Failed to create products');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted successfully');
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        await Promise.all(selectedProducts.map(id => deleteProduct(id)));
        toast.success('Products deleted successfully');
        setSelectedProducts([]);
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting products:', error);
        toast.error('Failed to delete products');
      }
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product inventory
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 w-64 bg-white border-gray-200 focus:border-gray-300 focus:ring-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setIsBulkAddOpen(true)}
            variant="outline"
            className="flex items-center space-x-2 bg-white hover:bg-gray-50 border-gray-200"
          >
            <Plus className="h-5 w-5" />
            <span>Bulk Add</span>
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </Button>
          {selectedProducts.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-5 w-5" />
              <span>Delete Selected ({selectedProducts.length})</span>
            </Button>
          )}
        </div>
      </div>

      <ProductTable
        products={products}
        loading={loading}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <AddEditProductModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleAddProduct}
        product={null}
      />

      <AddEditProductModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleEditProduct}
        product={editingProduct}
      />

      <BulkAddModal
        open={isBulkAddOpen}
        onOpenChange={setIsBulkAddOpen}
        onAdd={handleBulkAdd}
      />
    </div>
  );
};

export default ProductsPage;
