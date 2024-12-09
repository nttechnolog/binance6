import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { db } from '../db/db';

export function DashboardPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const { data: stats } = useQuery('dashboard-stats', async () => {
    const [users, transactions, trades] = await Promise.all([
      db.users.toArray(),
      db.transactions.toArray(),
      db.trades.toArray(),
    ]);

    const activeUsers = users.filter(u => u.isActive).length;
    const totalVolume = trades.reduce((sum, trade) => sum + parseFloat(trade.amount), 0);
    
    return {
      totalUsers: users.length,
      activeUsers,
      totalTransactions: transactions.length,
      totalVolume,
      userGrowth: ((activeUsers / users.length) * 100).toFixed(1),
      tradingVolume: totalVolume.toFixed(2),
    };
  });

  const statCards = [
    {
      label: 'Всего пользователей',
      value: stats?.totalUsers || 0,
      change: 12,
    },
    {
      label: 'Активные пользователи',
      value: stats?.activeUsers || 0,
      change: stats?.userGrowth || 0,
    },
    {
      label: 'Общий объем торгов',
      value: `$${stats?.tradingVolume || '0'}`,
      change: 8,
    },
    {
      label: 'Транзакции',
      value: stats?.totalTransactions || 0,
      change: 5,
    },
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Панель управления</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {statCards.map((stat, index) => (
            <Box
              key={index}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Stat>
                <StatLabel>{stat.label}</StatLabel>
                <StatNumber fontSize="2xl">{stat.value}</StatNumber>
                <StatHelpText>
                  <StatArrow type={Number(stat.change) >= 0 ? 'increase' : 'decrease'} />
                  {Math.abs(Number(stat.change))}%
                </StatHelpText>
              </Stat>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}