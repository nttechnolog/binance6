import React from 'react';
import {
  Box,
  VStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  HStack,
  Select,
  Input,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { db } from '../../../db/db';
import { format } from 'date-fns';

export function SecurityLogs() {
  const { data: logs } = useQuery('security-logs', async () => {
    const [logs, users] = await Promise.all([
      db.auditLogs.orderBy('timestamp').reverse().toArray(),
      db.users.toArray()
    ]);

    return logs.map(log => ({
      ...log,
      user: users.find(u => u.id === log.userId)
    }));
  });

  return (
    <Box bg="gray.800" p={6} borderRadius="lg">
      <VStack align="stretch" spacing={4}>
        <Text fontSize="lg" fontWeight="bold">Журнал безопасности</Text>

        <HStack>
          <Select placeholder="Тип события" maxW="200px">
            <option value="login">Вход в систему</option>
            <option value="failed_login">Неудачный вход</option>
            <option value="password_change">Смена пароля</option>
            <option value="2fa">Двухфакторная аутентификация</option>
          </Select>

          <Input
            placeholder="Поиск по IP"
            maxW="200px"
          />

          <Button colorScheme="yellow">
            Экспорт логов
          </Button>
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Время</Th>
              <Th>Пользователь</Th>
              <Th>Действие</Th>
              <Th>IP адрес</Th>
              <Th>Статус</Th>
            </Tr>
          </Thead>
          <Tbody>
            {logs?.map((log) => (
              <Tr key={log.id}>
                <Td>{format(new Date(log.timestamp), 'dd.MM.yyyy HH:mm:ss')}</Td>
                <Td>
                  <Text>{log.user?.name}</Text>
                  <Text fontSize="sm" color="gray.400">
                    {log.user?.email}
                  </Text>
                </Td>
                <Td>{log.action}</Td>
                <Td>{log.ipAddress || 'N/A'}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      log.action.includes('failed') ? 'red' :
                      log.action.includes('success') ? 'green' :
                      'yellow'
                    }
                  >
                    {log.action.includes('failed') ? 'Ошибка' :
                     log.action.includes('success') ? 'Успех' :
                     'Информация'}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Box>
  );
}