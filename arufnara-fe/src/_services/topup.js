import API from "../_api";

// Ambil semua paket topup
export const getTopup = async () => {
  const token = localStorage.getItem('token');
  const { data } = await API.get("http://localhost:8000/api/topup_options/", {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return data.data;
};

// Tambah paket topup
export const createTopup = async (topupData) => {
  const token = localStorage.getItem('token');
  const { data } = await API.post(
    "http://localhost:8000/api/admin/topup-options",
    topupData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return data.data || data.topup || data;
};

// Update paket topup
export const updateTopup = async (id, topupData) => {
  const token = localStorage.getItem('token');
  const { data } = await API.put(
    `http://localhost:8000/api/admin/topup-options/${id}`,
    topupData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return data.data || data.topup || data;
};

// Hapus paket topup
export const deleteTopup = async (id) => {
  const token = localStorage.getItem('token');
  await API.delete(
    `http://localhost:8000/api/admin/topup-options/${id}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return true;
};