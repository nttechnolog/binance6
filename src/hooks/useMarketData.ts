import { useQuery } from 'react-query';
import { api } from '../utils/api';

export function useMarketData() {
  // Загружаем популярные монеты с обработкой ошибок
  const { data: popularCoins } = useQuery(
    'popular-coins',
    async () => {
      try {
        const response = await api.get('/api/v3/ticker/24hr', {
          params: { 
            symbols: JSON.stringify(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT'])
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching popular coins:', error);
        return [];
      }
    },
    { 
      refetchInterval: 30000,
      staleTime: 15000,
      cacheTime: 60000,
      retry: 2,
      onError: (error) => {
        console.error('Popular coins query error:', error);
      }
    }
  );

  // Загружаем новые листинги с обработкой ошибок
  const { data: newListings } = useQuery(
    'new-listings',
    async () => {
      try {
        const response = await api.get('/api/v3/ticker/24hr');
        return response.data
          .filter((item: any) => item.symbol.endsWith('USDT'))
          .sort((a: any, b: any) => 
            parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
          )
          .slice(0, 5);
      } catch (error) {
        console.error('Error fetching new listings:', error);
        return [];
      }
    },
    { 
      refetchInterval: 60000,
      staleTime: 30000,
      cacheTime: 120000,
      retry: 2,
      onError: (error) => {
        console.error('New listings query error:', error);
      }
    }
  );

  const mockNews = {
    cryptoCompare: [],
    coinGecko: []
  };

  return {
    popularCoins: popularCoins || [],
    newListings: newListings || [],
    news: mockNews
  };
}