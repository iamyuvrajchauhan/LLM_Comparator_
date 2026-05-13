import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Query specific calls
export const submitQuery = async (query, selectedModels = null, sessionId = null) => {
  try {
    const response = await api.post('/query', { query, selectedModels, sessionId });
    return response.data;
  } catch (error) {
    console.error('Error submitting query:', error);
    throw new Error('Failed to fetch model responses');
  }
};

export const getHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw new Error('Failed to fetch query history');
  }
};

export const fetchModels = async () => {
  try {
    const response = await api.get('/models');
    return response.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw new Error('Failed to fetch models');
  }
};

export const deleteHistory = async (id) => {
  try {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting history:', error);
    throw new Error('Failed to delete query history');
  }
};

export const renameHistory = async (id, title) => {
  try {
    const response = await api.patch(`/history/${id}/rename`, { title });
    return response.data;
  } catch (error) {
    console.error('Error renaming history:', error);
    throw new Error('Failed to rename chat');
  }
};

export default api;
