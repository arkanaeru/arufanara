'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getOrders } from '../../_services/orders';

const PAGE_SIZE = 5;

const AdminDashboard = () => {
  const [isClient, setIsClient] = useState(false);
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsClient(true);

    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        const sorted = [...data].sort((a, b) => {
          return b.id - a.id || new Date(b.created_at) - new Date(a.created_at);
        });
        setOrders(sorted);

        // Chart: count order per month
        const countByMonth = {};
        data.forEach(order => {
          if (!order.created_at) return;
          const date = new Date(order.created_at);
          const month = date.toLocaleString('default', { month: 'short' });
          countByMonth[month] = (countByMonth[month] || 0) + 1;
        });

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedChartData = months.map(month => ({
          month,
          orders: countByMonth[month] || 0,
        }));

        setChartData(formattedChartData);
      } catch (err) {
        setError('Gagal mengambil data order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (!isClient) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const paginatedOrders = orders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen p-6 text-black bg-gray-50 dark:text-white dark:bg-dark">
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-sm text-gray-600">Kelola data admin</p>
      </div>

      {error && (
        <div className="p-4 mb-6 border-l-4 border-red-400 rounded-r-lg bg-red-50">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-1 text-sm text-red-600 underline"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="p-6 mb-8 bg-white shadow-md rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">User & Order Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 bg-white shadow-md rounded-xl">
        <h2 className="mb-4 text-lg font-semibold">Incoming Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] table-auto text-sm text-left text-gray-600">
            <thead className="text-xs uppercase border-b text-blue-gray-400">
              <tr>
                <th className="px-6 py-3">Id</th>
                <th className="px-6 py-3">TopUp Option</th>
                <th className="px-6 py-3">Jumlah TopUp</th>
                <th className="px-6 py-3">Id User</th>
                <th className="px-6 py-3">Payment Method</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-400">
                    Tidak ada data order
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const opt = order.topup_option;
                  const jumlah = opt?.diamond_amount || opt?.amount || '-';
                  const metode = order.payment_method || '-';
                  const tanggal = order.created_at
                    ? new Date(order.created_at).toLocaleDateString('id-ID')
                    : '-';
                  return (
                    <tr key={order.id || order._id} className="border-b">
                      <td className="px-5 py-3">{order.id || order._id}</td>
                      <td className="px-5 py-3">{opt?.id || '-'}</td>
                      <td className="px-5 py-3">{jumlah}</td>
                      <td className="px-5 py-3">{order.user_id || '-'}</td>
                      <td className="px-5 py-3">{metode}</td>
                      <td className="px-5 py-3 capitalize">{order.status || '-'}</td>
                      <td className="px-5 py-3">{tanggal}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-6 space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-300'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;