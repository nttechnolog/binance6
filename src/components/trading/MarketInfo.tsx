import React from 'react';
import { Box, HStack, Text, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Grid } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import axios from 'axios';

interface MarketInfoProps {
  symbol: string;
}

export function MarketInfo({ symbol }: MarketInfoProps) {
  const { data: ticker } = useQuery(
    ['ticker', symbol],
    async () => {
      const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr`, {
        params: { symbol }
      });
      return response.data;
    },
    {
      refetchInterval: 1000,
      enabled: !!symbol
    }
  );

  return (
    <Box bg="gray.800" p={4} borderRadius="lg">
      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
        <Stat>
          <StatLabel>Last Price</StatLabel>
          <StatNumber color={ticker?.priceChangePercent >= 0 ? 'green.400' : 'red.400'}>
            ${Number(ticker?.lastPrice).toFixed(2)}
          </StatNumber>
          <StatHelpText>
            <StatArrow type={ticker?.priceChangePercent >= 0 ? 'increase' : 'decrease'} />
            {Number(ticker?.priceChangePercent).toFixed(2)}%
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>24h High</StatLabel>
          <StatNumber>${Number(ticker?.highPrice).toFixed(2)}</StatNumber>
          <StatHelpText>24h Low: ${Number(ticker?.lowPrice).toFixed(2)}</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>24h Volume</StatLabel>
          <StatNumber>{Number(ticker?.volume).toFixed(2)}</StatNumber>
          <StatHelpText>
            ${Number(ticker?.quoteVolume).toFixed(2)}
          </StatHelpText>
        </Stat>
      </Grid>
    </Box>
  );
}