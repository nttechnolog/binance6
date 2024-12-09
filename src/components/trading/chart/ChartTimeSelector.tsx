import React from 'react';
import {
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface ChartTimeSelectorProps {
  interval: string;
  onIntervalChange: (interval: string) => void;
}

export function ChartTimeSelector({ interval, onIntervalChange }: ChartTimeSelectorProps) {
  const timeframes = [
    { label: '1м', value: '1m' },
    { label: '3м', value: '3m' },
    { label: '5м', value: '5m' },
    { label: '15м', value: '15m' },
    { label: '30м', value: '30m' },
    { label: '1ч', value: '1h' },
    { label: '2ч', value: '2h' },
    { label: '4ч', value: '4h' },
    { label: '6ч', value: '6h' },
    { label: '12ч', value: '12h' },
    { label: '1д', value: '1d' },
    { label: '3д', value: '3d' },
    { label: '1н', value: '1w' },
    { label: '1м', value: '1M' },
  ];

  const commonTimeframes = timeframes.slice(0, 6);
  const otherTimeframes = timeframes.slice(6);

  return (
    <HStack spacing={1}>
      {commonTimeframes.map(({ label, value }) => (
        <Button
          key={value}
          size="sm"
          variant={interval === value ? 'solid' : 'ghost'}
          onClick={() => onIntervalChange(value)}
          bg={interval === value ? 'gray.700' : undefined}
          _hover={{ bg: 'gray.700' }}
          px={3}
        >
          {label}
        </Button>
      ))}
      
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          size="sm"
          variant="ghost"
          _hover={{ bg: 'gray.700' }}
        >
          Ещё
        </MenuButton>
        <MenuList bg="gray.800">
          {otherTimeframes.map(({ label, value }) => (
            <MenuItem
              key={value}
              onClick={() => onIntervalChange(value)}
              bg="gray.800"
              _hover={{ bg: 'gray.700' }}
            >
              <Text>{label}</Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </HStack>
  );
}