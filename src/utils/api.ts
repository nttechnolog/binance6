import axios from 'axios';
import { API_URL, ADMIN_API_KEY } from '../config/constants';

// Основной API клиент для Binance
export const api = axios.create({
  baseURL: 'https://api.binance.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// API клиент для админ-панели
export const adminApi = axios.create({
  baseURL: '/api', // Используем относительный путь
  headers: {
    'Content-Type': 'application/json',
    'X-Admin-API-Key': ADMIN_API_KEY
  }
});

// Перехватчик для добавления токена авторизации
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Перехватчик для обработки ошибок
adminApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      // Обработка ошибки доступа
      console.warn('Access denied:', error.response.data);
    }
    return Promise.reject(error);
  }
);

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