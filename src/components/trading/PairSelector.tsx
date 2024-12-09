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
  Tooltip,
} from '@chakra-ui/react';
import { StarIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useTradingPair } from '../../hooks/useTradingPair';

interface PairSelectorProps {
  currentSymbol: string;
  onSymbolChange: (symbol: string) => void;
  onRemove?: () => void;
}

export function PairSelector({ currentSymbol, onSymbolChange, onRemove }: PairSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.800', 'gray.800');

  const { pairs } = useTradingPair(currentSymbol);

  const filteredPairs = pairs?.filter((pair: any) => 
    pair.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handlePairSelect = (symbol: string) => {
    onSymbolChange(symbol);
    navigate(`/trading/${symbol}`);
  };

  return (
    <Box h="100%" bg={bgColor} borderRadius="lg" overflow="hidden">
      <VStack spacing={0} h="100%">
        <HStack w="100%" justify="space-between" p={2} borderBottom="1px" borderColor="gray.700" className="widget-header">
          <Input
            placeholder="Поиск пары"
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

        <Box overflowY="auto" w="100%" flex="1">
          {filteredPairs?.map((pair: any) => (
            <Flex
              key={pair.symbol}
              p={2}
              _hover={{ bg: 'gray.700', cursor: 'pointer' }}
              onClick={() => handlePairSelect(pair.symbol)}
              align="center"
              justify="space-between"
            >
              <HStack spacing={2}>
                <Tooltip label={favorites.includes(pair.symbol) ? 'Удалить из избранного' : 'Добавить в избранное'}>
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
                </Tooltip>
                <Text>{pair.baseAsset}/{pair.quoteAsset}</Text>
              </HStack>
              <VStack align="flex-end" spacing={0}>
                <Text fontSize="xs" color="gray.400">
                  Мин. объем: {pair.minQty}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  Шаг цены: {pair.tickSize}
                </Text>
              </VStack>
            </Flex>
          ))}
        </Box>
      </VStack>
    </Box>
  );
}