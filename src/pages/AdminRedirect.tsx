import React, { useEffect } from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

export function AdminRedirect() {
  useEffect(() => {
    // Перенаправляем на отдельный домен админки
    window.location.href = '/admin/';
  }, []);

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4}>
        <Spinner size="xl" color="yellow.400" />
        <Text>Переход в панель администрирования...</Text>
      </VStack>
    </Box>
  );
}