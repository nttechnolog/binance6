import React from 'react';
import {
  VStack,
  HStack,
  Text,
  Link,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Image,
  Button,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { useMarketData } from '../../hooks/useMarketData';

export function NewsWidget() {
  const { news } = useMarketData();
  const { isOpen, onToggle } = useDisclosure();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderNewsItem = (item: any, source: 'cryptoCompare' | 'coinGecko', index: number) => {
    const imageUrl = source === 'cryptoCompare' ? item.imageurl : item.thumb_2x;
    const title = item.title;
    const url = item.url;
    const author = source === 'cryptoCompare' ? item.source_info?.name : item.author;
    const timestamp = source === 'cryptoCompare' 
      ? formatDate(item.published_on)
      : new Date(item.published_at).toLocaleString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        });

    return (
      <Link 
        key={`${source}-${index}`}
        href={url}
        target="_blank"
        _hover={{ textDecoration: 'none' }}
      >
        <HStack spacing={4}>
          <Image 
            src={imageUrl} 
            boxSize="50px"
            objectFit="cover"
            borderRadius="md"
            fallbackSrc="https://via.placeholder.com/50"
          />
          <VStack align="start" flex={1}>
            <Text color="gray.300" noOfLines={2} fontSize="sm">
              {title}
            </Text>
            <HStack spacing={4}>
              <Text color="gray.500" fontSize="xs">
                {author}
              </Text>
              <Text color="gray.500" fontSize="xs">
                {timestamp}
              </Text>
            </HStack>
          </VStack>
        </HStack>
      </Link>
    );
  };

  return (
    <VStack align="stretch" bg="gray.800" p={6} borderRadius="lg" mt={4}>
      <Tabs variant="unstyled">
        <HStack justify="space-between" mb={4}>
          <TabList>
            <Tab
              _selected={{
                color: 'yellow.400',
                borderBottom: '2px solid',
                borderColor: 'yellow.400'
              }}
              _hover={{ color: 'yellow.400' }}
            >
              Новости CryptoCompare
            </Tab>
            <Tab
              _selected={{
                color: 'yellow.400',
                borderBottom: '2px solid',
                borderColor: 'yellow.400'
              }}
              _hover={{ color: 'yellow.400' }}
            >
              Новости CoinGecko
            </Tab>
          </TabList>
          <Link color="gray.400" fontSize="sm" href="https://www.cryptocompare.com/news/" isExternal>
            Все новости
          </Link>
        </HStack>

        <TabPanels>
          <TabPanel p={0}>
            <VStack align="stretch" spacing={3}>
              {Array.isArray(news.cryptoCompare) && news.cryptoCompare.slice(0, 5).map((item, index) => 
                renderNewsItem(item, 'cryptoCompare', index)
              )}
              {Array.isArray(news.cryptoCompare) && news.cryptoCompare.length > 5 && (
                <>
                  <Collapse in={isOpen}>
                    <VStack align="stretch" spacing={3} mt={3}>
                      {news.cryptoCompare.slice(5).map((item, index) => 
                        renderNewsItem(item, 'cryptoCompare', index + 5)
                      )}
                    </VStack>
                  </Collapse>
                  <Button 
                    onClick={onToggle} 
                    variant="ghost" 
                    size="sm"
                    color="yellow.400"
                    _hover={{ bg: 'gray.700' }}
                  >
                    {isOpen ? 'Показать меньше' : 'Показать больше'}
                  </Button>
                </>
              )}
            </VStack>
          </TabPanel>

          <TabPanel p={0}>
            <VStack align="stretch" spacing={3}>
              {Array.isArray(news.coinGecko) && news.coinGecko.slice(0, 5).map((item, index) => 
                renderNewsItem(item, 'coinGecko', index)
              )}
              {Array.isArray(news.coinGecko) && news.coinGecko.length > 5 && (
                <>
                  <Collapse in={isOpen}>
                    <VStack align="stretch" spacing={3} mt={3}>
                      {news.coinGecko.slice(5).map((item, index) => 
                        renderNewsItem(item, 'coinGecko', index + 5)
                      )}
                    </VStack>
                  </Collapse>
                  <Button 
                    onClick={onToggle} 
                    variant="ghost" 
                    size="sm"
                    color="yellow.400"
                    _hover={{ bg: 'gray.700' }}
                  >
                    {isOpen ? 'Показать меньше' : 'Показать больше'}
                  </Button>
                </>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}