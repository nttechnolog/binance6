import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { api } from '../utils/api';
import { generateTestUsers } from '../utils/testData';

const INITIAL_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];

export function useInitialLoad() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Use useEffect with proper cleanup
  useEffect(() => {
    let mounted = true;

    const initializeTestData = async () => {
      if (isLoading && mounted) {
        try {
          await generateTestUsers();
        } catch (err) {
          console.error('Error generating test data:', err);
        }
      }
    };

    initializeTestData();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [isLoading]);

  const { data: initialData, isLoading: isLoadingInitial } = useQuery(
    'initial-data',
    async () => {
      try {
        setProgress(20);
        
        const response = await api.get('/api/v3/ticker/price', {
          params: {
            symbols: JSON.stringify(INITIAL_SYMBOLS)
          }
        });

        if (!response.data) {
          throw new Error('Нет данных от API');
        }

        setProgress(100);
        return response.data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        console.error('Error loading initial data:', errorMessage);
        setError('Ошибка при загрузке данных. Пожалуйста, обновите страницу.');
        throw error;
      }
    },
    {
      retry: 1,
      retryDelay: 1000,
      staleTime: 30000,
      cacheTime: 60000,
      refetchOnWindowFocus: false,
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        setError(`Ошибка при загрузке данных: ${errorMessage}`);
      }
    }
  );

  useEffect(() => {
    if (!isLoadingInitial && initialData) {
      setIsLoading(false);
    }
  }, [isLoadingInitial, initialData]);

  return { 
    isLoading, 
    progress, 
    error,
    data: initialData 
  };
}