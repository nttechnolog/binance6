import React from 'react';
import {
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';

export function MainMenu() {
  const location = useLocation();

  return (
    <HStack spacing={1}>
      <Button
        as={Link}
        to="/spot"
        variant="ghost"
        color="gray.300"
        size="sm"
        bg={location.pathname === '/spot' ? 'gray.700' : undefined}
      >
        Спот
      </Button>

      <Button
        as={Link}
        to="/margin"
        variant="ghost"
        color="gray.300"
        size="sm"
        bg={location.pathname === '/margin' ? 'gray.700' : undefined}
      >
        Маржа
      </Button>

      <Button
        as={Link}
        to="/p2p"
        variant="ghost"
        color="gray.300"
        size="sm"
        bg={location.pathname === '/p2p' ? 'gray.700' : undefined}
      >
        P2P
      </Button>

      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" color="gray.300" size="sm">
          Фьючерсы
        </MenuButton>
        <MenuList bg="gray.800">
          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>USD-M Фьючерсы</MenuItem>
          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>COIN-M Фьючерсы</MenuItem>
        </MenuList>
      </Menu>

      <Button variant="ghost" color="gray.300" size="sm">
        Earn
      </Button>

      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" color="gray.300" size="sm">
          Square
        </MenuButton>
        <MenuList bg="gray.800">
          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>NFT</MenuItem>
          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>Fan Token</MenuItem>
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" color="gray.300" size="sm">
          Подробнее
        </MenuButton>
        <MenuList bg="gray.800">
          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>О нас</MenuItem>
          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>Блог</MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
}