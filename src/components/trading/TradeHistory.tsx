import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, VStack, HStack, IconButton } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { CloseIcon } from '@chakra-ui/icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { LoadingFallback } from '../common/LoadingFallback';
import { api, handleApiError } from '../../utils/api';
import { formatPrice, formatVolume } from '../../utils/dataTransforms';
import { TRADES_CONSTANTS } from '../../utils/constants';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Trade {
  id: number;
  price: string;
  qty: string;
  time: number;
  isBuyerMaker: boolean;
}

interface TradeHistoryProps {
  symbol: string;
  onRemove?: () => void;
}

export function TradeHistory({ symbol, onRemove }: TradeHistoryProps) {
  const { t } = useLanguage();

  const { data: trades, isLoading, error } = useQuery(
    ['trades', symbol],
    async () => {
      const response = await api.get(`https://api.binance.com/api/v3/trades`, {
        params: {
          symbol: symbol,
          limit: TRADES_CONSTANTS.MAX_TRADES
        }
      });
      return response.data;
    },
    {
      refetchInterval: TRADES_CONSTANTS.UPDATE_INTERVAL,
      enabled: !!symbol,
      retry: 3,
      onError: (error) => {
        console.warn('Error fetching trades:', handleApiError(error));
      }
    }
  );

  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp), 'HH:mm:ss', { locale: ru });
  };

  if (error) {
    return (
      <Box p={4} bg="gray.800" borderRadius="lg">
        <Text color="red.400">Ошибка загрузки истории сделок: {handleApiError(error)}</Text>
      </Box>
    );
  }

  if (isLoading) {
    return <LoadingFallback message="Загрузка истории сделок..." />;
  }

  return (
    <ErrorBoundary>
      <Box h="100%" overflow="hidden">
        <VStack h="100%" spacing={0}>
          <HStack w="100%" justify="space-between" p={2} borderBottom="1px" borderColor="gray.700">
            <Text fontSize="sm" fontWeight="medium">{t('tradehistory.title')}</Text>
            {onRemove && (
              <IconButton
                aria-label="Remove widget"
                icon={<CloseIcon />}
                size="xs"
                variant="ghost"
                onClick={onRemove}
              />
            )}
          </HStack>
          
          <Box overflowY="auto" w="100%" flex="1">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th color="gray.400">{t('tradehistory.time')}</Th>
                  <Th color="gray.400">{t('tradehistory.price')}</Th>
                  <Th color="gray.400" isNumeric>{t('tradehistory.amount')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {trades?.map((trade: Trade) => (
                  <Tr key={trade.id}>
                    <Td>{formatTime(trade.time)}</Td>
                    <Td color={trade.isBuyerMaker ? 'red.400' : 'green.400'}>
                      {formatPrice(trade.price)}
                    </Td>
                    <Td isNumeric>{formatVolume(trade.qty)}</Td>
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