import React from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Icon,
  Link as ChakraLink,
  Divider,
  useToast,
  Button,
} from '@chakra-ui/react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  Wallet,
  ChartLine,
  Gear,
  ClipboardText,
  Shield,
  Bell,
  Headset,
  Lock,
  SignOut,
} from '@phosphor-icons/react';
import { useAuthStore } from '../../stores/useAuthStore';

const MenuItem = ({ icon, children, to, isActive }: any) => (
  <ChakraLink
    as={Link}
    to={to}
    w="100%"
    p={3}
    borderRadius="md"
    bg={isActive ? 'gray.700' : 'transparent'}
    _hover={{ bg: 'gray.700', textDecoration: 'none' }}
  >
    <HStack spacing={3}>
      <Icon as={icon} boxSize={5} />
      <Text>{children}</Text>
    </HStack>
  </ChakraLink>
);

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast({
      title: 'Выход выполнен успешно',
      status: 'success',
      duration: 2000,
    });
  };

  const menuItems = [
    { icon: Users, label: 'Пользователи', path: '/admin/users' },
    { icon: Wallet, label: 'Балансы', path: '/admin/balances' },
    { icon: ChartLine, label: 'Статистика', path: '/admin/statistics' },
    { icon: ClipboardText, label: 'Аудит', path: '/admin/audit' },
    { icon: Shield, label: 'Верификация', path: '/admin/verification' },
    { icon: Bell, label: 'Уведомления', path: '/admin/notifications' },
    { icon: Headset, label: 'Поддержка', path: '/admin/support' },
    { icon: Lock, label: 'Безопасность', path: '/admin/security' },
    { icon: Gear, label: 'Настройки', path: '/admin/settings' },
  ];

  return (
    <Flex minH="calc(100vh - 60px)" mt="60px">
      <Box w="250px" bg="gray.800" p={4} borderRight="1px" borderColor="gray.700">
        <VStack align="stretch" spacing={1}>
          <HStack p={3} justify="space-between">
            <Text fontSize="lg" fontWeight="bold">
              Панель управления
            </Text>
          </HStack>

          <Box p={3} bg="gray.700" borderRadius="md" mb={2}>
            <Text fontSize="sm" color="gray.400">
              {user?.email}
            </Text>
            <Text fontSize="sm" fontWeight="medium">
              {user?.role === 'admin' ? 'Администратор' : 'Модератор'}
            </Text>
          </Box>

          <Divider my={2} />

          {menuItems.map((item) => (
            <MenuItem
              key={item.path}
              icon={item.icon}
              to={item.path}
              isActive={location.pathname === item.path}
            >
              {item.label}
            </MenuItem>
          ))}

          <Divider my={2} />

          <Button
            leftIcon={<SignOut weight="bold" />}
            variant="ghost"
            justifyContent="flex-start"
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </VStack>
      </Box>
      <Box flex={1} p={6} bg="gray.900">
        <Outlet />
      </Box>
    </Flex>
  );
}