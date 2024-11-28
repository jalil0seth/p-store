import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  selectedProducts: string[];
  setSelectedProducts: (ids: string[]) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  selectedProducts,
  setSelectedProducts,
  onEdit,
  onDelete,
}) => {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProducts(e.target.checked ? products.map(p => p.id) : []);
  };

  const handleSelectProduct = (id: string, checked: boolean) => {
    setSelectedProducts(
      checked
        ? [...selectedProducts, id]
        : selectedProducts.filter(productId => productId !== id)
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-14">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-gray-500 truncate max-w-md">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{product.category || '-'}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.status === 'active'
                        ? 'success'
                        : product.status === 'draft'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
