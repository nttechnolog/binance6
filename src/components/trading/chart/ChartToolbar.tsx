import React from 'react';
import {
  HStack,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Divider,
  Box,
  Text,
} from '@chakra-ui/react';
import { 
  SettingsIcon, 
  TimeIcon, 
  ViewIcon, 
  DownloadIcon,
  CopyIcon,
  InfoIcon
} from '@chakra-ui/icons';
import { ChartTimeSelector } from './ChartTimeSelector';
import { ChartTypeSelector } from './ChartTypeSelector';
import { ChartIndicators } from './ChartIndicators';

interface ChartToolbarProps {
  interval: string;
  onIntervalChange: (interval: string) => void;
  chartType: string;
  onChartTypeChange: (type: string) => void;
}

export function ChartToolbar({
  interval,
  onIntervalChange,
  chartType,
  onChartTypeChange
}: ChartToolbarProps) {
  return (
    <HStack 
      spacing={2} 
      p={2} 
      bg="gray.800" 
      borderBottom="1px" 
      borderColor="gray.700"
      overflowX="auto"
      className="chart-toolbar"
    >
      <ChartTimeSelector 
        interval={interval} 
        onIntervalChange={onIntervalChange} 
      />
      
      <Divider orientation="vertical" h="24px" />
      
      <ChartTypeSelector 
        chartType={chartType} 
        onChartTypeChange={onChartTypeChange} 
      />
      
      <Divider orientation="vertical" h="24px" />
      
      <ChartIndicators />
      
      <Divider orientation="vertical" h="24px" />
      
      <HStack spacing={1}>
        <Tooltip label="Настройки графика" placement="bottom">
          <IconButton
            aria-label="Настройки графика"
            icon={<SettingsIcon />}
            variant="ghost"
            size="sm"
          />
        </Tooltip>
        
        <Tooltip label="Временные зоны" placement="bottom">
          <IconButton
            aria-label="Временные зоны"
            icon={<TimeIcon />}
            variant="ghost"
            size="sm"
          />
        </Tooltip>
        
        <Menu>
          <Tooltip label="Вид графика" placement="bottom">
            <MenuButton
              as={IconButton}
              aria-label="Вид графика"
              icon={<ViewIcon />}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
          <MenuList bg="gray.800">
            <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
              Обычный вид
            </MenuItem>
            <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
              Торговый вид
            </MenuItem>
            <MenuItem bg="gray.800" _hover={{ bg: 'gray.700' }}>
              Вид с глубиной рынка
            </MenuItem>
          </MenuList>
        </Menu>
        
        <Tooltip label="Скачать CSV" placement="bottom">
          <IconButton
            aria-label="Скачать CSV"
            icon={<DownloadIcon />}
            variant="ghost"
            size="sm"
          />
        </Tooltip>
        
        <Tooltip label="Скопировать ссылку" placement="bottom">
          <IconButton
            aria-label="Скопировать ссылку"
            icon={<CopyIcon />}
            variant="ghost"
            size="sm"
          />
        </Tooltip>
      </HStack>
    </HStack>
  );
}