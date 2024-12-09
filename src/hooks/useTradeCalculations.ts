import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Decimal } from 'decimal.js';
import { db } from '../db/db';
import { useAuth } from './useAuth';
import { api } from '../utils/api';

export function useTradeCalculations(symbol: string) {
  const { user } = useAuth();
  const [maxAmount, setMaxAmount] = useState<string>('0');
  const [maxTotal, setMaxTotal] = useState<string>('0');

  // Получаем балансы пользователя
  const { data: balances } = useQuery(
    ['balances', user?.id],
    async () => {
      if (!user?.id) return null;
      return db.balances.where('userId').equals(user.id).toArray();
    },
    { enabled: !!user?.id }
  );

  // Получаем текущую цену
  const { data: ticker } = useQuery(
    ['ticker', symbol],
    async () => {
      const response = await api.get(`/api/v3/ticker/price?symbol=${symbol}`);
      return response.data;
    },
    { refetchInterval: 1000 }
  );

  // Рассчитываем максимально доступные суммы
  useEffect(() => {
    if (!balances || !ticker?.price) return;

    const [baseAsset] = symbol.split('USDT');
    const baseBalance = balances.find(b => b.asset === baseAsset);
    const quoteBalance = balances.find(b => b.asset === 'USDT');

    if (baseBalance) {
      setMaxAmount(baseBalance.free);
    }

    if (quoteBalance && ticker.price) {
      try {
        const maxQuote = new Decimal(quoteBalance.free);
        const price = new Decimal(ticker.price);
        if (!price.isZero()) {
          setMaxTotal(maxQuote.dividedBy(price).toFixed(8));
        }
      } catch (error) {
        console.error('Error calculating maxTotal:', error);
        setMaxTotal('0');
      }
    }
  }, [balances, ticker, symbol]);

  // Рассчитываем сумму по проценту от максимума
  const calculateAmountByPercentage = (percentage: number, isBuy: boolean): string => {
    try {
      const max = isBuy ? maxTotal : maxAmount;
      if (!max || percentage < 0 || percentage > 100) return '0';
      return new Decimal(max).mul(percentage).div(100).toFixed(8);
    } catch {
      return '0';
    }
  };

  // Рассчитываем процент от максимума
  const calculatePercentage = (amount: string, isBuy: boolean): number => {
    try {
      const max = isBuy ? maxTotal : maxAmount;
      if (!max || !amount) return 0;
      const maxDecimal = new Decimal(max);
      if (maxDecimal.isZero()) return 0;
      return new Decimal(amount).div(maxDecimal).mul(100).toNumber();
    } catch {
      return 0;
    }
  };

  return {
    maxAmount,
    maxTotal,
    calculateAmountByPercentage,
    calculatePercentage
  };
}