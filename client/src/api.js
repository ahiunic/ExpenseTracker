import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(r => r, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (location.pathname !== '/login') location.href = '/login';
  }
  return Promise.reject(error);
});

export const assetUrl = path => path ? `${import.meta.env.VITE_ASSET_URL || ''}${path}` : '';
export const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
export const date = value => value ? new Intl.DateTimeFormat('en-IN').format(new Date(value)) : '—';
export const whatsapp = (mobile, message) => `https://wa.me/${mobile.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

