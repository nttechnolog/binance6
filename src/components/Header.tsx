import { Box, Flex, Image } from '@chakra-ui/react';

export function Header() {
  return (
    <Box bg="gray.900" py={4} px={6} borderBottom="1px" borderColor="gray.700">
      <Flex align="center" maxW="container.xl" mx="auto">
        <Image src="/binance-logo.svg" h="32px" />
      </Flex>
    </Box>
  );
}