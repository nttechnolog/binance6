import { db } from '../db/db';

export const generateTestUsers = async () => {
  try {
    // Проверяем, есть ли уже тестовые пользователи
    const existingAdmin = await db.users.where('email').equals('admin@example.com').first();
    if (existingAdmin) {
      return;
    }

    // Создаем администратора
    const adminId = await db.users.add({
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Администратор',
      role: 'admin',
      isActive: true,
      isVerified: true,
      createdAt: new Date()
    });

    // Создаем начальные балансы для админа
    const assets = ['BTC', 'ETH', 'USDT', 'BNB'];
    for (const asset of assets) {
      await db.balances.add({
        userId: adminId,
        asset,
        free: asset === 'USDT' ? '10000' : '1',
        locked: '0',
        timestamp: new Date()
      });
    }

    console.log('Тестовый администратор успешно создан');
  } catch (error) {
    console.error('Ошибка при создании тестового администратора:', error);
  }
};