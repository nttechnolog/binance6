import React from 'react';
import {
  Box,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Button,
  useToast,
  HStack,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useQuery, useMutation } from 'react-query';
import { db } from '../../../db/db';

export function SecuritySettings() {
  const toast = useToast();
  const [adminDomain, setAdminDomain] = React.useState('');
  const [ipWhitelist, setIpWhitelist] = React.useState('');
  const [settings, setSettings] = React.useState({
    enableTwoFactor: false,
    requireIpWhitelist: false,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 12,
      requireNumbers: true,
      requireSpecialChars: true,
      requireUppercase: true,
    },
  });

  const { data: currentSettings } = useQuery('admin-security-settings', async () => {
    // В реальном приложении здесь будет запрос к API
    return {
      adminDomain: localStorage.getItem('admin_domain') || '',
      ipWhitelist: localStorage.getItem('ip_whitelist') || '',
      ...settings
    };
  });

  React.useEffect(() => {
    if (currentSettings) {
      setAdminDomain(currentSettings.adminDomain);
      setIpWhitelist(currentSettings.ipWhitelist);
      setSettings(prev => ({ ...prev, ...currentSettings }));
    }
  }, [currentSettings]);

  const mutation = useMutation(
    async (newSettings: any) => {
      // В реальном приложении здесь будет сохранение через API
      localStorage.setItem('admin_domain', newSettings.adminDomain);
      localStorage.setItem('ip_whitelist', newSettings.ipWhitelist);
      
      await db.auditLogs.add({
        userId: 1, // ID админа
        action: 'security_settings_update',
        details: 'Обновлены настройки безопасности',
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
      },
      onError: () => {
        toast({
          title: 'Ошибка',
          description: 'Не удалось сохранить настройки',
          status: 'error',
          duration: 3000,
        });
      }
    }
  );

  const handleSave = () => {
    mutation.mutate({
      adminDomain,
      ipWhitelist,
      ...settings
    });
  };

  return (
    <Box bg="gray.800" p={6} borderRadius="lg">
      <VStack spacing={6} align="stretch">
        <Text fontSize="xl" fontWeight="bold">Настройки безопасности</Text>

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Важно!</AlertTitle>
            <AlertDescription>
              После изменения домена админ-панели необходимо обновить DNS-записи и настроить SSL-сертификат
            </AlertDescription>
          </Box>
        </Alert>

        <Box>
          <Text fontWeight="bold" mb={4}>Настройки домена</Text>
          <FormControl>
            <FormLabel>Домен админ-панели</FormLabel>
            <Input
              placeholder="admin.yourdomain.com"
              value={adminDomain}
              onChange={(e) => setAdminDomain(e.target.value)}
            />
          </FormControl>
        </Box>

        <Divider />

        <Box>
          <Text fontWeight="bold" mb={4}>Контроль доступа</Text>
          <VStack spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Двухфакторная аутентификация
              </FormLabel>
              <Switch
                isChecked={settings.enableTwoFactor}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  enableTwoFactor: e.target.checked
                }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Белый список IP-адресов</FormLabel>
              <Input
                placeholder="Введите IP-адреса через запятую"
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Включить проверку IP-адресов
              </FormLabel>
              <Switch
                isChecked={settings.requireIpWhitelist}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  requireIpWhitelist: e.target.checked
                }))}
              />
            </FormControl>
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Text fontWeight="bold" mb={4}>Политика безопасности</Text>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Максимальное количество попыток входа</FormLabel>
              <Input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  maxLoginAttempts: parseInt(e.target.value)
                }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Тайм-аут сессии (минуты)</FormLabel>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  sessionTimeout: parseInt(e.target.value)
                }))}
              />
            </FormControl>

            <Box w="100%">
              <Text fontWeight="medium" mb={2}>Требования к паролю</Text>
              <VStack align="stretch">
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">
                    Минимальная длина: {settings.passwordPolicy.minLength} символов
                  </FormLabel>
                  <Switch
                    isChecked={settings.passwordPolicy.minLength >= 12}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      passwordPolicy: {
                        ...prev.passwordPolicy,
                        minLength: e.target.checked ? 12 : 8
                      }
                    }))}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">
                    Требовать цифры
                  </FormLabel>
                  <Switch
                    isChecked={settings.passwordPolicy.requireNumbers}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      passwordPolicy: {
                        ...prev.passwordPolicy,
                        requireNumbers: e.target.checked
                      }
                    }))}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">
                    Требовать специальные символы
                  </FormLabel>
                  <Switch
                    isChecked={settings.passwordPolicy.requireSpecialChars}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      passwordPolicy: {
                        ...prev.passwordPolicy,
                        requireSpecialChars: e.target.checked
                      }
                    }))}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">
                    Требовать заглавные буквы
                  </FormLabel>
                  <Switch
                    isChecked={settings.passwordPolicy.requireUppercase}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      passwordPolicy: {
                        ...prev.passwordPolicy,
                        requireUppercase: e.target.checked
                      }
                    }))}
                  />
                </FormControl>
              </VStack>
            </Box>
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