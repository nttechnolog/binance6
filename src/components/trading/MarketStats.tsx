import React from 'react';
import { Box, Grid, Text, HStack, Flex, Stat, StatNumber, StatArrow } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import axios from 'axios';

interface MarketStatsProps {
  symbol: string;
}

export function MarketStats({ symbol }: MarketStatsProps) {
  const { data: ticker } = useQuery(
    ['ticker', symbol],
    async () => {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr', {
        params: { symbol }
      });
      return response.data;
    },
    { refetchInterval: 1000 }
  );

  const { data: markPrice } = useQuery(
    ['markPrice', symbol],
    async () => {
      const response = await axios.get('https://fapi.binance.com/fapi/v1/premiumIndex', {
        params: { symbol }
      });
      return response.data;
    },
    { refetchInterval: 1000 }
  );

  const { data: openInterest } = useQuery(
    ['openInterest', symbol],
    async () => {
      const response = await axios.get('https://fapi.binance.com/fapi/v1/openInterest', {
        params: { symbol }
      });
      return response.data;
    },
    { refetchInterval: 5000 }
  );

  return (
    <Box bg="gray.800" p={2}>
      <Flex direction="column" gap={2}>
        <HStack spacing={4} align="center">
          <Text fontSize="xl" fontWeight="bold">{symbol} Бесср</Text>
          <Stat>
            <StatNumber fontSize="xl" color={Number(ticker?.priceChangePercent) >= 0 ? 'green.400' : 'red.400'}>
              {Number(ticker?.lastPrice).toFixed(1)}
              <StatArrow type={Number(ticker?.priceChangePercent) >= 0 ? 'increase' : 'decrease'} />
              {Number(ticker?.priceChangePercent).toFixed(2)}%
            </StatNumber>
          </Stat>
        </HStack>

        <Grid templateColumns="repeat(auto-fit, minmax(160px, 1fr))" gap={4} fontSize="sm">
          <Box>
            <Text color="gray.400">Маркировка</Text>
            <Text>{Number(markPrice?.markPrice).toFixed(1)}</Text>
          </Box>
          <Box>
            <Text color="gray.400">Индекс</Text>
            <Text>{Number(markPrice?.indexPrice).toFixed(1)}</Text>
          </Box>
          <Box>
            <Text color="gray.400">Ставка / Осталось</Text>
            <Text>{(Number(markPrice?.interestRate) * 100).toFixed(4)}% / {markPrice?.nextFundingTime}</Text>
          </Box>
          <Box>
            <Text color="gray.400">Макс 24ч</Text>
            <Text>{Number(ticker?.highPrice).toFixed(1)}</Text>
          </Box>
          <Box>
            <Text color="gray.400">Мин 24ч</Text>
            <Text>{Number(ticker?.lowPrice).toFixed(1)}</Text>
          </Box>
          <Box>
            <Text color="gray.400">Объем 24ч(BTC)</Text>
            <Text>{Number(ticker?.volume).toFixed(2)}</Text>
          </Box>
          <Box>
            <Text color="gray.400">Объем 24ч(USDT)</Text>
            <Text>{Number(ticker?.quoteVolume).toLocaleString()}</Text>
          </Box>
          <Box>
            <Text color="gray.400">Сумма открытых позиций(USDT)</Text>
            <Text>{Number(openInterest?.openInterest).toLocaleString()}</Text>
          </Box>
        </Grid>
      </Flex>
    </Box>
  );
}