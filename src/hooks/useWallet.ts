import { useQuery, useMutation, useQueryClient } from 'react-query';
import { db } from '../db/db';
import { useAuthStore } from '../stores/useAuthStore';
import { Decimal } from 'decimal.js';

interface Balance {
  asset: string;
  free: string;
  locked: string;
  btcValue: string;
}

export function useWallet() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Получение балансов пользователя
  const { data: balances, isLoading } = useQuery(
    ['balances', user?.id],
    async () => {
      if (!user?.id) return [];
      return db.balances.where('userId').equals(user.id).toArray();
    },
    {
      enabled: !!user?.id,
      staleTime: 1000,
      cacheTime: 5000,
    }
  );

  // Получение курсов валют для расчета общего баланса
  const { data: prices } = useQuery(
    'prices',
    async () => {
      const response = await fetch('https://api.binance.com/api/v3/ticker/price');
      const data = await response.json();
      return data.reduce((acc: any, curr: any) => {
        acc[curr.symbol] = curr.price;
        return acc;
      }, {});
    },
    {
      refetchInterval: 5000,
      staleTime: 1000,
    }
  );

  // Мутация для обновления баланса
  const updateBalance = useMutation(
    async ({ asset, amount, type }: { asset: string; amount: string; type: 'credit' | 'debit' }) => {
      if (!user?.id) throw new Error('Пользователь не авторизован');

      const balance = await db.balances
        .where(['userId', 'asset'])
        .equals([user.id, asset])
        .first();

      if (!balance) {
        // Создаем новый баланс, если его нет
        await db.balances.add({
          userId: user.id,
          asset,
          free: type === 'credit' ? amount : '0',
          locked: '0',
          timestamp: new Date()
        });
      } else {
        // Обновляем существующий баланс
        const currentFree = new Decimal(balance.free);
        const updateAmount = new Decimal(amount);
        
        const newFree = type === 'credit' 
          ? currentFree.plus(updateAmount)
          : currentFree.minus(updateAmount);

        if (newFree.isNegative()) {
          throw new Error('Недостаточно средств');
        }

        await db.balances.update(balance.id!, {
          free: newFree.toString(),
          timestamp: new Date()
        });
      }

      // Добавляем запись в историю транзакций
      await db.transactions.add({
        userId: user.id,
        type: type === 'credit' ? 'deposit' : 'withdrawal',
        asset,
        amount,
        fee: '0',
        status: 'completed',
        description: type === 'credit' ? 'Пополнение демо-счета' : 'Списание с демо-счета',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Инвалидируем кеш балансов
      queryClient.invalidateQueries(['balances', user.id]);
    }
  );

  // Функция для расчета общего баланса в BTC
  const calculateTotalBalance = (): string => {
    if (!balances || !prices) return '0';

    return balances.reduce((total, balance) => {
      if (balance.asset === 'BTC') {
        return total.plus(balance.free);
      }

      const btcPair = `${balance.asset}BTC`;
      const usdtPair = `${balance.asset}USDT`;
      
      if (prices[btcPair]) {
        return total.plus(new Decimal(balance.free).times(prices[btcPair]));
      } else if (prices[usdtPair] && prices['BTCUSDT']) {
        const usdtValue = new Decimal(balance.free).times(prices[usdtPair]);
        return total.plus(usdtValue.div(prices['BTCUSDT']));
      }

      return total;
    }, new Decimal(0)).toString();
  };

  // Функция для проверки достаточности средств
  const hasSufficientFunds = (asset: string, amount: string): boolean => {
    if (!balances) return false;
    
    const balance = balances.find(b => b.asset === asset);
    if (!balance) return false;

    try {
      return new Decimal(balance.free).greaterThanOrEqualTo(amount);
    } catch {
      return false;
    }
  };

  // Функция для блокировки средств при создании ордера
  const lockFunds = async (asset: string, amount: string) => {
    if (!user?.id) throw new Error('Пользователь не авторизован');

    const balance = await db.balances
      .where(['userId', 'asset'])
      .equals([user.id, asset])
      .first();

    if (!balance) throw new Error('Баланс не найден');

    const free = new Decimal(balance.free);
    const locked = new Decimal(balance.locked);
    const lockAmount = new Decimal(amount);

    if (free.lessThan(lockAmount)) {
      throw new Error('Недостаточно средств');
    }

    await db.balances.update(balance.id!, {
      free: free.minus(lockAmount).toString(),
      locked: locked.plus(lockAmount).toString(),
      timestamp: new Date()
    });

    queryClient.invalidateQueries(['balances', user.id]);
  };

  // Функция для разблокировки средств при отмене/исполнении ордера
  const unlockFunds = async (asset: string, amount: string) => {
    if (!user?.id) throw new Error('Пользователь не авторизован');

    const balance = await db.balances
      .where(['userId', 'asset'])
      .equals([user.id, asset])
      .first();

    if (!balance) throw new Error('Баланс не найден');

    const free = new Decimal(balance.free);
    const locked = new Decimal(balance.locked);
    const unlockAmount = new Decimal(amount);

    if (locked.lessThan(unlockAmount)) {
      throw new Error('Некорректное состояние блокировки');
    }

    await db.balances.update(balance.id!, {
      free: free.plus(unlockAmount).toString(),
      locked: locked.minus(unlockAmount).toString(),
      timestamp: new Date()
    });

    queryClient.invalidateQueries(['balances', user.id]);
  };

  return {
    balances,
    isLoading,
    updateBalance,
    calculateTotalBalance,
    hasSufficientFunds,
    lockFunds,
    unlockFunds
  };
}