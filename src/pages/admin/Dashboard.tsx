import React, { useState, useEffect } from 'react';
import { FiBox, FiUsers, FiDollarSign, FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { PocketBaseService } from '../../services/PocketBaseService';
import { toast } from 'sonner';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, onClick }) => (
  <div
    className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className="text-blue-500">{icon}</div>
    </div>
  </div>
);

interface DashboardStats {
  products: number;
  users: number;
  revenue: number;
  orders: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    users: 0,
    revenue: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const pbService = PocketBaseService.getInstance();
        if (!pbService || !pbService.pb) {
          throw new Error('PocketBase service not initialized');
        }

        const pb = pbService.pb;

        const [productsResponse, usersResponse, ordersResponse, allOrders] = await Promise.all([
          pb.collection('store_products').getList(1, 1).catch(() => ({ totalItems: 0 })),
          pb.collection('store_users').getList(1, 1).catch(() => ({ totalItems: 0 })),
          pb.collection('store_orders').getList(1, 1).catch(() => ({ totalItems: 0 })),
          pb.collection('store_orders').getFullList({
            filter: 'status = "paid"'
          }).catch(() => [])
        ]);

        if (!isMounted) return;

        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);

        setStats({
          products: productsResponse.totalItems,
          users: usersResponse.totalItems,
          revenue: totalRevenue,
          orders: ordersResponse.totalItems,
        });
      } catch (err) {
        if (!isMounted) return;
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard stats';
        console.error('Error fetching stats:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.products}
          icon={<FiBox size={24} />}
          onClick={() => navigate('/admin/products')}
        />
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={<FiUsers size={24} />}
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          icon={<FiDollarSign size={24} />}
        />
        <StatCard
          title="Total Orders"
          value={stats.orders}
          icon={<FiShoppingCart size={24} />}
        />
      </div>
    </div>
  );
};

export default Dashboard;
