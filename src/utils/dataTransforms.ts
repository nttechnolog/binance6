import { memoize } from 'lodash';
import Decimal from 'decimal.js';

// Оптимизированное форматирование цен
export const formatPrice = memoize((price: string | number, decimals: number = 2): string => {
  try {
    return new Decimal(price).toFixed(decimals);
  } catch {
    return '0.00';
  }
});

// Оптимизированное форматирование объема
export const formatVolume = memoize((volume: string | number): string => {
  try {
    const num = new Decimal(volume);
    if (num.gte(1000000000)) {
      return `${num.dividedBy(1000000000).toFixed(2)}B`;
    }
    if (num.gte(1000000)) {
      return `${num.dividedBy(1000000).toFixed(2)}M`;
    }
    if (num.gte(1000)) {
      return `${num.dividedBy(1000).toFixed(2)}K`;
    }
    return num.toFixed(2);
  } catch {
    return '0.00';
  }
});

// Оптимизированное форматирование процентов
export const formatPercent = memoize((percent: string | number): string => {
  try {
    const num = new Decimal(percent);
    return `${num.gte(0) ? '+' : ''}${num.toFixed(2)}%`;
  } catch {
    return '0.00%';
  }
});

// Оптимизированная группировка данных стакана
export const groupOrderBookLevels = memoize((levels: [string, string][], groupSize: number): [string, string][] => {
  const grouped: { [key: string]: Decimal } = {};
  
  levels.forEach(([price, amount]) => {
    const roundedPrice = new Decimal(price).dividedToIntegerBy(groupSize).times(groupSize);
    const key = roundedPrice.toString();
    grouped[key] = (grouped[key] || new Decimal(0)).plus(amount);
  });
  
  return Object.entries(grouped).map(([price, amount]) => [
    price,
    amount.toString()
  ]);
}, (levels, groupSize) => `${JSON.stringify(levels.slice(-20))}-${groupSize}`);