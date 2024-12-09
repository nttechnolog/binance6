import React, { createContext, useContext, useState } from 'react';

type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

type TranslationKey = keyof typeof translations.ru;

const translations = {
  ru: {
    'orderbook.title': 'Глубина рынка',
    'orderbook.price': 'Цена',
    'orderbook.amount': 'Количество',
    'orderbook.total': 'Всего',
    'tradehistory.title': 'История сделок',
    'tradehistory.time': 'Время',
    'tradehistory.price': 'Цена',
    'tradehistory.amount': 'Количество',
    'trade.title': 'Лимитные ордера',
    'trade.limit': 'Лимит',
    'trade.market': 'Рынок',
    'trade.stop': 'Лимитный стоп',
    'trade.price': 'Цена',
    'trade.amount': 'Кол.',
    'trade.register': 'Зарегистрируйтесь',
    'trade.login': 'Войдите',
    'widgets.chart': 'График',
    'widgets.marketDepth': 'Глубина рынка',
    'widgets.tradeHistory': 'История сделок',
    'widgets.limitOrders': 'Лимитные ордера',
  },
  en: {
    'orderbook.title': 'Market Depth',
    'orderbook.price': 'Price',
    'orderbook.amount': 'Amount',
    'orderbook.total': 'Total',
    'tradehistory.title': 'Trade History',
    'tradehistory.time': 'Time',
    'tradehistory.price': 'Price',
    'tradehistory.amount': 'Amount',
    'trade.title': 'Limit Orders',
    'trade.limit': 'Limit',
    'trade.market': 'Market',
    'trade.stop': 'Stop-Limit',
    'trade.price': 'Price',
    'trade.amount': 'Amount',
    'trade.register': 'Register',
    'trade.login': 'Login',
    'widgets.chart': 'Chart',
    'widgets.marketDepth': 'Market Depth',
    'widgets.tradeHistory': 'Trade History',
    'widgets.limitOrders': 'Limit Orders',
  },
} as const;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string) => {
    return translations[language][key as TranslationKey] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}