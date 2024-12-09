import React from 'react';
import {
  Box,
  VStack,
  Text,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  useDisclosure,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { db } from '../../../db/db';
import { DomainSettings } from './DomainSettings';
import { SecurityLogs } from './SecurityLogs';

export function SecurityDashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: securityStats } = useQuery('security-stats', async () => {
    const [logs, users] = await Promise.all([
      db.auditLogs.toArray(),
      db.users.toArray()
    ]);

    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(log => new Date(log.timestamp) > last24h);

    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      verifiedUsers: users.filter(u => u.isVerified).length,
      recentLogins: recentLogs.filter(log => log.action === 'login').length,
      failedLogins: recentLogs.filter(log => log.action === 'login_failed').length,
    };
  });

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Безопасность системы</Text>

        <Alert status="info">
          <AlertIcon />
          Регулярно проверяйте журналы безопасности и настройки доменов для обеспечения безопасности системы
        </Alert>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          <Box bg="gray.800" p={6} borderRadius="lg">
            <Stat>
              <StatLabel>Активные пользователи</StatLabel>
              <StatNumber>{securityStats?.activeUsers || 0}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {((securityStats?.activeUsers || 0) / (securityStats?.totalUsers || 1) * 100).toFixed(1)}%
              </StatHelpText>
            </Stat>
          </Box>

          <Box bg="gray.800" p={6} borderRadius="lg">
            <Stat>
              <StatLabel>Верифицированные пользователи</StatLabel>
              <StatNumber>{securityStats?.verifiedUsers || 0}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {((securityStats?.verifiedUsers || 0) / (securityStats?.totalUsers || 1) * 100).toFixed(1)}%
              </StatHelpText>
            </Stat>
          </Box>

          <Box bg="gray.800" p={6} borderRadius="lg">
            <Stat>
              <StatLabel>Неудачные попытки входа (24ч)</StatLabel>
              <StatNumber>{securityStats?.failedLogins || 0}</StatNumber>
              <StatHelpText>
                За последние 24 часа
              </StatHelpText>
            </Stat>
          </Box>
        </Grid>

        <DomainSettings />
        <SecurityLogs />
      </VStack>
    </Box>
  );
}