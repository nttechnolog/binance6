import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
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
  const toast = useToast();

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const adminUser = await db.users.where('email').equals(email).first();
      
      if (!adminUser || adminUser.password !== password || !['admin', 'moderator'].includes(adminUser.role)) {
        throw new Error('Неверные учетные данные');
      }

      // Создаем сессию
      await db.auditLogs.add({
        userId: adminUser.id,
        action: 'admin_login',
        details: `Вход в админ-панель: ${adminUser.email}`,
        timestamp: new Date()
      });

      setUser({
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role as 'admin' | 'moderator'
      });

      navigate('/admin');
      
      return adminUser;
    } catch (error) {
      toast({
        title: 'Ошибка авторизации',
        description: error instanceof Error ? error.message : 'Проверьте данные для входа',
        status: 'error',
        duration: 3000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  const logout = useCallback(async () => {
    if (user?.id) {
      await db.auditLogs.add({
        userId: user.id,
        action: 'admin_logout',
        details: `Выход из админ-панели: ${user.email}`,
        timestamp: new Date()
      });
    }
    setUser(null);
    navigate('/admin/login');
  }, [user, navigate]);

  return {
    user,
    isLoading,
    login,
    logout
  };
}