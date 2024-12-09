import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  FormErrorMessage,
  useToast,
  Box,
  Text,
  HStack,
  Badge,
  Divider,
  InputGroup,
  InputRightElement,
  Progress,
  IconButton,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Timer, TimerReset } from 'lucide-react';

interface P2POrderFormProps {
  type: 'buy' | 'sell';
  onSubmit: (data: any) => void;
}

const paymentMethods = {
  bank: {
    label: 'Банковский перевод',
    color: 'blue',
    options: ['Сбербанк', 'Тинькофф', 'ВТБ', 'Альфа-Банк']
  },
  ewallet: {
    label: 'Электронный кошелек',
    color: 'green',
    options: ['ЮMoney', 'QIWI', 'WebMoney']
  },
  cash: {
    label: 'Наличные',
    color: 'yellow',
    options: ['При встрече']
  },
  other: {
    label: 'Другие способы',
    color: 'red',
    options: ['СБП', 'Почтовый перевод']
  }
};

export function P2POrderForm({ type, onSubmit }: P2POrderFormProps) {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 минут в секундах
  const [selectedPaymentType, setSelectedPaymentType] = useState('bank');
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimeLeft(30 * 60);
    toast({
      title: 'Время продлено',
      status: 'success',
      duration: 2000
    });
  };

  const handleFormSubmit = (data: any) => {
    try {
      onSubmit({
        ...data,
        paymentType: selectedPaymentType,
        timeLimit: timeLeft
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <VStack spacing={6}>
        <Box w="100%">
          <HStack justify="space-between" mb={2}>
            <Text>Время на оплату:</Text>
            <HStack>
              <Text fontWeight="bold">{formatTime(timeLeft)}</Text>
              <IconButton
                aria-label="Продлить время"
                icon={<TimerReset />}
                size="sm"
                onClick={resetTimer}
                isDisabled={timeLeft > 25 * 60}
              />
            </HStack>
          </HStack>
          <Progress value={(timeLeft / (30 * 60)) * 100} colorScheme="yellow" />
        </Box>

        <FormControl isInvalid={!!errors.amount}>
          <FormLabel>Сумма {type === 'buy' ? 'покупки' : 'продажи'}</FormLabel>
          <NumberInput min={0}>
            <NumberInputField
              {...register('amount', {
                required: 'Обязательное поле',
                min: { value: 1000, message: 'Минимальная сумма 1000 ₽' },
                max: { value: 1000000, message: 'Максимальная сумма 1000000 ₽' }
              })}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>
            {errors.amount && errors.amount.message?.toString()}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.paymentMethod}>
          <FormLabel>Способ оплаты</FormLabel>
          <Select
            {...register('paymentMethod', { required: 'Выберите способ оплаты' })}
            onChange={(e) => setSelectedPaymentType(e.target.value)}
          >
            {Object.entries(paymentMethods).map(([key, { label, color }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.paymentMethod && errors.paymentMethod.message?.toString()}
          </FormErrorMessage>
        </FormControl>

        {selectedPaymentType === 'bank' && (
          <FormControl isInvalid={!!errors.bankDetails}>
            <FormLabel>Реквизиты банковской карты</FormLabel>
            <Input
              {...register('bankDetails', {
                required: 'Укажите номер карты или телефон/логин для перевода'
              })}
              placeholder="Номер карты или телефон/логин"
            />
            <FormErrorMessage>
              {errors.bankDetails && errors.bankDetails.message?.toString()}
            </FormErrorMessage>
          </FormControl>
        )}

        {selectedPaymentType === 'ewallet' && (
          <FormControl isInvalid={!!errors.walletId}>
            <FormLabel>ID кошелька</FormLabel>
            <Input
              {...register('walletId', {
                required: 'Укажите ID электронного кошелька'
              })}
              placeholder="Введите ID кошелька"
            />
            <FormErrorMessage>
              {errors.walletId && errors.walletId.message?.toString()}
            </FormErrorMessage>
          </FormControl>
        )}

        {selectedPaymentType === 'cash' && (
          <>
            <FormControl isInvalid={!!errors.city}>
              <FormLabel>Город</FormLabel>
              <Input
                {...register('city', {
                  required: 'Укажите город для встречи'
                })}
                placeholder="Введите город"
              />
              <FormErrorMessage>
                {errors.city && errors.city.message?.toString()}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.meetingPlace}>
              <FormLabel>Предпочтительное место встречи</FormLabel>
              <Textarea
                {...register('meetingPlace', {
                  required: 'Укажите предпочтительное место встречи'
                })}
                placeholder="Опишите место встречи"
              />
              <FormErrorMessage>
                {errors.meetingPlace && errors.meetingPlace.message?.toString()}
              </FormErrorMessage>
            </FormControl>
          </>
        )}

        <FormControl>
          <FormLabel>Дополнительные условия</FormLabel>
          <Textarea
            {...register('terms')}
            placeholder="Укажите дополнительные требования к сделке..."
          />
        </FormControl>

        <Button type="submit" colorScheme="yellow" width="100%" size="lg">
          {type === 'buy' ? 'Купить' : 'Продать'} BTC
        </Button>
      </VStack>
    </form>
  );
}