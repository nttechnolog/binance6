import React from 'react';
import {
  Box,
  Container,
  Grid,
  VStack,
  Text,
  Button,
  HStack,
  Link,
  Image,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../hooks/useAuth';
import { PopularCoins } from '../components/market/PopularCoins';
import { NewsWidget } from '../components/market/NewsWidget';
import { db } from '../db/db';
import { ArrowRightIcon } from '@chakra-ui/icons';

export function Markets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    'linear(to-r, yellow.400, yellow.500)',
    'linear(to-r, yellow.200, yellow.300)'
  );

  // Получаем баланс пользователя
  const { data: balances } = useQuery(
    ['balances', user?.id],
    async () => {
      if (!user?.id) return [];
      return await db.balances.where('userId').equals(user.id).toArray();
    },
    {
      enabled: !!user?.id,
      staleTime: 1000,
      cacheTime: 2000,
    }
  );

  // Получаем курс BTC/USDT
  const { data: btcPrice } = useQuery(
    'btc-price',
    async () => {
      const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
      const data = await response.json();
      return parseFloat(data.price);
    },
    {
      refetchInterval: 5000,
      staleTime: 1000,
      cacheTime: 2000,
    }
  );

  // Расчет общего баланса в BTC
  const totalBalance = React.useMemo(() => {
    if (!balances || !btcPrice) return 0;
    return balances.reduce((sum, balance) => {
      if (balance.asset === 'BTC') {
        return sum + parseFloat(balance.free);
      }
      // Для простоты конвертируем все в BTC через USDT
      return sum + (parseFloat(balance.free) / btcPrice);
    }, 0);
  }, [balances, btcPrice]);

  // Расчет PNL (пока заглушка, в реальном приложении нужно считать по историческим данным)
  const pnl = {
    amount: 0,
    percentage: 0
  };

  return (
    <Box>
      <Box bg="gray.900" py={20}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
            <VStack align="flex-start" spacing={8}>
              {user ? (
                <>
                  <VStack align="flex-start" spacing={4} w="100%">
                    <Text fontSize="2xl" fontWeight="bold">
                      Добро пожаловать, {user.name}!
                    </Text>
                    
                    <Box 
                      w="100%" 
                      bg="gray.800" 
                      p={6} 
                      borderRadius="xl"
                      border="1px"
                      borderColor="gray.700"
                    >
                      <VStack align="stretch" spacing={4}>
                        <HStack justify="space-between">
                          <Text color="gray.400">Ваш ориентировочный баланс</Text>
                          <Text fontSize="xl" fontWeight="bold">
                            {totalBalance.toFixed(8)} BTC
                          </Text>
                        </HStack>
                        
                        <HStack justify="space-between">
                          <Text color="gray.400">PNL за сегодня</Text>
                          <Text 
                            color={pnl.amount >= 0 ? 'green.400' : 'red.400'}
                            fontSize="lg"
                          >
                            {pnl.amount.toFixed(2)} ₽ ({pnl.percentage.toFixed(2)}%)
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>

                    <HStack spacing={4}>
                      <Button 
                        as={Link} 
                        href="/trading/BTCUSDT"
                        colorScheme="yellow"
                        size="lg"
                        rightIcon={<ArrowRightIcon />}
                      >
                        Начать торговлю
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate('/profile')}
                      >
                        Мой профиль
                      </Button>
                    </HStack>
                  </VStack>
                </>
              ) : (
                <>
                  <Text fontSize="5xl" fontWeight="bold" lineHeight="1.2">
                    Покупайте крипту с низкими комиссиями на{' '}
                    <Text as="span" bgGradient={bgGradient} bgClip="text">
                      Binance
                    </Text>
                  </Text>
                  
                  <Button
                    colorScheme="yellow"
                    size="lg"
                    rightIcon={<ArrowRightIcon />}
                    onClick={() => navigate('/register')}
                  >
                    Начать сейчас
                  </Button>
                </>
              )}
            </VStack>

            <Box>
              <PopularCoins />
              <NewsWidget />
            </Box>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}