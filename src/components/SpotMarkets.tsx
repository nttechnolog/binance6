import { Box, Heading } from '@chakra-ui/react';
import { PriceTable } from './PriceTable';
import { ErrorMessage } from './ErrorMessage';

interface SpotMarketsProps {
  prices: Array<{ symbol: string; price: string }>;
  error: string | null;
}

export function SpotMarkets({ prices, error }: SpotMarketsProps) {
  return (
    <Box>
      <Heading size="lg" mb={6} color="gray.100">
        Spot Markets
      </Heading>
      {error ? <ErrorMessage message={error} /> : <PriceTable prices={prices} />}
    </Box>
  );
}