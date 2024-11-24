import React, { useState, useEffect } from 'react';
import { getTestimonials } from '../../lib/api';
import type { StoreTestimonial } from '../../config/pocketbase';
import { Plus, Edit, Trash2, Star } from 'lucide-react';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<StoreTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<StoreTestimonial> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
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
        <h2 className="text-2xl font-bold">Testimonials</h2>
        <button
          onClick={() => {
            setEditingTestimonial({});
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600 mb-4">{testimonial.content}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingTestimonial(testimonial);
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