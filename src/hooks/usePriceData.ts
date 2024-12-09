import { useState, useEffect } from 'react';
import axios from 'axios';

interface PriceData {
  symbol: string;
  price: string;
}

export function usePriceData() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price', {
          params: {
            symbols: '["BTCUSDT","ETHUSDT","BNBUSDT","SOLUSDT","DOGEUSDT","ADAUSDT"]'
          }
        });
        setPrices(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch price data');
        console.error(err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 2000);

    return () => clearInterval(interval);
  }, []);

  return { prices, error };
}