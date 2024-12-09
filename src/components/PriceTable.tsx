import { Table, Thead, Tbody, Tr, Th, Td, Text, Box, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface PriceData {
  symbol: string;
  price: string;
}

interface PriceTableProps {
  prices: PriceData[];
}

export function PriceTable({ prices }: PriceTableProps) {
  const navigate = useNavigate();

  return (
    <Box w="100%" overflowX="auto" bg="gray.800" borderRadius="lg">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th color="gray.400">Pair</Th>
            <Th isNumeric color="gray.400">Price</Th>
            <Th isNumeric color="gray.400">24h Change</Th>
          </Tr>
        </Thead>
        <Tbody>
          {prices.map((price) => (
            <Tr 
              key={price.symbol} 
              _hover={{ bg: 'gray.700', cursor: 'pointer' }}
              onClick={() => navigate(`/trading/${price.symbol}`)}
            >
              <Td>
                <Text color="white" fontWeight="medium">
                  {price.symbol}
                </Text>
              </Td>
              <Td isNumeric>
                <Text color="white">
                  {parseFloat(price.price).toFixed(2)}
                </Text>
              </Td>
              <Td isNumeric>
                <Badge
                  colorScheme={Math.random() > 0.5 ? 'green' : 'red'}
                  px={2}
                  py={1}
                  borderRadius="md"
                >
                  {(Math.random() * 5 - 2.5).toFixed(2)}%
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}