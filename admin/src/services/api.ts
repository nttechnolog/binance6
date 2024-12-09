import axios from 'axios';
import { API_URL } from '../config/constants';

// Создаем экземпляр axios с базовыми настройками
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Добавляем перехватчик для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Добавляем перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Если токен истек, пытаемся обновить его
      try {
        const refreshToken = localStorage.getItem('admin_refresh_token');
        if (refreshToken) {
          const response = await api.post('/api/admin/auth/refresh', { refreshToken });
          localStorage.setItem('admin_token', response.data.token);
          localStorage.setItem('admin_refresh_token', response.data.refreshToken);
          
          // Повторяем исходный запрос с новым токеном
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return api(originalRequest);
        }
      } catch {
        // Если не удалось обновить токен, выходим из системы
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_refresh_token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Утилита для обработки ошибок API
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error;
      
      switch (status) {
        case 401:
          return 'Необходима авторизация';
        case 403:
          return 'Доступ запрещен';
        case 404:
          return 'Ресурс не найден';
        case 422:
          return `Ошибка валидации: ${message}`;
        case 429:
          return 'Слишком много запросов';
        case 500:
          return 'Внутренняя ошибка сервера';
        default:
          return message || 'Произошла ошибка';
      }
    }
    return 'Ошибка сети';
  }
  return 'Неизвестная ошибка';
};