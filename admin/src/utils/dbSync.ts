import { db } from '../db/db';

export const syncWithMainDB = async () => {
  try {
    // Синхронизация с основной базой данных
    const mainDB = await window.indexedDB.open('binanceDB', 1);
    
    mainDB.onsuccess = async (event: any) => {
      const database = event.target.result;
      
      // Синхронизация пользователей
      const userStore = database.transaction('users', 'readonly').objectStore('users');
      const users = await new Promise((resolve) => {
        const request = userStore.getAll();
        request.onsuccess = () => resolve(request.result);
      });
      
      // Обновление локальной базы данных
      await db.users.clear();
      await db.users.bulkAdd(users as any[]);
      
      // Синхронизация балансов
      const balanceStore = database.transaction('balances', 'readonly').objectStore('balances');
      const balances = await new Promise((resolve) => {
        const request = balanceStore.getAll();
        request.onsuccess = () => resolve(request.result);
      });
      
      await db.balances.clear();
      await db.balances.bulkAdd(balances as any[]);
      
      console.log('Database synchronization completed');
    };
    
    mainDB.onerror = (error) => {
      console.error('Error syncing with main database:', error);
    };
  } catch (error) {
    console.error('Database sync failed:', error);
  }
};

export const setupAutoSync = () => {
  // Автоматическая синхронизация каждые 5 минут
  setInterval(syncWithMainDB, 5 * 60 * 1000);
  
  // Синхронизация при изменениях в основной базе
  window.addEventListener('storage', (event) => {
    if (event.key?.startsWith('binanceDB')) {
      syncWithMainDB();
    }
  });
};