import React, { useState, useEffect } from 'react';
import { getPartners } from '../../lib/api';
import type { StorePartner } from '../../config/pocketbase';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminPartners() {
  const [partners, setPartners] = useState<StorePartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPartner, setEditingPartner] = useState<Partial<StorePartner> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  async function loadPartners() {
    try {
      const data = await getPartners();
      setPartners(data);
    } catch (error) {
      console.error('Error loading partners:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Partners</h2>
        <button
          onClick={() => {
            setEditingPartner({});
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
          <Plus className="w-4 h-4" />
          Add Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-white rounded-lg shadow p-6">
            <img
              src={partner.logo}
              alt={partner.name}
              className="w-full h-32 object-contain rounded-lg mb-4"
            />
            <h3 className="text-lg font-medium mb-2">{partner.name}</h3>
            <p className="text-gray-600 mb-4">{partner.description}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingPartner(partner);
                  setIsModalOpen(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  // Handle delete
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}