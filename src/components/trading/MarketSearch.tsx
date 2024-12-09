import React, { useState } from 'react';
import {
  Box,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  Tabs,
  TabList,
  Tab,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { StarIcon, CloseIcon } from '@chakra-ui/icons';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface MarketSearchProps {
  onRemove?: () => void;
}

interface PairData {
  symbol: string;
  price: string;
  priceChangePercent: string;
  leverage: string;
}

export function MarketSearch({ onRemove }: MarketSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.800', 'gray.800');

  const { data: pairs } = useQuery(
    'trading-pairs',
    async () => {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
      return response.data.map((pair: any) => ({
        symbol: pair.symbol,
        price: pair.lastPrice,
        priceChangePercent: pair.priceChangePercent,
        leverage: '5x' // В реальном API нужно получать данные о плече
      }));
    },
    {
      refetchInterval: 2000,
      select: (data) => {
        return data.filter((pair: any) => 
          pair.symbol.endsWith('USDT')
        );
      }
    }
  );

  const filteredPairs = pairs?.filter((pair: PairData) => 
    pair.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <Box h="100%" bg={bgColor} borderRadius="lg" overflow="hidden">
      <VStack spacing={0} h="100%">
        <HStack w="100%" justify="space-between" p={2} borderBottom="1px" borderColor="gray.700" className="widget-header">
          <Input
            placeholder="Поиск"
            size="sm"
            width="200px"
            bg="gray.900"
            border="none"
            _focus={{ border: 'none' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

        <Tabs variant="unstyled" w="100%">
          <TabList px={2} borderBottom="1px" borderColor="gray.700">
            <Tab
              py={2}
              px={4}
              _selected={{
                color: 'yellow.400',
                borderBottom: '2px solid',
                borderColor: 'yellow.400'
              }}
            >
              USDT
            </Tab>
            <Tab
              py={2}
              px={4}
              _selected={{
                color: 'yellow.400',
                borderBottom: '2px solid',
                borderColor: 'yellow.400'
              }}
            >
              BUSD
            </Tab>
          </TabList>
        </Tabs>

        <Flex px={4} py={2} borderBottom="1px" borderColor="gray.700">
          <Text fontSize="sm" color="gray.400">Пара</Text>
          <Text fontSize="sm" color="gray.400" ml={4}>Послед. / Изменение</Text>
        </Flex>

        <Box overflowY="auto" w="100%" flex="1">
          {filteredPairs?.map((pair: PairData) => (
            <Flex
              key={pair.symbol}
              p={2}
              _hover={{ bg: 'gray.700', cursor: 'pointer' }}
              onClick={() => navigate(`/trading/${pair.symbol}`)}
              align="center"
              justify="space-between"
            >
              <HStack spacing={2}>
                <IconButton
                  aria-label="В избранное"
                  icon={<StarIcon />}
                  size="xs"
                  variant="ghost"
                  color={favorites.includes(pair.symbol) ? 'yellow.400' : 'gray.500'}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(pair.symbol);
                  }}
                />
                <Text>{pair.symbol.replace('USDT', '')}</Text>
                <Text color="gray.500" fontSize="xs">{pair.leverage}</Text>
              </HStack>
              <VStack align="flex-end" spacing={0}>
                <Text>{Number(pair.price).toFixed(4)}</Text>
                <Text
                  color={Number(pair.priceChangePercent) >= 0 ? 'green.400' : 'red.400'}
                  fontSize="xs"
                >
                  {Number(pair.priceChangePercent) >= 0 ? '+' : ''}
                  {Number(pair.priceChangePercent).toFixed(2)}%
                </Text>
              </VStack>
            </Flex>
          ))}
        </Box>
      </VStack>
    </Box>
  );
}