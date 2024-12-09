import { api } from './api';
import { User, Balance, AuditLog } from '../types';

export const adminService = {
  // Управление пользователями
  users: {
    getList: async () => {
      const response = await api.get('/api/admin/users');
      return response.data;
    },

    getById: async (id: number) => {
      const response = await api.get(`/api/admin/users/${id}`);
      return response.data;
    },

    update: async (id: number, data: Partial<User>) => {
      const response = await api.put(`/api/admin/users/${id}`, data);
      return response.data;
    },

    delete: async (id: number) => {
      const response = await api.delete(`/api/admin/users/${id}`);
      return response.data;
    }
  },

  // Управление балансами
  balances: {
    getList: async () => {
      const response = await api.get('/api/admin/balances');
      return response.data;
    },

    update: async (userId: number, data: Partial<Balance>) => {
      const response = await api.put(`/api/admin/balances/${userId}`, data);
      return response.data;
    }
  },

  // Аудит
  audit: {
    getLogs: async () => {
      const response = await api.get('/api/admin/audit-logs');
      return response.data;
    },

    addLog: async (data: Omit<AuditLog, 'id' | 'timestamp'>) => {
      const response = await api.post('/api/admin/audit-logs', data);
      return response.data;
    }
  },

  // Статистика
  statistics: {
    getDashboardStats: async () => {
      const response = await api.get('/api/admin/statistics/dashboard');
      return response.data;
    },

    getUserStats: async () => {
      const response = await api.get('/api/admin/statistics/users');
      return response.data;
    },

    getTradeStats: async () => {
      const response = await api.get('/api/admin/statistics/trades');
      return response.data;
    }
  }
};