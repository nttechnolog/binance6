import React, { useCallback } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
  HStack,
  IconButton,
  Select,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { CloseIcon } from '@chakra-ui/icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTradeStore } from '../../stores/useTradeStore';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { LoadingFallback } from '../common/LoadingFallback';
import { api, handleApiError } from '../../utils/api';
import { formatPrice, formatVolume, groupOrderBookLevels } from '../../utils/dataTransforms';
import { ORDERBOOK_CONSTANTS } from '../../utils/constants';
import { useState } from 'react';

interface OrderBookProps {
  symbol: string;
  onRemove?: () => void;
}

export function OrderBook({ symbol, onRemove }: OrderBookProps) {
  const { t } = useLanguage();
  const { setPrice, setSide } = useTradeStore();
  const [groupSize, setGroupSize] = useState(ORDERBOOK_CONSTANTS.GROUP_SIZES[0]);

  const { data: depth, isLoading, error } = useQuery(
    ['orderbook', symbol],
    async () => {
      const response = await api.get(`https://api.binance.com/api/v3/depth`, {
        params: {
          symbol: symbol,
          limit: ORDERBOOK_CONSTANTS.DEFAULT_DEPTH
        }
      });
      return response.data;
    },
    {
      refetchInterval: ORDERBOOK_CONSTANTS.UPDATE_INTERVAL,
      enabled: !!symbol,
      retry: 3,
      onError: (error) => {
        console.warn('Error fetching orderbook:', handleApiError(error));
      }
    }
  );

  const getFilledWidth = useCallback((amount: string) => {
    if (!depth) return '0%';
    const maxAmount = Math.max(
      ...depth.asks.map((a: string[]) => parseFloat(a[1])),
      ...depth.bids.map((b: string[]) => parseFloat(b[1]))
    );
    return `${(parseFloat(amount) / maxAmount) * 100}%`;
  }, [depth]);

  const handlePriceClick = useCallback((price: string, side: 'buy' | 'sell') => {
    setPrice(price);
    setSide(side);
  }, [setPrice, setSide]);

  if (error) {
    return (
      <Box p={4} bg="gray.800" borderRadius="lg">
        <Text color="red.400">Ошибка загрузки стакана: {handleApiError(error)}</Text>
      </Box>
    );
  }

  if (isLoading) {
    return <LoadingFallback message="Загрузка стакана..." />;
  }

  const groupedAsks = depth ? groupOrderBookLevels(depth.asks, groupSize) : [];
  const groupedBids = depth ? groupOrderBookLevels(depth.bids, groupSize) : [];

  return (
    <ErrorBoundary>
      <Box h="100%" overflow="hidden">
        <VStack h="100%" spacing={0}>
          <HStack w="100%" justify="space-between" p={2} borderBottom="1px" borderColor="gray.700" className="widget-header">
            <Text fontSize="sm" fontWeight="medium">{t('orderbook.title')}</Text>
            <HStack>
              <Select
                size="xs"
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                bg="gray.700"
              >
                {ORDERBOOK_CONSTANTS.GROUP_SIZES.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Select>
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
          </HStack>
          
          <Box overflowY="auto" w="100%" flex="1">
            <Table variant="unstyled" size="sm">
              <Thead>
                <Tr>
                  <Th color="gray.400" fontSize="xs">{t('orderbook.price')}</Th>
                  <Th color="gray.400" fontSize="xs" isNumeric>{t('orderbook.amount')}</Th>
                  <Th color="gray.400" fontSize="xs" isNumeric>{t('orderbook.total')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {groupedAsks.slice().reverse().map(([price, amount]) => (
                  <Tr 
                    key={`ask-${price}`}
                    cursor="pointer"
                    onClick={() => handlePriceClick(price, 'buy')}
                    _hover={{ bg: 'gray.700' }}
                  >
                    <Td position="relative">
                      <Box
                        position="absolute"
                        right="0"
                        top="0"
                        bottom="0"
                        bg="red.500"
                        opacity="0.1"
                        width={getFilledWidth(amount)}
                        zIndex={0}
                      />
                      <Text color="red.400" fontSize="xs" position="relative" zIndex={1}>
                        {formatPrice(price)}
                      </Text>
                    </Td>
                    <Td isNumeric fontSize="xs">{formatVolume(amount)}</Td>
                    <Td isNumeric fontSize="xs">
                      {formatVolume(String(parseFloat(price) * parseFloat(amount)))}
                    </Td>
                  </Tr>
                ))}

                <Tr>
                  <Td colSpan={3} bg="gray.700" h="1px" p={0} />
                </Tr>

                {groupedBids.map(([price, amount]) => (
                  <Tr 
                    key={`bid-${price}`}
                    cursor="pointer"
                    onClick={() => handlePriceClick(price, 'sell')}
                    _hover={{ bg: 'gray.700' }}
                  >
                    <Td position="relative">
                      <Box
                        position="absolute"
                        right="0"
                        top="0"
                        bottom="0"
                        bg="green.500"
                        opacity="0.1"
                        width={getFilledWidth(amount)}
                        zIndex={0}
                      />
                      <Text color="green.400" fontSize="xs" position="relative" zIndex={1}>
                        {formatPrice(price)}
                      </Text>
                    </Td>
                    <Td isNumeric fontSize="xs">{formatVolume(amount)}</Td>
                    <Td isNumeric fontSize="xs">
                      {formatVolume(String(parseFloat(price) * parseFloat(amount)))}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </Box>
    </ErrorBoundary>
  );
}