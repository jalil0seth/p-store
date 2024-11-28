import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddEditProductModal } from '../components/AddEditProductModal';
import { useProductStore } from '@/store/productStore';
import toast from 'react-hot-toast';

const EditProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedProduct, getProduct, updateProduct } = useProductStore();

  useEffect(() => {
    if (id) {
      getProduct(id);
    }
  }, [id, getProduct]);

  const handleSave = async (data: any) => {
    if (!id) return;
    try {
      await updateProduct(id, data);
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  return (
    <AddEditProductModal
      open={true}
      onOpenChange={() => navigate('/admin/products')}
      onSave={handleSave}
      product={selectedProduct}
    />
  );
};

export default EditProductPage;
