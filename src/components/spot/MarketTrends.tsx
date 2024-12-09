import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react';
import { formatPercent } from '../../utils/dataTransforms';

interface MarketTrendsProps {
  markets: any[];
}

export function MarketTrends({ markets }: MarketTrendsProps) {
  const topMarkets = markets
    ?.sort((a, b) => Math.abs(parseFloat(b.priceChangePercent)) - Math.abs(parseFloat(a.priceChangePercent)))
    .slice(0, 5);

  return (
    <Box bg="gray.800" p={6} borderRadius="lg">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Рыночные тренды
      </Text>
      <VStack spacing={4} align="stretch">
        {topMarkets?.map((market) => (
          <HStack key={market.symbol} justify="space-between">
            <Text>{market.symbol.replace('USDT', '')}</Text>
            <Text color={parseFloat(market.priceChangePercent) >= 0 ? 'green.400' : 'red.400'}>
              {formatPercent(market.priceChangePercent)}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}