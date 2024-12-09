import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  Divider,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import axios from 'axios';

interface PairHeaderProps {
  symbol: string;
}

export function PairHeader({ symbol }: PairHeaderProps) {
  const { data: ticker } = useQuery(
    ['ticker', symbol],
    async () => {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr', {
        params: { symbol }
      });
      return response.data;
    },
    {
      refetchInterval: 1000,
      enabled: !!symbol
    }
  );

  const { data: markPrice } = useQuery(
    ['markPrice', symbol],
    async () => {
      const response = await axios.get('https://fapi.binance.com/fapi/v1/premiumIndex', {
        params: { symbol }
      });
      return response.data;
    },
    {
      refetchInterval: 1000,
      enabled: !!symbol
    }
  );

  const { data: openInterest } = useQuery(
    ['openInterest', symbol],
    async () => {
      const response = await axios.get('https://fapi.binance.com/fapi/v1/openInterest', {
        params: { symbol }
      });
      return response.data;
    },
    {
      refetchInterval: 5000,
      enabled: !!symbol
    }
  );

  return (
    <Box bg="gray.800" p={4} borderRadius="lg" mb={4}>
      <Flex direction="column" gap={4}>
        <HStack spacing={4} align="flex-start">
          <Box>
            <HStack spacing={4} mb={2}>
              <Text fontSize="2xl" fontWeight="bold">
                {symbol} Бесср
              </Text>
              <Text
                fontSize="2xl"
                color={Number(ticker?.priceChangePercent) >= 0 ? 'green.400' : 'red.400'}
                fontWeight="bold"
              >
                {Number(ticker?.lastPrice).toFixed(1)}
              </Text>
              <Text
                color={Number(ticker?.priceChangePercent) >= 0 ? 'green.400' : 'red.400'}
                fontSize="lg"
              >
                {Number(ticker?.priceChangePercent).toFixed(2)}%
              </Text>
            </HStack>
            <Text color="gray.400" fontSize="sm">
              ≈ ${Number(ticker?.lastPrice).toFixed(1)}
            </Text>
          </Box>
        </HStack>

        <Grid templateColumns="repeat(auto-fit, minmax(180px, 1fr))" gap={6}>
          <Box>
            <Text color="gray.400" fontSize="sm">Маркировка</Text>
            <Text fontSize="md" fontWeight="semibold">
              {Number(markPrice?.markPrice).toFixed(1)}
            </Text>
          </Box>

          <Box>
            <Text color="gray.400" fontSize="sm">Индекс</Text>
            <Text fontSize="md" fontWeight="semibold">
              {Number(markPrice?.indexPrice).toFixed(1)}
            </Text>
          </Box>

          <Box>
            <Text color="gray.400" fontSize="sm">Ставка / Осталось</Text>
            <Text fontSize="md" fontWeight="semibold">
              {(Number(markPrice?.interestRate) * 100).toFixed(4)}%
            </Text>
          </Box>

          <Box>
            <Text color="gray.400" fontSize="sm">Макс 24ч</Text>
            <Text fontSize="md" fontWeight="semibold">
              {Number(ticker?.highPrice).toFixed(1)}
            </Text>
          </Box>

          <Box>
            <Text color="gray.400" fontSize="sm">Мин за 24ч</Text>
            <Text fontSize="md" fontWeight="semibold">
              {Number(ticker?.lowPrice).toFixed(1)}
            </Text>
          </Box>
        </Grid>

        <Divider borderColor="gray.700" />

        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
          <Box>
            <Text color="gray.400" fontSize="sm">Объем 24ч(BTC)</Text>
            <Text fontSize="md" fontWeight="semibold">
              {Number(ticker?.volume).toFixed(3)}
            </Text>
          </Box>

          <Box>
            <Text color="gray.400" fontSize="sm">Объем за 24ч(USDT)</Text>
            <Text fontSize="md" fontWeight="semibold">
              {Number(ticker?.quoteVolume).toLocaleString(undefined, {
                maximumFractionDigits: 2
              })}
            </Text>
          </Box>

          <Box>
            <Text color="gray.400" fontSize="sm">Сумма открытых позиций(USDT)</Text>
            <Text fontSize="md" fontWeight="semibold">
              {Number(openInterest?.openInterest).toLocaleString(undefined, {
                maximumFractionDigits: 2
              })}
            </Text>
          </Box>
        </Grid>
      </Flex>
    </Box>
  );
}