import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatPercent } from '../../utils/dataTransforms';

interface SpotMarketTableProps {
  markets: any[];
  baseAsset: string;
}

export function SpotMarketTable({ markets, baseAsset }: SpotMarketTableProps) {
  const navigate = useNavigate();

  const handleTrade = (symbol: string) => {
    navigate(`/trading/${symbol}`);
  };

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Пара</Th>
          <Th isNumeric>Цена</Th>
          <Th isNumeric>Изменение 24ч</Th>
          <Th isNumeric>Объем 24ч</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {markets?.filter(market => market.symbol.endsWith(baseAsset))
          .map((market) => (
            <Tr key={market.symbol} _hover={{ bg: 'gray.700', cursor: 'pointer' }}>
              <Td>{market.symbol.replace(baseAsset, '')}</Td>
              <Td isNumeric>{formatPrice(market.lastPrice)}</Td>
              <Td isNumeric color={parseFloat(market.priceChangePercent) >= 0 ? 'green.400' : 'red.400'}>
                {formatPercent(market.priceChangePercent)}
              </Td>
              <Td isNumeric>{formatPrice(market.volume, 0)}</Td>
              <Td>
                <Button 
                  size="sm" 
                  colorScheme="yellow"
                  onClick={() => handleTrade(market.symbol)}
                >
                  Торговать
                </Button>
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
}