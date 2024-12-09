import { useState } from 'react';
import { db } from '../db/db';
import { useAuthStore } from '../stores/useAuthStore';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuthStore();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await db.initializeDatabase(); // Убедимся, что база данных инициализирована
      
      const foundUser = await db.users.where('email').equals(email).first();
      
      if (!foundUser || foundUser.password !== password) {
        throw new Error('Неверный email или пароль');
      }

      // Добавляем запись в лог аудита
      await db.auditLogs.add({
        userId: foundUser.id!,
        action: 'login',
        details: `Успешный вход пользователя ${foundUser.email}`,
        timestamp: new Date()
      });

      setUser(foundUser);
      return foundUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      await db.initializeDatabase(); // Убедимся, что база данных инициализирована
      
      const exists = await db.users.where('email').equals(email).first();
      if (exists) {
        throw new Error('Пользователь с таким email уже существует');
      }

      const newUser = {
        email,
        password,
        name,
        role: 'user' as const,
        isActive: true,
        createdAt: new Date()
      };

      const id = await db.users.add(newUser);
      const createdUser = await db.users.get(id);
      
      if (!createdUser) {
        throw new Error('Ошибка при создании пользователя');
      }

      // Создаем начальные балансы
      await db.balances.add({
        userId: id,
        asset: 'USDT',
        free: '10000',
        locked: '0',
        timestamp: new Date()
      });

      setUser(createdUser);
      return createdUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (user?.id) {
      await db.auditLogs.add({
        userId: user.id,
        action: 'logout',
        details: `Выход пользователя ${user.email}`,
        timestamp: new Date()
      });
    }
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout
  };
}