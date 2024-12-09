import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Box,
  Text,
  useToast,
} from '@chakra-ui/react';
import { HexColorPicker } from 'react-colorful';
import { useThemeCustomization } from '../../hooks/useThemeCustomization';

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const fontOptions = [
  { value: 'system-ui', label: 'Системный' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Inter', label: 'Inter' },
];

export function ThemeCustomizer({ isOpen, onClose }: ThemeCustomizerProps) {
  const { theme, updateTheme, resetTheme } = useThemeCustomization();
  const toast = useToast();

  const handleSave = () => {
    toast({
      title: 'Настройки сохранены',
      status: 'success',
      duration: 2000,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Настройки темы</ModalHeader>
        <ModalBody>
          <VStack spacing={6}>
            <FormControl>
              <FormLabel>Основной цвет</FormLabel>
              <Box p={4} bg="gray.100" borderRadius="md">
                <HexColorPicker
                  color={theme.primaryColor}
                  onChange={(color) => updateTheme({ primaryColor: color })}
                />
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel>Цвет фона</FormLabel>
              <Box p={4} bg="gray.100" borderRadius="md">
                <HexColorPicker
                  color={theme.backgroundColor}
                  onChange={(color) => updateTheme({ backgroundColor: color })}
                />
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel>Цвет текста</FormLabel>
              <Box p={4} bg="gray.100" borderRadius="md">
                <HexColorPicker
                  color={theme.textColor}
                  onChange={(color) => updateTheme({ textColor: color })}
                />
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel>Цвет кнопок</FormLabel>
              <Box p={4} bg="gray.100" borderRadius="md">
                <HexColorPicker
                  color={theme.buttonColor}
                  onChange={(color) => updateTheme({ buttonColor: color })}
                />
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel>Шрифт</FormLabel>
              <Select
                value={theme.fontFamily}
                onChange={(e) => updateTheme({ fontFamily: e.target.value })}
              >
                {fontOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Box w="100%" p={4} bg={theme.backgroundColor} borderRadius="md">
              <Text color={theme.textColor} fontFamily={theme.fontFamily}>
                Предпросмотр темы
              </Text>
              <Button
                mt={2}
                bg={theme.buttonColor}
                color={theme.textColor}
                _hover={{ opacity: 0.9 }}
              >
                Тестовая кнопка
              </Button>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter gap={4}>
          <Button variant="ghost" onClick={resetTheme}>
            Сбросить
          </Button>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button colorScheme="yellow" onClick={handleSave}>
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}