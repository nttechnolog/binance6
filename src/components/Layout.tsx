import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Ticker } from './Ticker';
import { SupportWidget } from './support/SupportWidget';

export function Layout() {
  return (
    <VStack minH="100vh" spacing={0}>
      <Navigation />
      
      <Box as="main" flex="1" w="100%" mt="60px">
        <Outlet />
      </Box>
      
      <Footer />
      <Ticker />
      <SupportWidget />
    </VStack>
  );
}