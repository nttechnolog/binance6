import React from 'react';
import { Box, HStack, Text, Link, Flex, Icon, useDisclosure } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { SignalHigh, SignalLow } from 'lucide-react';
import { CookieSettingsModal } from './CookieSettings';

interface TickerData {
  symbol: string;
  priceChangePercent: string;
  lastPrice: string;
}

export function Ticker() {
  const { data: tickers, isError } = useQuery(
    'tickers',
    async () => {
      const symbols = [
        'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 
        'DOGEUSDT', 'ADAUSDT', 'XRPUSDT', 'DOTUSDT'
      ];
      const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr', {
        params: { symbols: JSON.stringify(symbols) }
      });
      return response.data;
    },
    { 
      refetchInterval: 2000,
      retry: 3,
      staleTime: 1000,
      cacheTime: 2000,
      refetchOnWindowFocus: false
    }
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box 
        position="fixed" 
        bottom={0} 
        left={0} 
        right={0} 
        bg="gray.900" 
        borderTop="1px" 
        borderColor="gray.700"
        zIndex={1000}
      >
        <Flex align="center" h="30px">
          <Box 
            bg={isError ? "red.500" : "green.500"} 
            px={2} 
            h="full" 
            display="flex" 
            alignItems="center"
            gap={2}
          >
            <Icon 
              as={isError ? SignalLow : SignalHigh} 
              w={4} 
              h={4}
            />
            <Text fontSize="sm" fontWeight="medium">
              {isError ? "Ошибка соединения" : "Стабильное соединение"}
            </Text>
          </Box>
          
          <Box overflow="hidden" flex={1}>
            <motion.div
              animate={{ x: [0, -2000] }}
              transition={{ 
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <HStack spacing={8} px={4}>
                {tickers?.map((ticker: TickerData) => (
                  <HStack key={ticker.symbol} spacing={1}>
                    <Text fontSize="sm" color="gray.300">{ticker.symbol}</Text>
                    <Text 
                      fontSize="sm" 
                      color={Number(ticker.priceChangePercent) >= 0 ? "green.400" : "red.400"}
                    >
                      {Number(ticker.priceChangePercent) >= 0 ? '+' : ''}{Number(ticker.priceChangePercent).toFixed(2)}%
                    </Text>
                    <Text fontSize="sm" color="white">
                      {Number(ticker.lastPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8
                      })}
                    </Text>
                  </HStack>
                ))}
              </HStack>
            </motion.div>
          </Box>

          <HStack spacing={4} px={4} borderLeft="1px" borderColor="gray.700" h="full">
            <Link fontSize="sm" color="gray.400" href="#" _hover={{ color: 'white' }}>
              Анонсы
            </Link>
            <Link fontSize="sm" color="gray.400" href="#" _hover={{ color: 'white' }}>
              Отказ от ответственности
            </Link>
            <Link fontSize="sm" color="gray.400" href="#" _hover={{ color: 'white' }}>
              Чат
            </Link>
            <Link 
              fontSize="sm" 
              color="gray.400" 
              onClick={onOpen}
              cursor="pointer"
              _hover={{ color: 'white' }}
            >
              Настройки cookie
            </Link>
          </HStack>
        </Flex>
      </Box>

      <CookieSettingsModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}