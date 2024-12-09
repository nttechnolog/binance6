import React from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

interface LoadingFallbackProps {
  message?: string;
}

export function LoadingFallback({ message = 'Загрузка...' }: LoadingFallbackProps) {
  return (
    <Box p={4} bg="gray.800" borderRadius="lg">
      <VStack spacing={4}>
        <Spinner size="xl" color="yellow.400" />
        <Text color="gray.300">{message}</Text>
      </VStack>
    </Box>
  );
}