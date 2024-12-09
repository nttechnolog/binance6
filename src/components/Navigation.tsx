import { useState } from 'react';
import {
  Box,
  Container,
  Flex,
  Button,
  IconButton,
  HStack,
  Select,
  useDisclosure,
  Tooltip,
  Image,
  Text,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Bell, Globe, Gift, ArrowsClockwise, ShieldCheck } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './auth/AuthModal';
import { UserMenu } from './navigation/UserMenu';
import { WalletMenu } from './navigation/WalletMenu';
import { MainMenu } from './navigation/MainMenu';
import { SearchModal } from './search/SearchModal';
import { ThemeCustomizer } from './theme/ThemeCustomizer';

export function Navigation() {
  const { language, setLanguage } = useLanguage();
  const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure();
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();
  const { isOpen: isThemeOpen, onOpen: onThemeOpen, onClose: onThemeClose } = useDisclosure();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    onAuthOpen();
  };

  return (
    <Box 
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="gray.900" 
      borderBottom="1px" 
      borderColor="gray.700"
      zIndex={1000}
    >
      <Container maxW="container.xl" px={4}>
        <Flex h="60px" align="center" justify="space-between">
          <HStack spacing={4} flex={1}>
            <Link to="/">
              <HStack spacing={2}>
                <Image src="/tradepx-logo.svg" alt="Trade PX" height="24px" />
                <Text color="yellow.400" fontWeight="bold" fontSize="lg">
                  Trade PX
                </Text>
              </HStack>
            </Link>

            <MainMenu />
          </HStack>

          <HStack spacing={2} flex="none">
            <Tooltip label="Поиск" placement="bottom">
              <IconButton
                aria-label="Поиск"
                icon={<SearchIcon />}
                variant="ghost"
                color="gray.300"
                onClick={onSearchOpen}
              />
            </Tooltip>

            <Button
              colorScheme="yellow"
              size="sm"
              leftIcon={<ArrowsClockwise weight="bold" />}
            >
              Пополнение
            </Button>

            <WalletMenu />

            <Tooltip label="Уведомления" placement="bottom">
              <IconButton
                aria-label="Уведомления"
                icon={<Bell weight="bold" />}
                variant="ghost"
                color="gray.300"
                size="sm"
              />
            </Tooltip>

            <Tooltip label="Награды" placement="bottom">
              <IconButton
                aria-label="Награды"
                icon={<Gift weight="bold" />}
                variant="ghost"
                color="gray.300"
                size="sm"
              />
            </Tooltip>

            <Select
              size="sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'ru' | 'en')}
              variant="filled"
              width="100px"
              icon={<Globe weight="bold" />}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </Select>
            
            {user?.role === 'admin' && (
              <Tooltip label="Панель управления" placement="bottom">
                <Button
                  leftIcon={<ShieldCheck weight="bold" />}
                  variant="ghost"
                  color="gray.300"
                  onClick={handleAdminClick}
                  size="sm"
                >
                  Администрирование
                </Button>
              </Tooltip>
            )}

            {user ? (
              <UserMenu user={user} onLogout={logout} />
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  color="gray.300"
                  onClick={() => handleAuthClick('login')}
                  size="sm"
                >
                  Войти
                </Button>
                <Button 
                  colorScheme="yellow"
                  onClick={() => handleAuthClick('register')}
                  size="sm"
                >
                  Регистрация
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Container>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={onAuthClose}
        initialMode={authMode}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={onSearchClose}
      />

      <ThemeCustomizer
        isOpen={isThemeOpen}
        onClose={onThemeClose}
      />
    </Box>
  );
}