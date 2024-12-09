import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';
import theme from './theme';
import { generateTestUsers } from './utils/testData';

// Инициализируем тестовых пользователей при запуске
generateTestUsers().catch(console.error);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 30000,
      cacheTime: 60000,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);