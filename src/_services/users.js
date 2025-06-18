import API from "../_api";

// Ambil data semua user (khusus admin)
export const getUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("/admin/users", {
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
    const { data } = await API.get("/user/profile", {
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
    const { data } = await API.put("/user/profile", profileData, {
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
    const { data } = await API.post("/register", userData, {
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
    const { data } = await API.post("/admin/users", userData, {
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
    const { data } = await API.put(`/admin/users/${userId}`, userData, {
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
    await API.delete(`/admin/users/${userId}`, {
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