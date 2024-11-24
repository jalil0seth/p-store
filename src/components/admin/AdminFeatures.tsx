import React, { useState, useEffect } from 'react';
import { getFeatures } from '../../lib/api';
import type { StoreFeature } from '../../config/pocketbase';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminFeatures() {
  const [features, setFeatures] = useState<StoreFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFeature, setEditingFeature] = useState<Partial<StoreFeature> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadFeatures();
  }, []);

  async function loadFeatures() {
    try {
      const data = await getFeatures();
      setFeatures(data);
    } catch (error) {
      console.error('Error loading features:', error);
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
        <h2 className="text-2xl font-bold">Features</h2>
        <button
          onClick={() => {
            setEditingFeature({});
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
          <Plus className="w-4 h-4" />
          Add Feature
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div key={feature.id} className="bg-white rounded-lg shadow p-6">
            <div className={`w-12 h-12 rounded-lg bg-${feature.color}-50 flex items-center justify-center mb-4`}>
              <span className={`text-2xl text-${feature.color}-500`}>{feature.icon}</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingFeature(feature);
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