import React from 'react';
import {
  VStack,
  HStack,
  Select,
  Input,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

interface P2PFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export function P2PFilters({ onFiltersChange }: P2PFiltersProps) {
  const [priceRange, setPriceRange] = React.useState([0, 100]);
  const [volumeRange, setVolumeRange] = React.useState([0, 100]);

  const handleFilterChange = (field: string, value: any) => {
    onFiltersChange({ [field]: value });
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>Криптовалюта</FormLabel>
          <Select onChange={(e) => handleFilterChange('asset', e.target.value)}>
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="USDT">Tether (USDT)</option>
            <option value="BNB">BNB</option>
            <option value="BUSD">BUSD</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Способ оплаты</FormLabel>
          <Select onChange={(e) => handleFilterChange('payment', e.target.value)}>
            <option value="all">Все способы</option>
            <option value="bank">Банковский перевод</option>
            <option value="card">Банковская карта</option>
            <option value="cash">Наличные</option>
          </Select>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>Диапазон цен</FormLabel>
        <RangeSlider
          defaultValue={priceRange}
          min={0}
          max={100}
          onChange={(value) => {
            setPriceRange(value);
            handleFilterChange('priceRange', value);
          }}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <Text fontSize="sm" color="gray.500">
          {priceRange[0]} - {priceRange[1]} USDT
        </Text>
      </FormControl>

      <FormControl>
        <FormLabel>Объем торгов</FormLabel>
        <RangeSlider
          defaultValue={volumeRange}
          min={0}
          max={100}
          onChange={(value) => {
            setVolumeRange(value);
            handleFilterChange('volumeRange', value);
          }}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <Text fontSize="sm" color="gray.500">
          {volumeRange[0]} - {volumeRange[1]}K USDT
        </Text>
      </FormControl>
    </VStack>
  );
}