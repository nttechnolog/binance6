import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { orderService } from '../services/orderService';
import { useAuthStore } from '../stores/useAuthStore';
import { useQueryClient } from 'react-query';
import { Decimal } from 'decimal.js';

export function useOrderExecution() {
  const [isExecuting, setIsExecuting] = useState(false);
  const { user } = useAuthStore();
  const toast = useToast();
  const queryClient = useQueryClient();

  const validateOrder = useCallback(({
    symbol,
    side,
    type,
    price,
    amount,
    stopPrice,
    stopLoss,
    takeProfit
  }: {
    symbol: string;
    side: 'buy' | 'sell';
    type: 'limit' | 'market' | 'stop' | 'stop_limit';
    price: string;
    amount: string;
    stopPrice?: string;
    stopLoss?: string;
    takeProfit?: string;
  }) => {
    // Проверка обязательных полей
    if (!symbol || !side || !type || !amount) {
      throw new Error('Не все обязательные поля заполнены');
    }

    // Проверка объема
    const amountDecimal = new Decimal(amount);
    if (amountDecimal.isNaN() || amountDecimal.isZero() || amountDecimal.isNegative()) {
      throw new Error('Некорректный объем');
    }

    // Проверка цены для лимитных ордеров
    if (type === 'limit' && (!price || new Decimal(price).isNaN())) {
      throw new Error('Некорректная цена');
    }

    // Проверка стоп-цены
    if ((type === 'stop' || type === 'stop_limit') && (!stopPrice || new Decimal(stopPrice).isNaN())) {
      throw new Error('Некорректная стоп-цена');
    }

    // Проверка стоп-лосс и тейк-профит
    if (stopLoss && new Decimal(stopLoss).isNaN()) {
      throw new Error('Некорректный стоп-лосс');
    }
    if (takeProfit && new Decimal(takeProfit).isNaN()) {
      throw new Error('Некорректный тейк-профит');
    }
  }, []);

  const executeOrder = useCallback(async ({
    symbol,
    side,
    type,
    price,
    amount,
    stopPrice,
    stopLoss,
    takeProfit,
    expiresAt
  }: {
    symbol: string;
    side: 'buy' | 'sell';
    type: 'limit' | 'market' | 'stop' | 'stop_limit';
    price: string;
    amount: string;
    stopPrice?: string;
    stopLoss?: string;
    takeProfit?: string;
    expiresAt?: Date;
  }) => {
    if (!user?.id) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо авторизоваться',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      validateOrder({
        symbol,
        side,
        type,
        price,
        amount,
        stopPrice,
        stopLoss,
        takeProfit
      });
    } catch (error) {
      toast({
        title: 'Ошибка валидации',
        description: error instanceof Error ? error.message : 'Проверьте параметры ордера',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsExecuting(true);

    try {
      const order = await orderService.createOrder({
        userId: user.id,
        symbol,
        side,
        type,
        price,
        amount,
        stopPrice,
        stopLoss,
        takeProfit,
        expiresAt
      });

      // Обновляем кэш
      queryClient.invalidateQueries(['orders', user.id]);
      queryClient.invalidateQueries(['balances', user.id]);
      queryClient.invalidateQueries(['trades', user.id]);

      toast({
        title: 'Ордер создан',
        description: `${side === 'buy' ? 'Покупка' : 'Продажа'} ${amount} ${symbol} по цене ${price}`,
        status: 'success',
        duration: 3000,
      });

      return order;
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось создать ордер',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsExecuting(false);
    }
  }, [user, toast, queryClient, validateOrder]);

  const cancelOrder = useCallback(async (orderId: string) => {
    if (!user?.id) return;

    try {
      await orderService.cancelOrder(orderId, user.id);
      
      queryClient.invalidateQueries(['orders', user.id]);
      queryClient.invalidateQueries(['balances', user.id]);

      toast({
        title: 'Ордер отменен',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось отменить ордер',
        status: 'error',
        duration: 3000,
      });
    }
  }, [user, toast, queryClient]);

  return {
    executeOrder,
    cancelOrder,
    isExecuting
  };
}