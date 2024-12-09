import React from 'react';
import {
  VStack,
  HStack,
  Text,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { api } from '../../utils/api';

interface CoinData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
}

export function PopularCoins() {
  const { data: popularCoins } = useQuery<CoinData[]>(
    'popular-coins',
    async () => {
      const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT'];
      const response = await api.get('/api/v3/ticker/24hr', {
        params: { symbols: JSON.stringify(symbols) }
      });
      return response.data;
    },
    { 
      refetchInterval: 30000,
      staleTime: 15000,
      cacheTime: 60000,
      retry: 2,
    }
  );

  const { data: newListings } = useQuery<CoinData[]>(
    'new-listings',
    async () => {
      const response = await api.get('/api/v3/ticker/24hr');
      return response.data
        .filter((item: CoinData) => item.symbol.endsWith('USDT'))
        .sort((a: CoinData, b: CoinData) => 
          parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
        )
        .slice(0, 5);
    },
    { 
      refetchInterval: 60000,
      staleTime: 30000,
      cacheTime: 120000,
      retry: 2,
    }
  );

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return num < 1 ? num.toFixed(6) : num.toFixed(2);
  };

  const formatPercent = (percent: string) => {
    return parseFloat(percent).toFixed(2);
  };

  const renderCoinTable = (coins: CoinData[] = []) => (
    <Table variant="simple" size="sm">
      <Thead>
        <Tr>
          <Th>Название</Th>
          <Th isNumeric>Цена USDT</Th>
          <Th isNumeric>24ч %</Th>
        </Tr>
      </Thead>
      <Tbody>
        {coins.map((coin) => (
          <Tr key={coin.symbol} _hover={{ bg: 'gray.700', cursor: 'pointer' }}>
            <Td>
              <HStack>
                <Image
                  src={`https://bin.bnbstatic.com/image/crypto/${coin.symbol.toLowerCase().replace('usdt', '')}.png`}
                  boxSize="24px"
                  fallbackSrc="https://bin.bnbstatic.com/static/images/common/favicon.ico"
                />
                <Text>{coin.symbol.replace('USDT', '')}</Text>
              </HStack>
            </Td>
            <Td isNumeric>{formatPrice(coin.lastPrice)}</Td>
            <Td 
              isNumeric
              color={parseFloat(coin.priceChangePercent) >= 0 ? 'green.400' : 'red.400'}
            >
              {formatPercent(coin.priceChangePercent)}%
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  return (
    <VStack align="stretch" bg="gray.800" p={6} borderRadius="lg">
      <Tabs variant="unstyled">
        <HStack justify="space-between" mb={4}>
          <TabList>
            <Tab
              _selected={{
                color: 'yellow.400',
                borderBottom: '2px solid',
                borderColor: 'yellow.400'
              }}
              _hover={{ color: 'yellow.400' }}
            >
              Популярное
            </Tab>
            <Tab
              _selected={{
                color: 'yellow.400',
                borderBottom: '2px solid',
                borderColor: 'yellow.400'
              }}
              _hover={{ color: 'yellow.400' }}
            >
              Новый листинг
            </Tab>
          </TabList>
          <Link color="gray.400" fontSize="sm">Все 350+ монет</Link>
        </HStack>

        <TabPanels>
          <TabPanel p={0}>
            {renderCoinTable(popularCoins)}
          </TabPanel>
          <TabPanel p={0}>
            {renderCoinTable(newListings)}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}