import React from 'react';
import {
  Box,
  VStack,
  Text,
  Image,
  CloseButton,
  Link,
} from '@chakra-ui/react';

interface HelpInstructionsProps {
  onClose: () => void;
}

export function HelpInstructions({ onClose }: HelpInstructionsProps) {
  return (
    <Box 
      position="absolute" 
      top="50%" 
      left="50%" 
      transform="translate(-50%, -50%)"
      bg="gray.800"
      p={6}
      borderRadius="md"
      maxW="400px"
      w="90%"
      boxShadow="xl"
    >
      <CloseButton position="absolute" right={2} top={2} onClick={onClose} />
      
      <VStack align="stretch" spacing={4}>
        <Text fontWeight="bold">Как перевести активы между кошельками?</Text>
        
        <VStack align="stretch" spacing={2}>
          <Text>ПК/Веб версия: Кошелек - <Link color="yellow.400">Фиат и Спот</Link> - Перевод</Text>
          <Text>Мобильное приложение: Кошельки - Спот - Перевод</Text>
          <Text fontSize="sm" color="gray.400">
            Затем заполните разделы «Из» и «На» по своему желанию и завершите перевод.
          </Text>
        </VStack>

        <Image src="/transfer-instructions.png" borderRadius="md" />
      </VStack>
    </Box>
  );
}