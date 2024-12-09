import { Decimal } from 'decimal.js';

// Форматирование баланса с учетом значимых цифр
export const formatBalance = (balance: string, decimals: number = 8): string => {
  try {
    const value = new Decimal(balance);
    if (value.isZero()) return '0';
    
    // Для маленьких значений показываем больше десятичных знаков
    if (value.lessThan('0.0001')) {
      return value.toFixed(8);
    }
    
    // Для средних значений
    if (value.lessThan('1')) {
      return value.toFixed(6);
    }
    
    // Для больших значений
    return value.toFixed(decimals);
  } catch {
    return '0';
  }
};

// Расчет стоимости в BTC
export const calculateBtcValue = (
  asset: string,
  amount: string,
  prices: Record<string, string>
): string => {
  try {
    if (asset === 'BTC') return amount;
    
    const decimal = new Decimal(amount);
    const btcPair = `${asset}BTC`;
    const usdtPair = `${asset}USDT`;
    
    if (prices[btcPair]) {
      return decimal.times(prices[btcPair]).toString();
    }
    
    if (prices[usdtPair] && prices['BTCUSDT']) {
      const usdtValue = decimal.times(prices[usdtPair]);
      return usdtValue.div(prices['BTCUSDT']).toString();
    }
    
    return '0';
  } catch {
    return '0';
  }
};

// Проверка минимального баланса для отображения
export const isSignificantBalance = (btcValue: string): boolean => {
  try {
    return new Decimal(btcValue).greaterThan('0.0001');
  } catch {
    return false;
  }
};

// Расчет доступного лимита на вывод
export const calculateAvailableWithdrawal = (
  limit: string,
  withdrawn: string
): string => {
  try {
    const limitDecimal = new Decimal(limit);
    const withdrawnDecimal = new Decimal(withdrawn);
    const available = limitDecimal.minus(withdrawnDecimal);
    return available.isNegative() ? '0' : available.toString();
  } catch {
    return '0';
  }
};