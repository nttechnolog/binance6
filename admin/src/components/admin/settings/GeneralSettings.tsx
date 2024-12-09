import React from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  Switch,
  Text,
  HStack,
} from '@chakra-ui/react';
import { useMutation } from 'react-query';
import { db } from '../../../db/db';

export function GeneralSettings() {
  const toast = useToast();
  const [settings, setSettings] = React.useState({
    siteName: 'Binance Admin',
    language: 'ru',
    timezone: 'Europe/Moscow',
    maintenanceMode: false,
    registrationEnabled: true,
    defaultUserRole: 'user',
  });

  const mutation = useMutation(
    async (newSettings: any) => {
      // В реальном приложении здесь будет сохранение через API
      await db.auditLogs.add({
        userId: 1,
        action: 'general_settings_update',
        details: 'Обновлены общие настройки',
        timestamp: new Date()
      });
      return newSettings;
    },
    {
      onSuccess: () => {
        toast({
          title: 'Настройки сохранены',
          status: 'success',
          duration: 3000,
        });
      }
    }
  );

  const handleSave = () => {
    mutation.mutate(settings);
  };

  return (
    <Box bg="gray.800" p={6} borderRadius="lg">
      <VStack spacing={6} align="stretch">
        <Text fontSize="xl" fontWeight="bold">Общие настройки</Text>

        <FormControl>
          <FormLabel>Название сайта</FormLabel>
          <Input
            value={settings.siteName}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              siteName: e.target.value
            }))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Язык интерфейса</FormLabel>
          <Select
            value={settings.language}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              language: e.target.value
            }))}
          >
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Часовой пояс</FormLabel>
          <Select
            value={settings.timezone}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              timezone: e.target.value
            }))}
          >
            <option value="Europe/Moscow">Москва (UTC+3)</option>
            <option value="Europe/London">Лондон (UTC+0)</option>
            <option value="America/New_York">Нью-Йорк (UTC-5)</option>
          </Select>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">
            Режим обслуживания
          </FormLabel>
          <Switch
            isChecked={settings.maintenanceMode}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              maintenanceMode: e.target.checked
            }))}
          />
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">
            Регистрация пользователей
          </FormLabel>
          <Switch
            isChecked={settings.registrationEnabled}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              registrationEnabled: e.target.checked
            }))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Роль по умолчанию</FormLabel>
          <Select
            value={settings.defaultUserRole}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              defaultUserRole: e.target.value
            }))}
          >
            <option value="user">Пользователь</option>
            <option value="moderator">Модератор</option>
          </Select>
        </FormControl>

        <HStack justify="flex-end">
          <Button
            colorScheme="yellow"
            onClick={handleSave}
            isLoading={mutation.isLoading}
          >
            Сохранить настройки
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}