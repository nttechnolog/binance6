import React from 'react';
import { HStack, Button, IconButton, Select, Tooltip } from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

interface ChartControlsProps {
  interval: string;
  onIntervalChange: (interval: string) => void;
  chartType: string;
  onChartTypeChange: (type: string) => void;
}

export function ChartControls({ 
  interval, 
  onIntervalChange,
  chartType,
  onChartTypeChange
}: ChartControlsProps) {
  const intervals = [
    { label: '15м', value: '15m' },
    { label: '1ч', value: '1h' },
    { label: '4ч', value: '4h' },
    { label: '1д', value: '1d' },
    { label: '1н', value: '1w' }
  ];

  return (
    <HStack spacing={2} p={2} bg="gray.800" borderBottom="1px" borderColor="gray.700">
      <HStack spacing={1}>
        {intervals.map(({ label, value }) => (
          <Button
            key={value}
            size="sm"
            variant="ghost"
            px={2}
            onClick={() => onIntervalChange(value)}
            bg={interval === value ? 'gray.700' : undefined}
          >
            {label}
          </Button>
        ))}
      </HStack>

      <HStack spacing={2} ml={4}>
        <IconButton
          aria-label="Настройки времени"
          icon={<SettingsIcon />}
          size="sm"
          variant="ghost"
        />
        <IconButton
          aria-label="Индикаторы"
          icon={<span>📊</span>}
          size="sm"
          variant="ghost"
        />
        <IconButton
          aria-label="Сравнить"
          icon={<span>⚖️</span>}
          size="sm"
          variant="ghost"
        />
        <Select
          size="sm"
          variant="filled"
          bg="gray.700"
          width="180px"
          value={chartType}
          onChange={(e) => onChartTypeChange(e.target.value)}
        >
          <option value="price">Базовая версия</option>
          <option value="trading">Trading View</option>
          <option value="depth">Диаграмма глубины</option>
          <option value="mark">Маркировка</option>
          <option value="index">Индекс</option>
        </Select>
      </HStack>
    </HStack>
  );
}