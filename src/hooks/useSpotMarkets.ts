import { useQuery } from 'react-query';
import { api } from '../utils/api';

const SUPPORTED_BASE_ASSETS = ['USDT', 'BTC', 'ETH', 'BNB'];

export function useSpotMarkets() {
  return useQuery(
    'spot-markets',
    async () => {
      const response = await api.get('/api/v3/ticker/24hr');
      return response.data
        .filter((item: any) => 
          SUPPORTED_BASE_ASSETS.some(asset => item.symbol.endsWith(asset))
        )
        .sort((a: any, b: any) => parseFloat(b.volume) - parseFloat(a.volume));
    },
    {
      refetchInterval: 5000,
      staleTime: 2000,
      cacheTime: 10000,
      retry: 3,
    }
  );
}