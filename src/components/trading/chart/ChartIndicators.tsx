import React from 'react';
import {
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { AddIcon, StarIcon, InfoIcon } from '@chakra-ui/icons';

export function ChartIndicators() {
  const indicators = [
    { category: 'Трендовые', items: ['MA', 'EMA', 'MACD', 'Bollinger Bands'] },
    { category: 'Осцилляторы', items: ['RSI', 'Stochastic', 'CCI'] },
    { category: 'Объём', items: ['Volume', 'OBV', 'Money Flow Index'] },
    { category: 'Волатильность', items: ['ATR', 'Standard Deviation'] },
  ];

  return (
    <HStack spacing={1}>
      <Menu>
        <Tooltip label="Добавить индикатор" placement="bottom">
          <MenuButton
            as={IconButton}
            aria-label="Добавить индикатор"
            icon={<AddIcon />}
            variant="ghost"
            size="sm"
          />
        </Tooltip>
        <MenuList bg="gray.800">
          {indicators.map(({ category, items }) => (
            <React.Fragment key={category}>
              <Text px={3} py={2} fontSize="sm" color="gray.400">
                {category}
              </Text>
              {items.map(item => (
                <MenuItem
                  key={item}
                  bg="gray.800"
                  _hover={{ bg: 'gray.700' }}
                >
                  {item}
                </MenuItem>
              ))}
            </React.Fragment>
          ))}
        </MenuList>
      </Menu>

      <Menu>
        <Tooltip label="Избранные индикаторы" placement="bottom">
          <MenuButton
            as={IconButton}
            aria-label="Избранные индикаторы"
            icon={<StarIcon />}
            variant="ghost"
            size="sm"
          />
        </Tooltip>
        <MenuList bg="gray.800">
          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
            Сохранить текущие индикаторы
          </MenuItem>
          <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
            Загрузить сохранённые индикаторы
          </MenuItem>
        </MenuList>
      </Menu>

      <Tooltip label="Информация об индикаторах" placement="bottom">
        <IconButton
          aria-label="Информация об индикаторах"
          icon={<InfoIcon />}
          variant="ghost"
          size="sm"
        />
      </Tooltip>
    </HStack>
  );
}