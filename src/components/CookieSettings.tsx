import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Text,
  Switch,
  Box,
  Link,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { create } from 'zustand';

interface CookieSettings {
  functional: boolean;
  targeting: boolean;
  performance: boolean;
  setFunctional: (value: boolean) => void;
  setTargeting: (value: boolean) => void;
  setPerformance: (value: boolean) => void;
}

export const useCookieStore = create<CookieSettings>((set) => ({
  functional: true,
  targeting: true,
  performance: true,
  setFunctional: (value) => set({ functional: value }),
  setTargeting: (value) => set({ targeting: value }),
  setPerformance: (value) => set({ performance: value }),
}));

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CookieSettingsModal({ isOpen, onClose }: CookieSettingsModalProps) {
  const { functional, targeting, performance, setFunctional, setTargeting, setPerformance } = useCookieStore();

  const handleAcceptAll = () => {
    setFunctional(true);
    setTargeting(true);
    setPerformance(true);
    onClose();
  };

  const handleRejectAll = () => {
    setFunctional(false);
    setTargeting(false);
    setPerformance(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg="gray.900">
        <ModalHeader color="white">Центр настроек конфиденциальности</ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text color="gray.300">
              Когда вы посещаете какой-либо веб-сайт, он может сохранять информацию в вашем браузере или получать из него данные, в основном в виде файлов cookie. Эта информация может относиться к вам, вашим предпочтениям, вашему устройству или будет использоваться для правильной работы веб-сайта с вашей точки зрения. Такие данные обычно не идентифицируют вас непосредственно, но могут предоставлять вам индивидуализированные возможности работы в интернете.
            </Text>

            <Link color="yellow.400" fontSize="sm" href="#">
              Дополнительная информация
            </Link>

            <Text color="white" fontWeight="bold" mt={4}>
              Управление настройками согласия
            </Text>

            <Accordion allowMultiple>
              <AccordionItem border="none">
                <AccordionButton px={4} py={2} bg="gray.800" _hover={{ bg: 'gray.700' }}>
                  <Box flex="1" textAlign="left" color="white">
                    Строго необходимые файлы cookie
                  </Box>
                  <Text color="blue.400" mr={2}>Всегда активно</Text>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} color="gray.300">
                  Необходимы для работы веб-сайта. Без них сайт не сможет работать корректно.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none">
                <AccordionButton px={4} py={2} bg="gray.800" _hover={{ bg: 'gray.700' }}>
                  <Box flex="1" textAlign="left" color="white">
                    Функциональные файлы cookie
                  </Box>
                  <Switch 
                    isChecked={functional}
                    onChange={(e) => setFunctional(e.target.checked)}
                    colorScheme="green"
                    mr={2}
                  />
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} color="gray.300">
                  Помогают улучшить функциональность и персонализацию.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none">
                <AccordionButton px={4} py={2} bg="gray.800" _hover={{ bg: 'gray.700' }}>
                  <Box flex="1" textAlign="left" color="white">
                    Целевые файлы cookie
                  </Box>
                  <Switch 
                    isChecked={targeting}
                    onChange={(e) => setTargeting(e.target.checked)}
                    colorScheme="green"
                    mr={2}
                  />
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} color="gray.300">
                  Используются для показа релевантной рекламы.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none">
                <AccordionButton px={4} py={2} bg="gray.800" _hover={{ bg: 'gray.700' }}>
                  <Box flex="1" textAlign="left" color="white">
                    Эксплуатационные файлы cookie
                  </Box>
                  <Switch 
                    isChecked={performance}
                    onChange={(e) => setPerformance(e.target.checked)}
                    colorScheme="green"
                    mr={2}
                  />
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} color="gray.300">
                  Помогают понять, как посетители взаимодействуют с сайтом.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </VStack>
        </ModalBody>

        <ModalFooter gap={4}>
          <Button onClick={handleRejectAll} variant="outline">
            Отклонить все
          </Button>
          <Button onClick={handleAcceptAll} colorScheme="yellow">
            Подтвердить выбор
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}