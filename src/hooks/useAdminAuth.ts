import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ADMIN_JWT_SECRET } from '../config/constants';
import { db } from '../db/db';

interface AdminUser {
  id: number;
  email: string;
  role: 'admin' | 'moderator';
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const adminUser = await db.users
        .where('email')
        .equals(email)
        .and(user => user.role === 'admin' || user.role === 'moderator')
        .first();

      if (!adminUser || adminUser.password !== password) {
        throw new Error('Неверные учетные данные');
      }

      const token = jwt.sign(
        { id: adminUser.id, email: adminUser.email, role: adminUser.role },
        ADMIN_JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      localStorage.setItem('admin_token', token);

      const decoded = jwtDecode<AdminUser>(token);
      setUser(decoded);

      await db.auditLogs.add({
        userId: adminUser.id,
        action: 'admin_login',
        details: `Вход в админ-панель: ${adminUser.email}`,
        timestamp: new Date()
      });

      return decoded;
    } catch (error) {
      throw new Error('Ошибка авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    setUser(null);
    navigate('/admin/login');
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return null;

    try {
      const response = await adminApi.post('/api/admin/auth/verify', { token });
      const decoded = jwtDecode<AdminUser>(token);
      setUser(decoded);
      return decoded;
    } catch {
      logout();
      return null;
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
    checkAuth
  };
}