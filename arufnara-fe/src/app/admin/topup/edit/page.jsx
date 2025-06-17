"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API from "../../../../_api";

export default function EditTopup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [form, setForm] = useState({
    diamond_amount: "",
    bonus_diamond: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  // Fungsi untuk mendapatkan config dengan authorization header
  const getAuthConfig = () => {
    const token = localStorage.getItem('token'); // atau sessionStorage.getItem('token')
    
    if (!token) {
      alert('Token tidak ditemukan. Silakan login kembali.');
      router.push('/login');
      return null;
    }

    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  useEffect(() => {
    const fetchTopup = async () => {
      try {
        const config = getAuthConfig();
        if (!config) return;

        const response = await API.get(`/admin/topup-options/${id}`, config);
        const data = response.data?.data ?? response.data;
        
        setForm({
          diamond_amount: data.diamond_amount,
          bonus_diamond: data.bonus_diamond,
          price: data.price,
        });
      } catch (err) {
        console.error('Error fetching topup:', err);
        
        // Handle specific error cases
        if (err.response?.status === 401) {
          alert("Session expired. Silakan login kembali.");
          localStorage.removeItem('token'); // Clear invalid token
          router.push('/login');
        } else {
          alert("Gagal mengambil data: " + (err.response?.data?.message || err.message));
          router.push("/admin/topup");
        }
      }
    };

    if (id) {
      fetchTopup();
    }
  }, [id, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = getAuthConfig();
      if (!config) {
        setLoading(false);
        return;
      }

      await API.put(`/admin/topup-options/${id}`, {
        diamond_amount: parseInt(form.diamond_amount),
        bonus_diamond: parseInt(form.bonus_diamond),
        price: parseFloat(form.price),
      }, config);

      alert("Topup berhasil diperbarui.");
      router.push("/admin/topup");
    } catch (err) {
      console.error('Error updating topup:', err);
      
      if (err.response?.status === 401) {
        alert("Session expired. Silakan login kembali.");
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        alert("Gagal memperbarui topup: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-semibold">Edit Paket Diamond</h2>
      <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white rounded shadow">
        <div>
          <label className="block mb-1 text-sm font-medium">Jumlah Diamond</label>
          <input
            type="number"
            name="diamond_amount"
            value={form.diamond_amount}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Bonus Diamond</label>
          <input
            type="number"
            name="bonus_diamond"
            value={form.bonus_diamond}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Harga (IDR)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="flex justify-between mt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/topup")}
            className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500"
          >
            Batal
          </button>
        </div>
      </form>
    </section>
  );
}