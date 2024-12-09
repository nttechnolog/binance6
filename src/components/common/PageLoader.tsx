import React from 'react';
import { Box, VStack, Spinner, Text, Progress, Image } from '@chakra-ui/react';

interface PageLoaderProps {
  message?: string;
  progress?: number;
}

export function PageLoader({ message = 'Загрузка...', progress }: PageLoaderProps) {
  return (
    <Box 
      position="fixed" 
      top={0} 
      left={0} 
      right={0} 
      bottom={0} 
      bg="gray.900" 
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={6}>
        <Image src="/binance-logo.svg" h="40px" mb={4} />
        <Spinner size="xl" color="yellow.400" thickness="4px" />
        <Text color="gray.300" fontSize="lg">{message}</Text>
        {progress !== undefined && (
          <Box w="240px">
            <Progress 
              value={progress} 
              size="sm" 
              colorScheme="yellow" 
              bg="gray.700" 
              borderRadius="full"
              hasStripe
              isAnimated
            />
            <Text 
              color="gray.400" 
              fontSize="sm" 
              textAlign="center" 
              mt={2}
            >
              Загрузка основных данных... {progress}%
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}