import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Badge,
  Avatar,
  Text,
} from '@chakra-ui/react';
import { P2POrderForm } from '../components/p2p/P2POrderForm';
import { P2PFilters } from '../components/p2p/P2PFilters';
import { P2PChat } from '../components/p2p/P2PChat';

export function P2PPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [showChat, setShowChat] = useState(false);

  const handleOrderSelect = (order: any) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleFiltersChange = (filters: any) => {
    console.log('Применены фильтры:', filters);
  };

  const mockOrders = Array.from({ length: 5 }).map((_, index) => ({
    id: index + 1,
    seller: `Продавец ${index + 1}`,
    price: (Math.random() * 100000 + 50000).toFixed(2),
    minAmount: (Math.random() * 10000 + 5000).toFixed(2),
    maxAmount: (Math.random() * 100000 + 50000).toFixed(2),
    completedDeals: Math.floor(Math.random() * 1000),
    paymentMethods: ['Тинькофф', 'Сбербанк'],
  }));

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box bg="gray.800" p={6} borderRadius="lg">
          <Tabs onChange={(index) => setActiveTab(index === 0 ? 'buy' : 'sell')}>
            <TabList mb={6}>
              <Tab>Купить</Tab>
              <Tab>Продать</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                <VStack spacing={6} align="stretch">
                  <P2PFilters onFiltersChange={handleFiltersChange} />

                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Продавец</Th>
                        <Th>Цена</Th>
                        <Th>Лимиты</Th>
                        <Th>Способ оплаты</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockOrders.map((order) => (
                        <Tr key={order.id}>
                          <Td>
                            <HStack>
                              <Avatar size="sm" name={order.seller} />
                              <Box>
                                <Text>{order.seller}</Text>
                                <Text fontSize="sm" color="gray.400">
                                  Сделок: {order.completedDeals}
                                </Text>
                              </Box>
                            </HStack>
                          </Td>
                          <Td>
                            <Text fontWeight="bold">{order.price} RUB</Text>
                          </Td>
                          <Td>
                            <Text>
                              {order.minAmount} - {order.maxAmount} RUB
                            </Text>
                          </Td>
                          <Td>
                            <HStack>
                              {order.paymentMethods.map((method) => (
                                <Badge key={method} colorScheme="green">
                                  {method}
                                </Badge>
                              ))}
                            </HStack>
                          </Td>
                          <Td>
                            <Button
                              colorScheme="yellow"
                              size="sm"
                              onClick={() => handleOrderSelect(order)}
                            >
                              {activeTab === 'buy' ? 'Купить' : 'Продать'} BTC
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </VStack>
              </TabPanel>

              <TabPanel p={0}>
                <VStack spacing={6} align="stretch">
                  <P2PFilters onFiltersChange={handleFiltersChange} />
                  <P2POrderForm type="sell" onSubmit={console.log} />
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {showChat ? 'Чат с продавцом' : `${activeTab === 'buy' ? 'Покупка' : 'Продажа'} BTC`}
          </ModalHeader>
          <ModalBody>
            {showChat ? (
              <P2PChat
                orderId={selectedOrder?.id.toString() || ''}
                buyer="Покупатель"
                seller={selectedOrder?.seller || ''}
              />
            ) : (
              <P2POrderForm
                type={activeTab}
                onSubmit={() => setShowChat(true)}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}