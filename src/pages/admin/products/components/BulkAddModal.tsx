import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";
import { Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BulkAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (products: Partial<Product>[]) => Promise<void>;
}

interface ProductRow {
  name: string;
  price: number;
  status: 'active' | 'draft' | 'archived';
}

const defaultRow: ProductRow = {
  name: '',
  price: 0,
  status: 'draft',
};

export const BulkAddModal: React.FC<BulkAddModalProps> = ({
  open,
  onOpenChange,
  onAdd,
}) => {
  const [rows, setRows] = useState<ProductRow[]>([{ ...defaultRow }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validRows = rows.filter(row => row.name.trim());
    if (validRows.length > 0) {
      await onAdd(validRows);
      setRows([{ ...defaultRow }]);
    }
  };

  const addRow = () => {
    setRows([...rows, { ...defaultRow }]);
  };

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof ProductRow, value: string | number) => {
    const newRows = [...rows];
    if (field === 'price') {
      newRows[index][field] = Number(value);
    } else if (field === 'status') {
      newRows[index][field] = value as 'active' | 'draft' | 'archived';
    } else {
      newRows[index][field] = value as string;
    }
    setRows(newRows);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Bulk Add Products
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {rows.map((row, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-lg group"
              >
                <Input
                  value={row.name}
                  onChange={(e) => updateRow(index, 'name', e.target.value)}
                  placeholder="Product name"
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={row.price}
                  onChange={(e) => updateRow(index, 'price', e.target.value)}
                  placeholder="Price"
                  className="w-32"
                />
                <Select
                  value={row.status}
                  onValueChange={(value) => updateRow(index, 'status', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addRow}
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Product
          </Button>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!rows.some(row => row.name.trim())}
            >
              Add Products
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
