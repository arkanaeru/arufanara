"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  Download,
  Edit,
  Save,
  Upload,
  Search,
  Filter,
  X,
  Package,
} from "lucide-react";
import {
  getPayments,
  updatePaymentStatus,
  updatePaymentProof,
} from "../../../_services/payments";

export default function AdminPayment() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({ payment_status: "success" });
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [proofFile, setProofFile] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getPayments();
      setPayments(data);
    } catch {
      setError("Gagal memuat data pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (payment) => {
    setFormData({ payment_status: payment.payment_status || "success" });
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
    setFormData({ payment_status: "success" });
    setError(null);
  };

  const handleUpdate = async () => {
    if (!selectedPayment) return;
    try {
      setLoading(true);
      await updatePaymentStatus(selectedPayment.id || selectedPayment._id, formData.payment_status);
      await fetchPayments();
      closeModal();
    } catch {
      setError("Gagal mengupdate status pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  const openProofModal = (payment) => {
    setSelectedPayment(payment);
    setProofFile(null);
    setIsProofModalOpen(true);
  };

  const closeProofModal = () => {
    setIsProofModalOpen(false);
    setSelectedPayment(null);
    setProofFile(null);
    setError(null);
  };

  const handleUpdateProof = async () => {
    if (!selectedPayment || !proofFile) return;
    try {
      setLoading(true);
      await updatePaymentProof(selectedPayment.id || selectedPayment._id, proofFile);
      await fetchPayments();
      closeProofModal();
    } catch {
      setError("Gagal mengupdate bukti pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusClass = (status) => {
    const s = status?.toLowerCase();
    return s === "success"
      ? "bg-green-100 text-green-800"
      : s === "failed"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800";
  };

  const filteredPayments = payments.filter((payment) => {
    const term = searchTerm.toLowerCase();
    const statusMatch =
      statusFilter === "all" || payment.payment_status === statusFilter;
    const searchString = `${payment.id || payment._id || ""}${
      payment.order_id || ""
    }${payment.amount || ""}${payment.transaction_date || ""}`.toLowerCase();
    return searchString.includes(term) && statusMatch;
  });

  const formatCurrency = (amount) => {
    if (!amount) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-gray-900">
          Payment Management
        </h1>
        <p className="text-sm text-gray-600">Kelola data pembayaran pengguna</p>
      </div>

      {error && (
        <div className="flex items-center justify-between p-4 mb-6 border-l-4 border-red-400 rounded-r-lg bg-red-50">
          <p className="text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-4 text-red-600 underline">Tutup</button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col items-center gap-4 p-4 mb-6 bg-white rounded-lg shadow-sm sm:flex-row">
        <div className="relative flex-1 w-full">
          <Search className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan ID, order, tanggal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100">
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-left text-blue-900 uppercase border-b border-blue-200">ID</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-left text-blue-900 uppercase border-b border-blue-200">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-left text-blue-900 uppercase border-b border-blue-200">Amount</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-left text-blue-900 uppercase border-b border-blue-200">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-left text-blue-900 uppercase border-b border-blue-200">Status</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-left text-blue-900 uppercase border-b border-blue-200">Bukti</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-left text-blue-900 uppercase border-b border-blue-200">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment, idx) => (
                  <tr
                    key={payment.id || payment._id}
                    className={`transition-colors duration-150 ${
                      idx % 2 === 0 ? "bg-white" : "bg-blue-50/60"
                    } hover:bg-blue-100/60`}
                  >
                    <td className="px-6 py-4 font-semibold text-blue-900 border-b border-blue-100 whitespace-nowrap">
                      <span className="inline-block px-2 py-1 font-mono text-xs tracking-wider text-blue-800 bg-blue-200 rounded-lg shadow-sm">
                        {payment.id || payment._id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-900 border-b border-blue-100 whitespace-nowrap">
                      TRX00{payment.order_id || "-"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-900 border-b border-blue-100 whitespace-nowrap">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 text-blue-900 border-b border-blue-100 whitespace-nowrap">
                      {formatDate(payment.transaction_date)}
                    </td>
                    <td className="px-6 py-4 border-b border-blue-100 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold shadow-sm ${getPaymentStatusClass(payment.payment_status)}`}>
                        {payment.payment_status || "unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-blue-100 whitespace-nowrap">
                      {payment.proof_of_payment ? (
                        <a
                          href={payment.proof_of_payment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Download size={16} /> Lihat
                        </a>
                      ) : (
                        <span className="text-blue-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 border-b border-blue-100 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(payment)}
                          className="inline-flex items-center px-3 py-1 text-blue-700 transition-colors bg-blue-100 rounded-lg shadow hover:bg-blue-200"
                          disabled={loading}
                        >
                          <Edit size={14} className="mr-1" /> Edit Status
                        </button>
                        <button
                          onClick={() => openProofModal(payment)}
                          className="inline-flex items-center px-3 py-1 text-green-700 transition-colors bg-green-100 rounded-lg shadow hover:bg-green-200"
                          disabled={loading}
                        >
                          <Upload size={14} className="mr-1" /> Edit Bukti
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-blue-400">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 mb-4 text-blue-200" />
                      <p className="text-lg font-semibold">Tidak ada pembayaran ditemukan</p>
                      <p className="text-sm">Cobalah ubah pencarian atau filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit Payment Status</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="mb-2 font-medium text-gray-900">Informasi Payment</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="ml-2 font-medium">#{selectedPayment?.id || selectedPayment?._id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Current Status:</span>
                    <span className="ml-2 font-medium">{formData.payment_status}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Payment Status *
                </label>
                <select
                  value={formData.payment_status}
                  onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Pilih status pembayaran: Success (berhasil) atau Failed (gagal)
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? "Menyimpan..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bukti Modal */}
      {isProofModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit Bukti Pembayaran</h2>
              <button onClick={closeProofModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Upload Bukti Pembayaran
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={e => setProofFile(e.target.files[0])}
                  className="block w-full"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={closeProofModal}
                  className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateProof}
                  className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading || !proofFile}
                >
                  <Upload size={16} />
                  {loading ? "Menyimpan..." : "Update Bukti"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}