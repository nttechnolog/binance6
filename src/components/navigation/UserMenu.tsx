import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Avatar,
  Box,
  Text,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircle,
  ChartLine,
  Wallet,
  Receipt,
  Gift,
  Gear,
  SignOut,
  ShieldCheck,
} from '@phosphor-icons/react';
import { User } from '../../db/db';
import { useAuthStore } from '../../stores/useAuthStore';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const isAdmin = useAuthStore(state => state.isAdmin);
  const isModerator = useAuthStore(state => state.isModerator);
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <Menu>
      <MenuButton>
        <Avatar size="sm" name={user.name} />
      </MenuButton>
      <MenuList bg="gray.800" p={0}>
        <Box px={4} py={3} borderBottom="1px" borderColor="gray.700">
          <Text fontSize="sm" color="gray.400">
            {user.email}
          </Text>
          <Text fontSize="sm" color="gray.300">
            {user.role === 'admin' ? 'Администратор' : 
             user.role === 'moderator' ? 'Модератор' : 
             'Пользователь'}
          </Text>
          <Button
            size="sm"
            variant="outline"
            colorScheme="yellow"
            mt={2}
            width="full"
          >
            {user.isActive ? 'Активен' : 'Не активен'}
          </Button>
        </Box>
        <MenuGroup>
          {(isAdmin() || isModerator()) && (
            <MenuItem 
              onClick={handleAdminClick}
              icon={<ShieldCheck size={20} />}
              bg="gray.800" 
              _hover={{ bg: 'gray.700' }}
            >
              Админ панель
            </MenuItem>
          )}
          <MenuItem 
            icon={<UserCircle size={20} />}
            bg="gray.800" 
            _hover={{ bg: 'gray.700' }}
          >
            Привязать аккаунт X
          </MenuItem>
          <MenuDivider />
          <MenuItem 
            icon={<SignOut size={20} />}
            bg="gray.800" 
            _hover={{ bg: 'gray.700' }}
            onClick={onLogout}
          >
            Выйти
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}