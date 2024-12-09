import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useQuery } from 'react-query';
import axios from 'axios';

interface MarketOverviewProps {
  symbol: string;
  onRemove?: () => void;
}

export function MarketOverview({ symbol, onRemove }: MarketOverviewProps) {
  const { data: marketData } = useQuery(
    ['market-overview', symbol],
    async () => {
      const [ticker, depth] = await Promise.all([
        axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`),
        axios.get(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=5`)
      ]);
      return {
        ticker: ticker.data,
        depth: depth.data
      };
    },
    { refetchInterval: 1000 }
  );

  const { data: topMovers } = useQuery(
    'top-movers',
    async () => {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
      return response.data
        .filter((item: any) => item.symbol.endsWith('USDT'))
        .sort((a: any, b: any) => Math.abs(parseFloat(b.priceChangePercent)) - Math.abs(parseFloat(a.priceChangePercent)))
        .slice(0, 5);
    },
    { refetchInterval: 5000 }
  );

  return (
    <Box h="100%" bg="gray.800" borderRadius="lg" overflow="hidden">
      <VStack spacing={0} h="100%">
        <HStack w="100%" justify="space-between" p={2} borderBottom="1px" borderColor="gray.700" className="widget-header">
          <Text fontSize="sm" fontWeight="medium">Обзор рынка</Text>
          {onRemove && (
            <IconButton
              aria-label="Удалить виджет"
              icon={<CloseIcon />}
              size="xs"
              variant="ghost"
              onClick={onRemove}
            />
          )}
        </HStack>

        <Box p={4} w="100%">
          <VStack spacing={4} align="stretch">
            {marketData?.ticker && (
              <>
                <Box>
                  <Text color="gray.400" fontSize="sm">Последняя цена</Text>
                  <HStack spacing={2}>
                    <Text fontSize="xl" fontWeight="bold">
                      ${Number(marketData.ticker.lastPrice).toFixed(2)}
                    </Text>
                    <Badge
                      colorScheme={Number(marketData.ticker.priceChangePercent) >= 0 ? 'green' : 'red'}
                    >
                      {Number(marketData.ticker.priceChangePercent).toFixed(2)}%
                    </Badge>
                  </HStack>
                </Box>

                <HStack justify="space-between">
                  <Box>
                    <Text color="gray.400" fontSize="sm">24ч Объём</Text>
                    <Text>${Number(marketData.ticker.volume).toLocaleString()}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.400" fontSize="sm">24ч Макс</Text>
                    <Text>${Number(marketData.ticker.highPrice).toFixed(2)}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.400" fontSize="sm">24ч Мин</Text>
                    <Text>${Number(marketData.ticker.lowPrice).toFixed(2)}</Text>
                  </Box>
                </HStack>
              </>
            )}

            <Box>
              <Text color="gray.400" fontSize="sm" mb={2}>Топ движения</Text>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Пара</Th>
                    <Th isNumeric>Цена</Th>
                    <Th isNumeric>Изменение</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {topMovers?.map((mover: any) => (
                    <Tr key={mover.symbol}>
                      <Td>{mover.symbol.replace('USDT', '')}</Td>
                      <Td isNumeric>${Number(mover.lastPrice).toFixed(2)}</Td>
                      <Td isNumeric>
                        <Text
                          color={Number(mover.priceChangePercent) >= 0 ? 'green.400' : 'red.400'}
                        >
                          {Number(mover.priceChangePercent).toFixed(2)}%
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}