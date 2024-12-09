import React from 'react';
import {
  HStack,
  IconButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { 
  ViewIcon, 
  TimeIcon, 
  RepeatIcon, 
  TriangleUpIcon 
} from '@chakra-ui/icons';

interface ChartTypeSelectorProps {
  chartType: string;
  onChartTypeChange: (type: string) => void;
}

export function ChartTypeSelector({ chartType, onChartTypeChange }: ChartTypeSelectorProps) {
  const chartTypes = [
    { label: 'Свечи', value: 'candlestick', icon: ViewIcon },
    { label: 'Линейный', value: 'line', icon: TimeIcon },
    { label: 'Область', value: 'area', icon: RepeatIcon },
    { label: 'Бары', value: 'bars', icon: TriangleUpIcon },
  ];

  return (
    <HStack spacing={1}>
      {chartTypes.map(({ label, value, icon: Icon }) => (
        <Tooltip key={value} label={label} placement="bottom">
          <IconButton
            aria-label={label}
            icon={<Icon />}
            variant={chartType === value ? 'solid' : 'ghost'}
            size="sm"
            onClick={() => onChartTypeChange(value)}
            bg={chartType === value ? 'gray.700' : undefined}
            _hover={{ bg: 'gray.700' }}
          />
        </Tooltip>
      ))}
    </HStack>
  );
}