import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  IconButton,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  useToast,
} from '@chakra-ui/react';
import { ArrowLeft, PaperclipIcon, ImageIcon, FileTextIcon, SendIcon } from 'lucide-react';

interface ChatDialogProps {
  onBack: () => void;
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// База знаний для чат-бота
const knowledgeBase = {
  keywords: {
    верификация: ['верификация', 'документы', 'kyc', 'проверка', 'личность'],
    пополнение: ['пополнить', 'депозит', 'внести', 'положить', 'купить'],
    вывод: ['вывод', 'вывести', 'снять', 'получить', 'перевести'],
    торговля: ['торговля', 'торговать', 'сделка', 'ордер', 'позиция'],
    комиссия: ['комиссия', 'комиссии', 'fees', 'процент', 'стоимость'],
    безопасность: ['безопасность', 'пароль', '2fa', 'защита', 'взлом']
  },
  responses: {
    верификация: [
      'Для верификации аккаунта выполните следующие шаги:\n1. Перейдите в раздел "Безопасность"\n2. Нажмите "Верификация личности"\n3. Загрузите необходимые документы\n4. Дождитесь проверки',
      'Для верификации потребуются:\n- Действующий паспорт\n- Селфи с паспортом\n- Подтверждение адреса'
    ],
    пополнение: [
      'Пополнить счет можно несколькими способами:\n1. Банковской картой\n2. Через P2P-площадку\n3. Криптовалютой с другого кошелька',
      'Для пополнения перейдите в раздел "Кошелек" и выберите удобный способ. Минимальная сумма зависит от выбранного метода.'
    ],
    вывод: [
      'Для вывода средств:\n1. Перейдите в "Кошелек"\n2. Выберите актив\n3. Нажмите "Вывод"\n4. Укажите сеть и адрес',
      'Перед выводом убедитесь:\n- Адрес указан верно\n- Выбрана правильная сеть\n- Соблюдены лимиты'
    ],
    торговля: [
      'Начать торговлю просто:\n1. Выберите торговую пару\n2. Внесите депозит\n3. Разместите ордер на покупку или продажу',
      'Доступны различные типы ордеров:\n- Лимитный\n- Рыночный\n- Стоп-лимит'
    ],
    комиссия: [
      'Комиссии на Binance одни из самых низких:\n- Спот-торговля: 0.1%\n- Вывод: зависит от сети\n- Пополнение: обычно бесплатно',
      'Снизить комиссии можно:\n1. Используя BNB\n2. Увеличивая торговый объем\n3. Получая VIP-статус'
    ],
    безопасность: [
      'Для защиты аккаунта рекомендуется:\n1. Включить 2FA\n2. Использовать сложный пароль\n3. Настроить белый список адресов',
      'Дополнительные меры безопасности:\n- Антифишинг-код\n- Подтверждение устройств\n- Регулярная смена пароля'
    ]
  }
};

export function ChatDialog({ onBack }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const toast = useToast();

  useEffect(() => {
    // Добавляем приветственное сообщение
    setMessages([
      {
        id: 1,
        text: 'Здравствуйте! Я виртуальный помощник Binance. Чем могу помочь?',
        isUser: false,
        timestamp: new Date()
      }
    ]);

    // Показываем начальные предложения
    setSuggestions([
      'Как пройти верификацию?',
      'Как пополнить счет?',
      'Как вывести средства?',
      'Как начать торговлю?',
      'Какие комиссии?',
      'Как защитить аккаунт?'
    ]);
  }, []);

  const findCategory = (text: string): string => {
    const lowercaseText = text.toLowerCase();
    
    for (const [category, keywords] of Object.entries(knowledgeBase.keywords)) {
      if (keywords.some(keyword => lowercaseText.includes(keyword))) {
        return category;
      }
    }
    
    return 'общее';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Определяем категорию вопроса
    const category = findCategory(input);
    const responses = knowledgeBase.responses[category as keyof typeof knowledgeBase.responses];
    
    // Выбираем ответ
    const response = responses ? 
      responses[Math.floor(Math.random() * responses.length)] :
      'Извините, я не совсем понял ваш вопрос. Попробуйте переформулировать или выберите один из предложенных вариантов.';

    // Добавляем ответ бота с задержкой
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: response,
        isUser: false,
        timestamp: new Date()
      }]);
    }, 500);

    setInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSend();
  };

  const handleFileUpload = () => {
    toast({
      title: "Загрузка файлов",
      description: "В демо-версии загрузка файлов недоступна",
      status: "info",
      duration: 3000,
    });
  };

  return (
    <VStack h="full" spacing={0}>
      <HStack w="full" p={4} borderBottom="1px" borderColor="gray.700">
        <IconButton
          aria-label="Назад"
          icon={<ArrowLeft />}
          variant="ghost"
          onClick={onBack}
        />
        <Text>Помощник Trade PX</Text>
      </HStack>

      <Box flex={1} p={4} overflowY="auto">
        {messages.map(message => (
          <Box
            key={message.id}
            mb={4}
            display="flex"
            justifyContent={message.isUser ? 'flex-end' : 'flex-start'}
          >
            {!message.isUser && (
              <Image src="/binance-logo.svg" boxSize="24px" mr={2} />
            )}
            <Box
              bg={message.isUser ? 'yellow.500' : 'gray.700'}
              color={message.isUser ? 'black' : 'white'}
              px={4}
              py={2}
              borderRadius="lg"
              maxW="80%"
            >
              <Text whiteSpace="pre-line">{message.text}</Text>
            </Box>
          </Box>
        ))}

        {suggestions.length > 0 && (
          <VStack align="stretch" mt={4} spacing={2}>
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </VStack>
        )}
      </Box>

      <Box p={4} borderTop="1px" borderColor="gray.700">
        <HStack>
          <IconButton
            aria-label="Прикрепить"
            icon={<PaperclipIcon />}
            variant="ghost"
            onClick={handleFileUpload}
          />
          <IconButton
            aria-label="Изображение"
            icon={<ImageIcon />}
            variant="ghost"
            onClick={handleFileUpload}
          />
          <IconButton
            aria-label="Документ"
            icon={<FileTextIcon />}
            variant="ghost"
            onClick={handleFileUpload}
          />
          <Input
            placeholder="Найти или задать вопрос"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <IconButton
            aria-label="Отправить"
            icon={<SendIcon />}
            colorScheme="yellow"
            onClick={handleSend}
          />
        </HStack>
      </Box>
    </VStack>
  );
}