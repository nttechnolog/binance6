import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  IconButton,
  Tooltip,
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useWalletStore } from '../stores/useWalletStore';
import { formatBalance, calculateAvailableWithdrawal } from '../utils/walletHelpers';
import { useAuth } from '../hooks/useAuth';

export function Profile() {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [amount, setAmount] = useState('');
  
  const {
    balances,
    isLoading,
    updateBalance,
    calculateTotalBalance,
  } = useWallet();

  const {
    hideBalance,
    hideSmallBalances,
    withdrawalLimit,
    dailyWithdrawn,
    setHideBalance,
    setHideSmallBalances,
  } = useWalletStore();

  const totalBtcBalance = calculateTotalBalance();
  const availableWithdrawal = calculateAvailableWithdrawal(withdrawalLimit, dailyWithdrawn);

  const handleDeposit = async () => {
    if (!user?.id || !amount) return;

    try {
      await updateBalance.mutateAsync({
        asset: selectedAsset,
        amount,
        type: 'credit'
      });

      toast({
        title: 'Успешное пополнение',
        description: `Баланс ${selectedAsset} пополнен на ${amount}`,
        status: 'success',
        duration: 3000,
      });

      onClose();
      setAmount('');
    } catch (error) {
      toast({
        title: 'Ошибка пополнения',
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box bg="gray.800" p={6} borderRadius="lg">
          <HStack justify="space-between" mb={6}>
            <Text fontSize="2xl" fontWeight="bold">Баланс</Text>
            <Button colorScheme="yellow" onClick={onOpen}>
              Демо пополнение
            </Button>
          </HStack>

          <HStack justify="space-between" mb={6}>
            <HStack>
              <Text color="gray.400">Ориентировочная стоимость:</Text>
              <IconButton
                aria-label="Toggle balance visibility"
                icon={hideBalance ? <EyeOffIcon /> : <EyeIcon />}
                variant="ghost"
                onClick={() => setHideBalance(!hideBalance)}
              />
            </HStack>
            <Text fontSize="2xl">
              {hideBalance ? '******' : `${formatBalance(totalBtcBalance)} BTC`}
            </Text>
          </HStack>

          <HStack justify="space-between" mb={6}>
            <Text color="gray.400">24-часовое ограничение на вывод средств:</Text>
            <Text>{availableWithdrawal} BTC</Text>
          </HStack>

          <Checkbox
            isChecked={hideSmallBalances}
            onChange={(e) => setHideSmallBalances(e.target.checked)}
            mb={4}
          >
            Скрывать активы с низкой стоимостью
          </Checkbox>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Актив</Th>
                <Th isNumeric>Доступно</Th>
                <Th isNumeric>В ордерах</Th>
                <Th isNumeric>Всего</Th>
                <Th isNumeric>Примерная стоимость BTC</Th>
              </Tr>
            </Thead>
            <Tbody>
              {balances?.map((balance) => (
                <Tr key={balance.asset}>
                  <Td>{balance.asset}</Td>
                  <Td isNumeric>
                    {hideBalance ? '******' : formatBalance(balance.free)}
                  </Td>
                  <Td isNumeric>
                    {hideBalance ? '******' : formatBalance(balance.locked)}
                  </Td>
                  <Td isNumeric>
                    {hideBalance ? '******' : formatBalance(
                      new Decimal(balance.free).plus(balance.locked).toString()
                    )}
                  </Td>
                  <Td isNumeric>
                    {hideBalance ? '******' : formatBalance(balance.btcValue)}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Демо пополнение</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <Select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="BNB">Binance Coin (BNB)</option>
                <option value="USDT">Tether (USDT)</option>
              </Select>
              <Input
                type="number"
                placeholder="Сумма"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Отмена
            </Button>
            <Button 
              colorScheme="yellow" 
              onClick={handleDeposit}
              isLoading={updateBalance.isLoading}
            >
              Пополнить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}