import { Time } from 'lightweight-charts';
import { memoize } from 'lodash';

// Оптимизированная функция форматирования данных для графиков
export const formatCandlestickData = memoize((data: any[]) => {
  return data.map(k => ({
    time: k[0] / 1000 as Time,
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5])
  }));
}, (data) => JSON.stringify(data.slice(-100)));

// Оптимизированная функция форматирования объема
export const formatVolumeData = memoize((data: any[]) => {
  return data.map(k => ({
    time: k.time,
    value: k.volume,
    color: k.close > k.open ? '#48BB78' : '#F56565',
  }));
}, (data) => JSON.stringify(data.slice(-100)));

// Конфигурация графика с оптимизированными настройками
export const getChartOptions = (darkMode: boolean) => ({
  layout: {
    background: { type: 'solid', color: darkMode ? '#1A202C' : '#FFFFFF' },
    textColor: darkMode ? '#D9D9D9' : '#1A202C',
  },
  grid: {
    vertLines: { color: darkMode ? '#2D3748' : '#E2E8F0' },
    horzLines: { color: darkMode ? '#2D3748' : '#E2E8F0' },
  },
  crosshair: {
    mode: 1,
    vertLine: {
      width: 1,
      color: darkMode ? '#4A5568' : '#A0AEC0',
      style: 3,
    },
    horzLine: {
      width: 1,
      color: darkMode ? '#4A5568' : '#A0AEC0',
      style: 3,
    },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
    borderColor: darkMode ? '#2D3748' : '#E2E8F0',
    fixLeftEdge: true,
    fixRightEdge: true,
  },
  rightPriceScale: {
    borderColor: darkMode ? '#2D3748' : '#E2E8F0',
    scaleMargins: {
      top: 0.1,
      bottom: 0.2,
    },
  },
  handleScale: {
    mouseWheel: true,
    pinch: true,
    axisPressedMouseMove: {
      time: true,
      price: true,
    },
  },
  handleScroll: {
    mouseWheel: true,
    pressedMouseMove: true,
    horzTouchDrag: true,
    vertTouchDrag: true,
  },
});

// Оптимизация обновления данных
export const shouldUpdateChartData = (
  prevData: any[] | undefined, 
  newData: any[] | undefined
): boolean => {
  if (!prevData || !newData) return true;
  if (prevData.length !== newData.length) return true;
  
  // Проверяем только последние 5 свечей
  const lastIndex = newData.length - 1;
  for (let i = 0; i < 5; i++) {
    const index = lastIndex - i;
    if (index < 0) break;
    
    const prev = prevData[index];
    const next = newData[index];
    
    if (!prev || !next) continue;
    
    if (
      prev.time !== next.time ||
      prev.close !== next.close ||
      prev.high !== next.high ||
      prev.low !== next.low
    ) {
      return true;
    }
  }
  
  return false;
};