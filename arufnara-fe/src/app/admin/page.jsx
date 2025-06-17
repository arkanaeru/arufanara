'use client';
// app/admin/page.jsx
import React from "react";

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

// Contoh data statis
const data = [
  { month: 'Jan', users: 400, orders: 240 },
  { month: 'Feb', users: 300, orders: 139 },
  { month: 'Mar', users: 500, orders: 380 },
  { month: 'Apr', users: 700, orders: 390 },
  { month: 'May', users: 1000, orders: 600 },
  { month: 'Jun', users: 1200, orders: 800 },
];

const AdminDashboard = () => {
  return (
    <div className="py-10 text-black bg-white dark:bg-dark dark:text-white">
    
    <div className="p-6">
      {/* Statistik Cards */}
      {/* ... (blok kartu statistik Total Users dan Orders) */}

      {/* Grafik */}
      <div className="p-6 mt-12 bg-white shadow-md rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">User & Order Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" name="Users" />
            <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    
    <div className="p-4">
      <div className="mt-12">
        
        <div className="grid grid-cols-1 gap-6 mb-4 xl:grid-cols-1">
          <div className="relative flex flex-col overflow-hidden text-gray-700 bg-white shadow-md bg-clip-border rounded-xl xl:col-span-2">
            <div className="relative flex items-center justify-between p-6 m-0 overflow-hidden text-gray-700 bg-transparent shadow-none bg-clip-border rounded-xl">
              <div>
                <h6 className="block mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Incoming Order
                </h6>
              </div>
            </div>
            <div className="p-6 px-0 pt-0 pb-2 overflow-x-scroll">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left border-b border-blue-gray-50">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Id
                      </p>
                    </th>
                    <th className="px-6 py-3 text-left border-b border-blue-gray-50">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        TopUp Option
                      </p>
                    </th>
                    <th className="px-6 py-3 text-left border-b border-blue-gray-50">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Jumlah TopUp
                      </p>
                    </th>
                    <th className="px-6 py-3 text-left border-b border-blue-gray-50">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Id User
                      </p>
                    </th>
                    <th className="px-6 py-3 text-left border-b border-blue-gray-50">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Payment Method
                      </p>
                    </th>
                    <th className="px-6 py-3 text-left border-b border-blue-gray-50">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Status
                      </p>
                    </th>
                    <th className="px-6 py-3 text-left border-b border-blue-gray-50">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Tanggal
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-5 py-3 border-b border-blue-gray-50">
                      <div className="flex items-center gap-4">
                        <p className="block font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900">
                          1
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3 border-b border-blue-gray-50">
                      <p className="block font-sans text-xs antialiased font-medium text-blue-gray-600">
                        2
                      </p>
                    </td>
                    <td className="px-5 py-3 border-b border-blue-gray-50">
                      <p className="block font-sans text-xs antialiased font-medium text-blue-gray-600">
                        1
                      </p>
                    </td>
                    <td className="px-5 py-3 border-b border-blue-gray-50">
                      <p className="block font-sans text-xs antialiased font-medium text-blue-gray-600">
                        2
                      </p>
                    </td>
                    <td className="px-5 py-3 border-b border-blue-gray-50">
                      <p className="block font-sans text-xs antialiased font-medium text-blue-gray-600">
                        QRIS
                      </p>
                    </td>
                    <td className="px-5 py-3 border-b border-blue-gray-50">
                      <p className="block font-sans text-xs antialiased font-medium text-blue-gray-600">
                        Pending
                      </p>
                    </td>
                    <td className="px-5 py-3 border-b border-blue-gray-50">
                      <p className="block font-sans text-xs antialiased font-medium text-blue-gray-600">
                        20/2/2025
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  );
};

export default AdminDashboard;
