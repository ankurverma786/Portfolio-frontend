import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Keep admin authentication simple for this single-owner portfolio.
// The backend still verifies every protected request; no cookies are used.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('portfolio_admin_token')) {
      localStorage.removeItem('portfolio_admin_token');
    }
    return Promise.reject(error);
  },
);

export default api;
