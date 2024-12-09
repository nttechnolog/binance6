import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  VStack,
  Input,
  HStack,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { SpotMarketTable } from '../components/spot/SpotMarketTable';
import { MarketTrends } from '../components/spot/MarketTrends';
import { useSpotMarkets } from '../hooks/useSpotMarkets';

export function SpotPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('volume');
  const { data: markets, isLoading } = useSpotMarkets();

  const filteredMarkets = markets?.filter(market =>
    market.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMarkets = React.useMemo(() => {
    if (!filteredMarkets) return [];
    
    return [...filteredMarkets].sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return parseFloat(b.volume) - parseFloat(a.volume);
        case 'price':
          return parseFloat(b.lastPrice) - parseFloat(a.lastPrice);
        case 'change':
          return Math.abs(parseFloat(b.priceChangePercent)) - Math.abs(parseFloat(a.priceChangePercent));
        default:
          return 0;
      }
    });
  }, [filteredMarkets, sortBy]);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6}>
          <Box>
            <HStack mb={6}>
              <InputGroup maxW="300px">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Поиск"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select 
                maxW="200px" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="volume">Объем ↓</option>
                <option value="price">Цена ↓</option>
                <option value="change">Изменение ↓</option>
              </Select>
            </HStack>

            <Tabs>
              <TabList>
                <Tab>USDT</Tab>
                <Tab>BTC</Tab>
                <Tab>ETH</Tab>
                <Tab>BNB</Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <SpotMarketTable markets={sortedMarkets} baseAsset="USDT" />
                </TabPanel>
                <TabPanel p={0}>
                  <SpotMarketTable markets={sortedMarkets} baseAsset="BTC" />
                </TabPanel>
                <TabPanel p={0}>
                  <SpotMarketTable markets={sortedMarkets} baseAsset="ETH" />
                </TabPanel>
                <TabPanel p={0}>
                  <SpotMarketTable markets={sortedMarkets} baseAsset="BNB" />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          <MarketTrends markets={markets || []} />
        </Grid>
      </VStack>
    </Container>
  );
}