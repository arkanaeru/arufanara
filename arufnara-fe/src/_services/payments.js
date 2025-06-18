import API from "../_api";

export const getPayments = async () => {
  try {
    const token = localStorage.getItem('token'); // atau sessionStorage.getItem('token')
    
    const { data } = await API.get("/admin/payments", {
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

export const getPaymentHistory = async () => {
  try {
    const token = localStorage.getItem('token'); // atau sessionStorage.getItem('token')
    const { data } = await API.get("/payments", {
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

export const getPaymentByOrder = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get(`/payments/order/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return data.data || data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createPayment = async (paymentData) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.post("/payments", paymentData, {
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

export const putPayment = async (paymentId, paymentData) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.put(`/payments/${paymentId}`, paymentData, {
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


export const updatePaymentStatus = async (paymentId, payment_status) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.patch(
      `/admin/payments/${paymentId}/status`,
      { payment_status },
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

export const updatePaymentProof = async (paymentId, file) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('proof_of_payment', file);

    const { data } = await API.post(
      `/admin/payments/${paymentId}/proof`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};