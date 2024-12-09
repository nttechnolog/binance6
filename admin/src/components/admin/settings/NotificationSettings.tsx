import React from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Switch,
  Input,
  Button,
  useToast,
  Text,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { useMutation } from 'react-query';
import { db } from '../../../db/db';

export function NotificationSettings() {
  const toast = useToast();
  const [settings, setSettings] = React.useState({
    emailNotifications: {
      enabled: true,
      smtpHost: '',
      smtpPort: '',
      smtpUser: '',
      smtpPassword: '',
      fromEmail: '',
    },
    telegramNotifications: {
      enabled: false,
      botToken: '',
      chatId: '',
    },
    events: {
      userRegistration: true,
      loginAttempts: true,
      securityAlerts: true,
      systemUpdates: false,
    }
  });

  const mutation = useMutation(
    async (newSettings: any) => {
      // В реальном приложении здесь будет сохранение через API
      await db.auditLogs.add({
        userId: 1,
        action: 'notification_settings_update',
        details: 'Обновлены настройки уведомлений',
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
        <Text fontSize="xl" fontWeight="bold">Настройки уведомлений</Text>

        <Box>
          <Text fontWeight="bold" mb={4}>Email уведомления</Text>
          <VStack spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Включить email уведомления
              </FormLabel>
              <Switch
                isChecked={settings.emailNotifications.enabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    enabled: e.target.checked
                  }
                }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>SMTP Хост</FormLabel>
              <Input
                value={settings.emailNotifications.smtpHost}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    smtpHost: e.target.value
                  }
                }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>SMTP Порт</FormLabel>
              <Input
                value={settings.emailNotifications.smtpPort}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    smtpPort: e.target.value
                  }
                }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>SMTP Пользователь</FormLabel>
              <Input
                value={settings.emailNotifications.smtpUser}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    smtpUser: e.target.value
                  }
                }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>SMTP Пароль</FormLabel>
              <Input
                type="password"
                value={settings.emailNotifications.smtpPassword}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    smtpPassword: e.target.value
                  }
                }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email отправителя</FormLabel>
              <Input
                value={settings.emailNotifications.fromEmail}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    fromEmail: e.target.value
                  }
                }))}
              />
            </FormControl>
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Text fontWeight="bold" mb={4}>Telegram уведомления</Text>
          <VStack spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Включить Telegram уведомления
              </FormLabel>
              <Switch
                isChecked={settings.telegramNotifications.enabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  telegramNotifications: {
                    ...prev.telegramNotifications,
                    enabled: e.target.checked
                  }
                }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Токен бота</FormLabel>
              <Input
                value={settings.telegramNotifications.botToken}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  telegramNotifications: {
                    ...prev.telegramNotifications,
                    botToken: e.target.value
                  }
                }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>ID чата</FormLabel>
              <Input
                value={settings.telegramNotifications.chatId}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  telegramNotifications: {
                    ...prev.telegramNotifications,
                    chatId: e.target.value
                  }
                }))}
              />
            </FormControl>
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Text fontWeight="bold" mb={4}>События для уведомлений</Text>
          <VStack spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Регистрация пользователей
              </FormLabel>
              <Switch
                isChecked={settings.events.userRegistration}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  events: {
                    ...prev.events,
                    userRegistration: e.target.checked
                  }
                }))}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Попытки входа
              </FormLabel>
              <Switch
                isChecked={settings.events.loginAttempts}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  events: {
                    ...prev.events,
                    loginAttempts: e.target.checked
                  }
                }))}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Предупреждения безопасности
              </FormLabel>
              <Switch
                isChecked={settings.events.securityAlerts}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  events: {
                    ...prev.events,
                    securityAlerts: e.target.checked
                  }
                }))}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Системные обновления
              </FormLabel>
              <Switch
                isChecked={settings.events.systemUpdates}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  events: {
                    ...prev.events,
                    systemUpdates: e.target.checked
                  }
                }))}
              />
            </FormControl>
          </VStack>
        </Box>

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