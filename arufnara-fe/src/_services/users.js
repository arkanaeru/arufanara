import API from "../_api";

// Ambil data semua user (khusus admin)
export const getUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("http://localhost:8000/api/admin/users", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Ambil data profile user (untuk user biasa)
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("http://localhost:8000/api/user/profile", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const editUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.put("http://localhost:8000/api/user/profile", profileData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const { data } = await API.post("http://localhost:8000/api/register", userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Tambah user (admin)
export const createUser = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.post("http://localhost:8000/api/admin/users", userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Edit user (admin)
export const updateUser = async (userId, userData) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.put(`http://localhost:8000/api/admin/users/${userId}`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Hapus user (admin)
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    await API.delete(`http://localhost:8000/api/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};