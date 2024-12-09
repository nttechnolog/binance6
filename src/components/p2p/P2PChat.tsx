import React, { useState } from 'react';
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
import { ArrowLeft, PaperclipIcon, ImageIcon, FileTextIcon, Send } from 'lucide-react';

interface ChatDialogProps {
  onBack: () => void;
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function P2PChat({ onBack }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const toast = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
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
        <Text>Чат P2P</Text>
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
              <Text>{message.text}</Text>
            </Box>
          </Box>
        ))}
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
            placeholder="Введите сообщение..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <IconButton
            aria-label="Отправить"
            icon={<Send />}
            colorScheme="yellow"
            onClick={handleSend}
          />
        </HStack>
      </Box>
    </VStack>
  );
}