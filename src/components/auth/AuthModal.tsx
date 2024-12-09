import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  Button,
  Input,
  VStack,
  Text,
  useToast,
  FormControl,
  FormLabel,
  Checkbox,
  HStack,
  Image,
  Link,
  Divider,
} from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptCookies, setAcceptCookies] = useState(false);
  
  const { login, register } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'register' && !acceptTerms) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо принять условия использования',
        status: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        toast({
          title: 'Успешный вход',
          status: 'success',
        });
      } else {
        await register(email, password, name);
        toast({
          title: 'Регистрация успешна',
          status: 'success',
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Что-то пошло не так',
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent borderRadius="lg" p={0}>
        <Box p={8}>
          <VStack spacing={6} align="stretch">
            <VStack spacing={2} align="center">
              <Image src="/binance-logo.svg" h="40px" />
              <Text fontSize="2xl" fontWeight="bold">
                {mode === 'login' ? 'Добро пожаловать' : 'Создать аккаунт'}
              </Text>
              <Text color="gray.500" fontSize="sm" textAlign="center">
                {mode === 'login' 
                  ? 'Войдите в свой аккаунт Binance'
                  : 'Зарегистрируйтесь для доступа к Binance'
                }
              </Text>
            </VStack>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    size="lg"
                  />
                </FormControl>

                {mode === 'register' && (
                  <FormControl>
                    <FormLabel>Имя</FormLabel>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Введите ваше имя"
                      size="lg"
                    />
                  </FormControl>
                )}

                <FormControl>
                  <FormLabel>Пароль</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                    size="lg"
                  />
                </FormControl>

                {mode === 'register' && (
                  <VStack spacing={2} align="stretch" w="100%">
                    <Checkbox
                      isChecked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                    >
                      <Text fontSize="sm">
                        Я согласен с{' '}
                        <Link color="yellow.500" href="#" isExternal>
                          Условиями использования
                        </Link>
                        {' '}и{' '}
                        <Link color="yellow.500" href="#" isExternal>
                          Политикой конфиденциальности
                        </Link>
                      </Text>
                    </Checkbox>
                    
                    <Checkbox
                      isChecked={acceptCookies}
                      onChange={(e) => setAcceptCookies(e.target.checked)}
                    >
                      <Text fontSize="sm">
                        Я принимаю использование файлов cookie для улучшения работы сервиса
                      </Text>
                    </Checkbox>
                  </VStack>
                )}

                <Button
                  type="submit"
                  colorScheme="yellow"
                  size="lg"
                  width="100%"
                  isLoading={isLoading}
                  mt={4}
                >
                  {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
                </Button>
              </VStack>
            </form>

            <Divider />

            <VStack spacing={4}>
              <HStack spacing={4}>
                <Button
                  variant="outline"
                  size="lg"
                  width="full"
                  leftIcon={
                    <Image src="https://www.google.com/favicon.ico" boxSize="20px" />
                  }
                >
                  Google
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  width="full"
                  leftIcon={
                    <Image src="https://www.apple.com/favicon.ico" boxSize="20px" />
                  }
                >
                  Apple
                </Button>
              </HStack>

              <Text fontSize="sm" color="gray.500">
                {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                <Button
                  variant="link"
                  colorScheme="yellow"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                >
                  {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
                </Button>
              </Text>
            </VStack>
          </VStack>
        </Box>
      </ModalContent>
    </Modal>
  );
}