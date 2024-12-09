import React, { useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

export function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { login, isLoading, user } = useAdminAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: 'Ошибка авторизации',
        description: error instanceof Error ? error.message : 'Проверьте данные для входа',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Если пользователь уже авторизован, перенаправляем на дашборд
  if (user) {
    return null;
  }

  return (
    <Container maxW="container.sm" py={20}>
      <VStack spacing={8}>
        <Image src="/binance-logo.svg" h="40px" />
        <Box w="100%" bg="gray.800" p={8} borderRadius="lg">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Text fontSize="2xl" fontWeight="bold">
                Вход в админ-панель
              </Text>
              
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel>Пароль</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="yellow"
                size="lg"
                width="100%"
                isLoading={isLoading}
              >
                Войти
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
}