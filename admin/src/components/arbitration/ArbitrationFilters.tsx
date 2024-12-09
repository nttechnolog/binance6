import React from 'react';
import {
  HStack,
  Input,
  Select,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useArbitrationStore } from '../../stores/useArbitrationStore';

export function ArbitrationFilters() {
  const { setFilters } = useArbitrationStore();

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ [field]: value });
  };

  return (
    <HStack spacing={4}>
      <FormControl maxW="200px">
        <FormLabel>Поиск по ID</FormLabel>
        <Input
          placeholder="ID спора"
          onChange={(e) => handleFilterChange('id', e.target.value)}
        />
      </FormControl>

      <FormControl maxW="200px">
        <FormLabel>Статус</FormLabel>
        <Select onChange={(e) => handleFilterChange('status', e.target.value)}>
          <option value="">Все статусы</option>
          <option value="new">Новые</option>
          <option value="in_progress">В работе</option>
          <option value="waiting_info">Ожидают информации</option>
          <option value="proposed">Предложено решение</option>
          <option value="resolved">Решенные</option>
          <option value="closed">Закрытые</option>
        </Select>
      </FormControl>

      <FormControl maxW="200px">
        <FormLabel>Сортировка</FormLabel>
        <Select onChange={(e) => handleFilterChange('sort', e.target.value)}>
          <option value="date_desc">Сначала новые</option>
          <option value="date_asc">Сначала старые</option>
          <option value="amount_desc">По сумме (убыв.)</option>
          <option value="amount_asc">По сумме (возр.)</option>
        </Select>
      </FormControl>
    </HStack>
  );
}