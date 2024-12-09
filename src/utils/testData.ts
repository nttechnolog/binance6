import { db } from '../db/db';

export const generateTestUsers = async () => {
  try {
    await db.initializeDatabase(); // Убедимся, что база данных инициализирована

    // Проверяем, есть ли уже тестовые пользователи
    const existingUsers = await db.users.count();
    if (existingUsers > 0) {
      return;
    }

    // Создаем администратора
    const adminUser = {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Администратор',
      role: 'admin' as const,
      isActive: true,
      isVerified: true,
      createdAt: new Date()
    };

    const adminId = await db.users.add(adminUser);

    // Создаем тестового пользователя
    const testUser = {
      email: 'test@example.com',
      password: 'test123',
      name: 'Тестовый Пользователь',
      role: 'user' as const,
      isActive: true,
      isVerified: true,
      createdAt: new Date()
    };

    const testUserId = await db.users.add(testUser);

    // Создаем начальные балансы для обоих пользователей
    const assets = ['BTC', 'ETH', 'USDT', 'BNB'];
    
    for (const userId of [adminId, testUserId]) {
      for (const asset of assets) {
        await db.balances.add({
          userId,
          asset,
          free: asset === 'USDT' ? '10000' : '1',
          locked: '0',
          timestamp: new Date()
        });
      }
    }

    console.log('Тестовые пользователи успешно созданы');
  } catch (error) {
    console.error('Ошибка при создании тестовых пользователей:', error);
  }
};