// Константы для работы с графиками
export const CHART_CONSTANTS = {
  DEFAULT_TIMEFRAME: '15m',
  CANDLE_LIMIT: 1000,
  UPDATE_INTERVAL: 1000,
  ANIMATION_DURATION: 250,
  MIN_CANDLE_WIDTH: 4,
  MAX_CANDLE_WIDTH: 20,
  DEFAULT_VISIBLE_RANGE: 100,
  PRICE_SCALE_WIDTH: 100,
  TIME_SCALE_HEIGHT: 25,
  VOLUME_PANE_HEIGHT: 0.2, // 20% от высоты графика
};

// Константы для работы со стаканом
export const ORDERBOOK_CONSTANTS = {
  DEFAULT_DEPTH: 20,
  UPDATE_INTERVAL: 100,
  GROUP_SIZES: [0.01, 0.1, 1, 10, 100],
  MAX_LEVELS: 100,
  ANIMATION_DURATION: 150,
};

// Константы для работы с историей сделок
export const TRADES_CONSTANTS = {
  UPDATE_INTERVAL: 1000,
  MAX_TRADES: 50,
  ANIMATION_DURATION: 150,
};

// Общие константы
export const COMMON_CONSTANTS = {
  DECIMAL_PLACES: 8,
  PRICE_DECIMAL_PLACES: 2,
  AMOUNT_DECIMAL_PLACES: 6,
  DEFAULT_CURRENCY: 'USDT',
  MIN_NOTIONAL: 10, // Минимальная сумма ордера
};