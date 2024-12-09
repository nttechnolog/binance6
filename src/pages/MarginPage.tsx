import React from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { api } from '../utils/api';
import { formatPrice, formatPercent } from '../utils/dataTransforms';
import { useAuth } from '../hooks/useAuth';

export function MarginPage() {
  const { user } = useAuth();
  
  const { data: marginPairs } = useQuery(
    'margin-pairs',
    async () => {
      const response = await api.get('/api/v3/ticker/24hr');
      return response.data
        .filter((item: any) => item.symbol.endsWith('USDT'))
        .slice(0, 20);
    },
    { refetchInterval: 5000 }
  );

  if (!user) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="warning">
          <AlertIcon />
          Для доступа к маржинальной торговле необходимо авторизоваться
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box bg="gray.800" p={6} borderRadius="lg">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Маржинальная торговля
          </Text>
          
          <HStack spacing={4} mb={6}>
            <Box>
              <Text color="gray.400">Маржинальный баланс</Text>
              <Text fontSize="xl">0.00 USDT</Text>
            </Box>
            <Box>
              <Text color="gray.400">Доступно для займа</Text>
              <Text fontSize="xl">0.00 USDT</Text>
            </Box>
            <Box>
              <Text color="gray.400">Уровень риска</Text>
              <Badge colorScheme="green">Низкий</Badge>
            </Box>
          </HStack>

          <HStack spacing={4} mb={8}>
            <Button colorScheme="yellow">Перевод</Button>
            <Button variant="outline">Займ</Button>
            <Button variant="outline">Погашение</Button>
          </HStack>

          <Tabs>
            <TabList>
              <Tab>Открытые позиции</Tab>
              <Tab>История</Tab>
              <Tab>Процентные ставки</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Пара</Th>
                      <Th isNumeric>Цена</Th>
                      <Th isNumeric>Размер позиции</Th>
                      <Th isNumeric>Прибыль/Убыток</Th>
                      <Th isNumeric>Маржа</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {marginPairs?.map((pair: any) => (
                      <Tr key={pair.symbol}>
                        <Td>{pair.symbol}</Td>
                        <Td isNumeric>{formatPrice(pair.lastPrice)}</Td>
                        <Td isNumeric>0.00</Td>
                        <Td isNumeric color={parseFloat(pair.priceChangePercent) >= 0 ? 'green.400' : 'red.400'}>
                          {formatPercent(pair.priceChangePercent)}
                        </Td>
                        <Td isNumeric>0.00%</Td>
                        <Td>
                          <Button size="sm" colorScheme="yellow">
                            Торговать
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </Container>
  );
}