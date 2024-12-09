export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173';
export const ADMIN_JWT_SECRET = import.meta.env.VITE_ADMIN_JWT_SECRET || 'your-secret-key';
export const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || 'admin-api-key';

export const AUTH_CONFIG = {
  TOKEN_EXPIRY: '24h',
  REFRESH_TOKEN_EXPIRY: '7d',
  PASSWORD_SALT_ROUNDS: 10
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/admin/auth/login',
    REFRESH: '/api/admin/auth/refresh',
    VERIFY: '/api/admin/auth/verify'
  },
  USERS: {
    LIST: '/api/admin/users',
    DETAILS: '/api/admin/users/:id',
    UPDATE: '/api/admin/users/:id',
    DELETE: '/api/admin/users/:id'
  },
  BALANCES: {
    LIST: '/api/admin/balances',
    UPDATE: '/api/admin/balances/:id'
  },
  AUDIT: {
    LOGS: '/api/admin/audit-logs',
    EXPORT: '/api/admin/audit-logs/export'
  }
};