import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'Unable to connect to the support service.';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message === 'Network Error') {
      message = 'Unable to connect to the support service. Please ensure the backend is running.';
    }
    return Promise.reject(new Error(message));
  }
);

export async function getTickets(params = {}) {
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      cleanParams[key] = params[key];
    }
  });

  return apiClient.get('/tickets', { params: cleanParams });
}

export async function getTicket(ticketId) {
  return apiClient.get(`/tickets/${encodeURIComponent(ticketId)}`);
}

export async function createTicket(data) {
  return apiClient.post('/tickets', data);
}

export async function updateTicket(ticketId, data) {
  return apiClient.put(`/tickets/${encodeURIComponent(ticketId)}`, data);
}

export async function getDashboardStats() {
  return apiClient.get('/dashboard/stats');
}

export async function getHealth() {
  return apiClient.get('/health');
}

export default apiClient;
