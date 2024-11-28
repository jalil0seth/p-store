import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PocketBaseService } from '../../../services/PocketBaseService';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: File;
}

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pb = PocketBaseService.getInstance();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
  });
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;

    try {
      const record = await pb.collection('store_products').getOne(id);
      setFormData({
        name: record.name,
        description: record.description,
        price: record.price,
        category: record.category,
        stock: record.stock,
      });
      if (record.image) {
        setCurrentImage(`http://217.76.51.2:8090/api/files/store_products/${id}/${record.image}`);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      navigate('/admin/products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setLoading(true);

    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          formDataObj.append(key, value);
        }
      });

      await pb.collection('store_products').update(id, formDataObj);
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            {currentImage && (
              <img
                src={currentImage}
                alt="Current product"
                className="w-32 h-32 object-cover rounded-lg mb-4"
              />
            )}
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="mt-1 block w-full"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
