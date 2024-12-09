import { useQuery } from 'react-query';
import { api } from '../utils/api';

export function useTradingPair(symbol: string) {
  const { data: ticker } = useQuery(
    ['ticker', symbol],
    async () => {
      const response = await api.get('/api/v3/ticker/24hr', {
        params: { symbol }
      });
      return response.data;
    },
    {
      refetchInterval: 1000,
      enabled: !!symbol
    }
  );

  const { data: pairs } = useQuery(
    'trading-pairs',
    async () => {
      const response = await api.get('/api/v3/exchangeInfo');
      return response.data.symbols
        .filter((pair: any) => pair.status === 'TRADING')
        .map((pair: any) => ({
          symbol: pair.symbol,
          baseAsset: pair.baseAsset,
          quoteAsset: pair.quoteAsset,
          minPrice: pair.filters.find((f: any) => f.filterType === 'PRICE_FILTER').minPrice,
          maxPrice: pair.filters.find((f: any) => f.filterType === 'PRICE_FILTER').maxPrice,
          tickSize: pair.filters.find((f: any) => f.filterType === 'PRICE_FILTER').tickSize,
          minQty: pair.filters.find((f: any) => f.filterType === 'LOT_SIZE').minQty,
          maxQty: pair.filters.find((f: any) => f.filterType === 'LOT_SIZE').maxQty,
          stepSize: pair.filters.find((f: any) => f.filterType === 'LOT_SIZE').stepSize,
        }));
    },
    {
      staleTime: 60000 * 5, // 5 minutes
      cacheTime: 60000 * 10, // 10 minutes
    }
  );

  return {
    ticker,
    pairs,
    currentPair: pairs?.find((p: any) => p.symbol === symbol)
  };
}