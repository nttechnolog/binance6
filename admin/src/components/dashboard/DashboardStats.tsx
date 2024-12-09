import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  Text,
} from '@chakra-ui/react';
import {
  Users,
  CurrencyCircleDollar,
  ChartLine,
  ShieldCheck,
} from '@phosphor-icons/react';
import { useQuery } from 'react-query';
import { api } from '../../utils/api';

export function DashboardStats() {
  const { data: stats } = useQuery('admin-stats', async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
  });

  const cards = [
    {
      label: 'Пользователей',
      value: stats?.users || 0,
      icon: Users,
      change: 5,
    },
    {
      label: 'Общий баланс',
      value: `$${(stats?.totalBalance || 0).toFixed(2)}`,
      icon: CurrencyCircleDollar,
      change: 12,
    },
    {
      label: 'Активность',
      value: stats?.activity || 0,
      icon: ChartLine,
      change: -2,
    },
    {
      label: 'Активные пользователи',
      value: stats?.activeUsers || 0,
      icon: ShieldCheck,
      change: 8,
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
      {cards.map((card) => (
        <Box
          key={card.label}
          bg="gray.800"
          p={6}
          borderRadius="lg"
          boxShadow="sm"
        >
          <Stat>
            <StatLabel color="gray.400">
              <Icon as={card.icon} boxSize={5} mr={2} />
              <Text display="inline">{card.label}</Text>
            </StatLabel>
            <StatNumber fontSize="3xl" mt={2}>
              {card.value}
            </StatNumber>
            <StatHelpText>
              <StatArrow type={card.change >= 0 ? 'increase' : 'decrease'} />
              {Math.abs(card.change)}%
            </StatHelpText>
          </Stat>
        </Box>
      ))}
    </SimpleGrid>
  );
}