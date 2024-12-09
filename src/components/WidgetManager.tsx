import React from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  useColorMode,
  Popover,
  PopoverTrigger,
  PopoverContent,
  VStack,
  Text,
  Button,
  Divider,
  Tooltip,
} from '@chakra-ui/react';
import { AddIcon, SettingsIcon } from '@chakra-ui/icons';
import { useLanguage } from '../contexts/LanguageContext';

interface WidgetManagerProps {
  visibleWidgets: Record<string, boolean>;
  onAddWidget: (widgetId: string) => void;
}

export function WidgetManager({ visibleWidgets, onAddWidget }: WidgetManagerProps) {
  const { t } = useLanguage();
  const { colorMode } = useColorMode();

  const availableWidgets = [
    { id: 'chart', name: 'График' },
    { id: 'orderbook', name: 'Стакан' },
    { id: 'trades', name: 'История сделок' },
    { id: 'trade', name: 'Торговля' },
    { id: 'positions', name: 'Позиции' },
  ];

  const hiddenWidgets = availableWidgets.filter(widget => !visibleWidgets[widget.id]);

  return (
    <Box
      position="fixed"
      bottom="4"
      right="4"
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      borderRadius="lg"
      boxShadow="lg"
      p="2"
      zIndex={1000}
    >
      <HStack spacing={2}>
        {hiddenWidgets.length > 0 && (
          <Tooltip label="Добавить виджет" placement="top">
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<AddIcon />}
                variant="ghost"
                size="sm"
                aria-label="Добавить виджет"
              />
              <MenuList>
                {hiddenWidgets.map(widget => (
                  <MenuItem
                    key={widget.id}
                    onClick={() => onAddWidget(widget.id)}
                  >
                    {widget.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Tooltip>
        )}
        
        <Popover placement="top-end">
          <PopoverTrigger>
            <Tooltip label="Настройки виджетов" placement="top">
              <IconButton
                icon={<SettingsIcon />}
                variant="ghost"
                size="sm"
                aria-label="Настройки"
              />
            </Tooltip>
          </PopoverTrigger>
          <PopoverContent p={4} width="300px">
            <VStack align="stretch" spacing={4}>
              <Text fontWeight="bold">Управление виджетами</Text>
              <VStack align="stretch">
                {availableWidgets.map(widget => (
                  <HStack key={widget.id} justify="space-between">
                    <Text>{widget.name}</Text>
                    <Button
                      size="sm"
                      variant={visibleWidgets[widget.id] ? "solid" : "outline"}
                      onClick={() => onAddWidget(widget.id)}
                      isDisabled={visibleWidgets[widget.id]}
                      colorScheme={visibleWidgets[widget.id] ? "yellow" : "gray"}
                    >
                      {visibleWidgets[widget.id] ? "Активен" : "Добавить"}
                    </Button>
                  </HStack>
                ))}
              </VStack>
              <Divider />
              <Text fontSize="sm" color="gray.500">
                Перетащите виджеты за заголовок для изменения их расположения
              </Text>
            </VStack>
          </PopoverContent>
        </Popover>
      </HStack>
    </Box>
  );
}