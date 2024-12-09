import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Input,
  VStack,
  HStack,
  Text,
  Image,
  Box,
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CoinData {
  symbol: string;
  price: string;
  priceChangePercent: string;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');

  const { data: allCoins } = useQuery(
    'all-coins',
    async () => {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
      return response.data;
    },
    {
      refetchInterval: 5000,
      staleTime: 2000,
    }
  );

  const filteredCoins = allCoins?.filter((coin: CoinData) => 
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  const handleCoinClick = (symbol: string) => {
    navigate(`/trading/${symbol}`);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent bg={bgColor} maxH="80vh" overflow="hidden">
        <Box p={4}>
          <Input
            placeholder="Поиск монеты..."
            size="lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </Box>

        <Tabs>
          <TabList px={4}>
            <Tab>В тренде</Tab>
            <Tab>Все</Tab>
            <Tab>Спот</Tab>
            <Tab>Фьючерсы</Tab>
            <Tab>Earn</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <VStack align="stretch" spacing={0} maxH="60vh" overflowY="auto">
                {filteredCoins?.map((coin: CoinData) => (
                  <Box
                    key={coin.symbol}
                    p={4}
                    _hover={{ bg: 'gray.700' }}
                    cursor="pointer"
                    onClick={() => handleCoinClick(coin.symbol)}
                  >
                    <HStack justify="space-between">
                      <HStack>
                        <Image
                          src={`https://bin.bnbstatic.com/image/crypto/${coin.symbol.toLowerCase().replace('usdt', '')}.png`}
                          boxSize="24px"
                          fallbackSrc="https://bin.bnbstatic.com/static/images/common/favicon.ico"
                        />
                        <Text>{coin.symbol}</Text>
                      </HStack>
                      <VStack align="end" spacing={0}>
                        <Text>{Number(coin.price).toFixed(2)}</Text>
                        <Text
                          fontSize="sm"
                          color={Number(coin.priceChangePercent) >= 0 ? 'green.400' : 'red.400'}
                        >
                          {Number(coin.priceChangePercent) >= 0 ? '+' : ''}
                          {Number(coin.priceChangePercent).toFixed(2)}%
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </TabPanel>
            {/* Остальные табы будут иметь аналогичную структуру */}
          </TabPanels>
        </Tabs>
      </ModalContent>
    </Modal>
  );
}