import React from 'react';
import { Container, VStack, Heading } from '@chakra-ui/react';
import { DashboardStats } from '../components/dashboard/DashboardStats';

export function DashboardPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Панель управления</Heading>
        <DashboardStats />
      </VStack>
    </Container>
  );
}