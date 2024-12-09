import { adminApi } from '../utils/api';
import { ENDPOINTS } from '../config/constants';

export const adminService = {
  // Управление пользователями
  users: {
    getList: async (params?: any) => {
      const response = await adminApi.get(ENDPOINTS.USERS.LIST, { params });
      return response.data;
    },
    
    getDetails: async (id: number) => {
      const url = ENDPOINTS.USERS.DETAILS.replace(':id', id.toString());
      const response = await adminApi.get(url);
      return response.data;
    },
    
    update: async (id: number, data: any) => {
      const url = ENDPOINTS.USERS.UPDATE.replace(':id', id.toString());
      const response = await adminApi.put(url, data);
      return response.data;
    },
    
    delete: async (id: number) => {
      const url = ENDPOINTS.USERS.DELETE.replace(':id', id.toString());
      const response = await adminApi.delete(url);
      return response.data;
    }
  },

  // Управление балансами
  balances: {
    getList: async (params?: any) => {
      const response = await adminApi.get(ENDPOINTS.BALANCES.LIST, { params });
      return response.data;
    },
    
    update: async (id: number, data: any) => {
      const url = ENDPOINTS.BALANCES.UPDATE.replace(':id', id.toString());
      const response = await adminApi.put(url, data);
      return response.data;
    }
  },

  // Аудит
  audit: {
    getLogs: async (params?: any) => {
      const response = await adminApi.get(ENDPOINTS.AUDIT.LOGS, { params });
      return response.data;
    },
    
    exportLogs: async (params?: any) => {
      const response = await adminApi.get(ENDPOINTS.AUDIT.EXPORT, {
        params,
        responseType: 'blob'
      });
      return response.data;
    }
  }
};