import axios from 'axios';

const client = axios.create({ baseURL: '/api' });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('digitak_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const path = window.location.pathname;
      if (path.startsWith('/admin') && !path.endsWith('/admin/login')) {
        localStorage.removeItem('digitak_token');
        localStorage.removeItem('digitak_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export function getErrorMessage(err, fallback = 'Terjadi kesalahan, coba lagi.') {
  return err?.response?.data?.message || fallback;
}

export function getFieldErrors(err) {
  return err?.response?.data?.errors || {};
}

export default client;