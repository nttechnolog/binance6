import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  IconButton,
  Button,
  Badge,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useAuth } from '../../hooks/useAuth';
import { useDisclosure } from '@chakra-ui/react';
import { AuthModal } from '../auth/AuthModal';
import { useQuery } from 'react-query';
import { db } from '../../db/db';
import { format } from 'date-fns';

interface PositionsTableProps {
  onRemove?: () => void;
}

export function PositionsTable({ onRemove }: PositionsTableProps) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [authMode, setAuthMode] = React.useState<'login' | 'register'>('login');

  // Получаем ордера пользователя
  const { data: orders } = useQuery(
    ['orders', user?.id],
    async () => {
      if (!user?.id) return [];
      return db.orders.where('userId').equals(user.id).reverse().toArray();
    },
    { 
      enabled: !!user?.id,
      refetchInterval: 1000 // Обновляем каждую секунду
    }
  );

  // Получаем историю сделок
  const { data: trades } = useQuery(
    ['trades', user?.id],
    async () => {
      if (!user?.id) return [];
      return db.trades.where('userId').equals(user.id).reverse().toArray();
    },
    { 
      enabled: !!user?.id,
      refetchInterval: 1000
    }
  );

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    onOpen();
  };

  return (
    <Box h="100%" bg="gray.800" borderRadius="lg" overflow="hidden">
      <HStack justify="space-between" p={2} borderBottom="1px" borderColor="gray.700">
        <Text fontSize="sm" fontWeight="medium">Позиции и история</Text>
        {onRemove && (
          <IconButton
            aria-label="Удалить виджет"
            icon={<CloseIcon />}
            size="xs"
            variant="ghost"
            onClick={onRemove}
          />
        )}
      </HStack>

      <Box overflowX="auto">
        <Tabs variant="unstyled" size="sm">
          <TabList px={2} borderBottom="1px" borderColor="gray.700">
            <Tab
              py={2}
              px={4}
              color="gray.400"
              _selected={{
                color: 'yellow.400',
                borderBottom: '2px solid',
                borderColor: 'yellow.400'
              }}
            >
              Позиции ({orders?.filter(o => o.status === 'open')?.length || 0})
            </Tab>
            <Tab
              py={2}
              px={4}
              color="gray.400"
              _selected={{
                color: 'yellow.400',
                borderBottom: '2px solid',
                borderColor: 'yellow.400'
              }}
            >
              Открытые ордера ({orders?.filter(o => o.status === 'new')?.length || 0})
            </Tab>
            <Tab
              py={2}
              px={4}
              color="gray.400"
              _selected={{
                color: 'yellow.400',
                borderBottom: '2px solid',
                borderColor: 'yellow.400'
              }}
            >
              История ордеров
            </Tab>
            <Tab
              py={2}
              px={4}
              color="gray.400"
              _selected={{
                color: 'yellow.400',
                borderBottom: '2px solid',
                borderColor: 'yellow.400'
              }}
            >
              История сделок
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              {user ? (
                orders?.filter(o => o.status === 'open').length ? (
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Символ</Th>
                        <Th>Тип</Th>
                        <Th>Сторона</Th>
                        <Th>Цена</Th>
                        <Th>Количество</Th>
                        <Th>Статус</Th>
                        <Th>Время</Th>
                        <Th>Действия</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {orders.filter(o => o.status === 'open').map(order => (
                        <Tr key={order.id}>
                          <Td>{order.symbol}</Td>
                          <Td>{order.type}</Td>
                          <Td>
                            <Badge colorScheme={order.side === 'buy' ? 'green' : 'red'}>
                              {order.side === 'buy' ? 'Покупка' : 'Продажа'}
                            </Badge>
                          </Td>
                          <Td>{order.price}</Td>
                          <Td>{order.amount}</Td>
                          <Td>
                            <Badge colorScheme="yellow">Открыт</Badge>
                          </Td>
                          <Td>{format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm:ss')}</Td>
                          <Td>
                            <Button size="xs" colorScheme="red">Закрыть</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                ) : (
                  <Text p={4} textAlign="center" color="gray.400">
                    У вас нет открытых позиций
                  </Text>
                )
              ) : (
                <Box p={4} textAlign="center" color="gray.400">
                  <Text>
                    <ChakraLink
                      color="yellow.400"
                      onClick={() => handleAuthClick('login')}
                      _hover={{ textDecoration: 'none' }}
                      cursor="pointer"
                    >
                      Войдите
                    </ChakraLink>
                    {' '}или{' '}
                    <ChakraLink
                      color="yellow.400"
                      onClick={() => handleAuthClick('register')}
                      _hover={{ textDecoration: 'none' }}
                      cursor="pointer"
                    >
                      Зарегистрируйтесь
                    </ChakraLink>
                    {' '}для просмотра позиций
                  </Text>
                </Box>
              )}
            </TabPanel>

            {/* Остальные табы аналогично */}
          </TabPanels>
        </Tabs>
      </Box>

      <AuthModal 
        isOpen={isOpen} 
        onClose={onClose}
        initialMode={authMode}
      />
    </Box>
  );
}