// Обновляем компонент TradeWidget для интеграции с балансом
import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Select,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useWallet } from '../../hooks/useWallet';
import { useTradeStore } from '../../stores/useTradeStore';
import { Decimal } from 'decimal.js';
import { formatBalance } from '../../utils/walletHelpers';

interface TradeWidgetProps {
  symbol: string;
  onRemove?: () => void;
}

export function TradeWidget({ symbol, onRemove }: TradeWidgetProps) {
  const toast = useToast();
  const [orderType, setOrderType] = useState('limit');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState('');
  const [leverage, setLeverage] = useState('1');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');

  const {
    balances,
    hasSufficientFunds,
    lockFunds,
    unlockFunds,
    updateBalance
  } = useWallet();

  const [baseAsset, quoteAsset] = symbol.split('USDT');
  
  const baseBalance = balances?.find(b => b.asset === baseAsset);
  const quoteBalance = balances?.find(b => b.asset === 'USDT');

  useEffect(() => {
    if (price && amount) {
      try {
        const totalValue = new Decimal(price).times(amount);
        setTotal(totalValue.toString());
      } catch {
        setTotal('');
      }
    } else {
      setTotal('');
    }
  }, [price, amount]);

  const handleTrade = async () => {
    if (!price || !amount) {
      toast({
        title: 'Ошибка',
        description: 'Укажите цену и количество',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      if (side === 'buy') {
        // Проверяем достаточно ли USDT для покупки
        if (!hasSufficientFunds('USDT', total)) {
          throw new Error('Недостаточно USDT для покупки');
        }

        // Блокируем USDT
        await lockFunds('USDT', total);

        // Создаем ордер на покупку
        // В реальном приложении здесь была бы интеграция с биржей
        
        // Для демо просто меняем балансы
        await updateBalance.mutateAsync({
          asset: 'USDT',
          amount: total,
          type: 'debit'
        });

        await updateBalance.mutateAsync({
          asset: baseAsset,
          amount,
          type: 'credit'
        });

      } else {
        // Проверяем достаточно ли базовой валюты для продажи
        if (!hasSufficientFunds(baseAsset, amount)) {
          throw new Error(`Недостаточно ${baseAsset} для продажи`);
        }

        // Блокируем базовую валюту
        await lockFunds(baseAsset, amount);

        // Создаем ордер на продажу
        // В реальном приложении здесь была бы интеграция с биржей
        
        // Для демо просто меняем балансы
        await updateBalance.mutateAsync({
          asset: baseAsset,
          amount,
          type: 'debit'
        });

        await updateBalance.mutateAsync({
          asset: 'USDT',
          amount: total,
          type: 'credit'
        });
      }

      toast({
        title: 'Успешно',
        description: `${side === 'buy' ? 'Покупка' : 'Продажа'} ${amount} ${baseAsset}`,
        status: 'success',
        duration: 3000,
      });

      // Сбрасываем форму
      setAmount('');
      if (orderType !== 'market') setPrice('');

    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box p={4}>
      <Tabs>
        <TabList>
          <Tab>Спот</Tab>
          <Tab>Кросс {leverage}x</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4}>
              <HStack w="100%" spacing={4}>
                <Button
                  flex={1}
                  colorScheme={orderType === 'limit' ? 'yellow' : 'gray'}
                  onClick={() => setOrderType('limit')}
                >
                  Лимит
                </Button>
                <Button
                  flex={1}
                  colorScheme={orderType === 'market' ? 'yellow' : 'gray'}
                  onClick={() => setOrderType('market')}
                >
                  Маркет
                </Button>
              </HStack>

              {orderType === 'limit' && (
                <Input
                  placeholder="Цена"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              )}

              <Input
                placeholder="Количество"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              {total && (
                <Text>
                  Всего: {formatBalance(total)} USDT
                </Text>
              )}

              <HStack w="100%" spacing={4}>
                <Button
                  flex={1}
                  colorScheme="green"
                  onClick={() => {
                    setSide('buy');
                    handleTrade();
                  }}
                >
                  Купить {baseAsset}
                </Button>
                <Button
                  flex={1}
                  colorScheme="red"
                  onClick={() => {
                    setSide('sell');
                    handleTrade();
                  }}
                >
                  Продать {baseAsset}
                </Button>
              </HStack>

              <VStack w="100%" align="stretch" spacing={2}>
                <Text fontSize="sm" color="gray.400">
                  Доступно:
                </Text>
                <HStack justify="space-between">
                  <Text>
                    {baseAsset}: {formatBalance(baseBalance?.free || '0')}
                  </Text>
                  <Text>
                    USDT: {formatBalance(quoteBalance?.free || '0')}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4}>
              <Select
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
              >
                <option value="2">2x</option>
                <option value="3">3x</option>
                <option value="5">5x</option>
                <option value="10">10x</option>
              </Select>

              {/* Остальной код аналогичен спотовой торговле */}
              {/* Добавляем специфику маржинальной торговли */}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}