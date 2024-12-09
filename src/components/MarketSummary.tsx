import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export function MarketSummary() {
  return (
    <Box bg="gray.800" p={6} borderRadius="lg" height="fit-content">
      <VStack align="stretch" spacing={4}>
        <Heading size="md" color="gray.100">
          Market Summary
        </Heading>
        <Text color="gray.400" fontSize="sm">
          24h Volume: $42.8B
        </Text>
        <Text color="gray.400" fontSize="sm">
          Trades Today: 8.2M
        </Text>
      </VStack>
    </Box>
  );
}