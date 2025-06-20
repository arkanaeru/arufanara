import API from "../_api";

export const getOrders = async () => {
  try {
    const token = localStorage.getItem('token'); // atau sessionStorage.getItem('token')
    
    const { data } = await API.get("/admin/orders", {
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

export const getOrderUser = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get("/orders", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data.data || data; // fallback jika backend return array langsung
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.post("/orders", orderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get(`/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data.data; // Pastikan backend return { success: true, data: {...} }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.put(
      `/admin/orders/${orderId}/status`,
      { status },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    await API.delete(`/admin/orders/${orderId}`, {
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