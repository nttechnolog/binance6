import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {
  Wallet,
  Bank,
  ChartLine,
  Coins,
  Robot,
  Receipt,
  ClipboardText,
  ShieldCheck,
} from '@phosphor-icons/react';

export function WalletMenu() {
  return (
    <Menu>
      <Tooltip label="Кошелек" placement="bottom">
        <MenuButton
          as={IconButton}
          icon={<Wallet weight="bold" />}
          variant="ghost"
          color="gray.300"
        />
      </Tooltip>
      <MenuList bg="gray.800" p={0}>
        <MenuItem icon={<Bank size={20} />} bg="gray.800" _hover={{ bg: 'gray.700' }}>
          Обзор кошелька
        </MenuItem>
        <MenuItem icon={<ChartLine size={20} />} bg="gray.800" _hover={{ bg: 'gray.700' }}>
          Спот
        </MenuItem>
        <MenuItem icon={<Coins size={20} />} bg="gray.800" _hover={{ bg: 'gray.700' }}>
          Маржинальный кошелек
        </MenuItem>
        <MenuItem icon={<ChartLine size={20} />} bg="gray.800" _hover={{ bg: 'gray.700' }}>
          Фьючерсный кошелек
        </MenuItem>
        <MenuItem icon={<ChartLine size={20} />} bg="gray.800" _hover={{ bg: 'gray.700' }}>
          Опционы
        </MenuItem>
        <MenuItem icon={<Robot size={20} />} bg="gray.800" _hover={{ bg: 'gray.700' }}>
          Торговые боты
        </MenuItem>
        <MenuItem icon={<Coins size={20} />} bg="gray.800" _hover={{ bg: 'gray.700' }}>
          Earn
        </MenuItem>
        <MenuItem icon={<Wallet size={20} />} bg="gray.800" _hover={{ bg: 'gray.700' }}>
          Кошелек для пополнения
        </MenuItem>
        <MenuItem icon={<Receipt size={20} />} bg="gray.800" _hover={{ bg: 'gray.700' }}>
          История транзакций
        </MenuItem>
        <MenuItem icon={<ClipboardText size={20} />} bg="gray.800" _hover={{ bg: 'gray.700' }}>
          Выписка
        </MenuItem>
        <MenuItem icon={<ShieldCheck size={20} />} bg="gray.800" _hover={{ bg: 'gray.700' }}>
          Проверка
        </MenuItem>
      </MenuList>
    </Menu>
  );
}