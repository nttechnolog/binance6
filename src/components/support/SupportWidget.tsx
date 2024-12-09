import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  VStack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useDisclosure,
  Link,
  Grid,
} from '@chakra-ui/react';
import { Headphones, ArrowsClockwise } from '@phosphor-icons/react';
import { ChatDialog } from './ChatDialog';
import { HelpInstructions } from './HelpInstructions';

export function SupportWidget() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isHovered, setIsHovered] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const faqSections = [
    { title: 'Функции Аккаунта', items: ['Как верифицировать личный аккаунт', 'Утеряны данные моего аккаунта'] },
    { title: 'P2P-торговля', items: ['Снятие ограничений на P2P', 'Заморозка активов из-за спора по P2P-операции'] },
  ];

  const quickHelp = [
    {
      title: 'Как осуществлять переводы между вашими кошельками Binance',
      description: 'Перейдите в "Кошелек > Спотовый > Перевод" и выберите кошельки для перевода.',
      action: 'Как исправить'
    },
    {
      title: 'Верификация KYC',
      description: 'Завершите базовую верификацию',
      progress: '0/3',
      action: 'Как продолжить'
    }
  ];

  const selfHelpItems = [
    {
      title: 'Апелляция по приостановке вывода криптовалюты',
      description: 'Отменить приостановку RW00178'
    },
    {
      title: 'Апелляция по отмене вывода криптовалюты',
      description: 'Снять ограничения за неправомерные действия по выводу средств в криптовалюте'
    },
    {
      title: 'Апелляция по проверке лица отклонена',
      description: 'Запрос на проверку отклоненного решения по распознаванию лица'
    },
    {
      title: 'Сброс 2FA',
      description: 'Сброс двухфакторной аутентификации'
    }
  ];

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % quickHelp.length);
  };

  return (
    <>
      <Box position="fixed" bottom="100px" right="4" zIndex={1000}>
        <Button
          size="lg"
          colorScheme="yellow"
          leftIcon={isHovered ? undefined : <Headphones weight="bold" />}
          rightIcon={isHovered ? <Headphones weight="bold" /> : undefined}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onOpen}
          minW={isHovered ? "200px" : "auto"}
          transition="all 0.2s"
        >
          {isHovered ? 'Поддержка' : ''}
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxH="80vh" overflowY="auto" bg="gray.900" position="relative">
          {showChat ? (
            <ChatDialog onBack={() => setShowChat(false)} />
          ) : (
            <>
              <ModalHeader borderBottom="1px" borderColor="gray.700">
                <HStack justify="space-between">
                  <Text>Поддержка Binance</Text>
                  <HStack>
                    <IconButton
                      aria-label="Язык"
                      icon={<span>🌐</span>}
                      variant="ghost"
                      size="sm"
                    />
                    <IconButton
                      aria-label="Избранное"
                      icon={<span>⭐</span>}
                      variant="ghost"
                      size="sm"
                    />
                  </HStack>
                </HStack>
              </ModalHeader>

              <ModalBody p={0}>
                <VStack align="stretch" spacing={6} p={4}>
                  <Text>
                    👋 Здравствуйте Пользователь Binance, Начните общение с виртуальным помощником Binance.
                  </Text>

                  <Box bg="gray.800" p={4} borderRadius="md" position="relative">
                    <VStack align="stretch" spacing={4}>
                      <Text fontWeight="bold">Возможно, вы ищете</Text>
                      <Box position="relative">
                        <Box>
                          {quickHelp.map((item, index) => (
                            <Box
                              key={index}
                              display={index === currentSlide ? 'block' : 'none'}
                              p={4}
                              bg="gray.700"
                              borderRadius="md"
                            >
                              <VStack align="stretch" spacing={2}>
                                <Text>{item.title}</Text>
                                <Text fontSize="sm" color="gray.400">{item.description}</Text>
                                {item.progress && (
                                  <Text fontSize="sm" color="gray.400">{item.progress}</Text>
                                )}
                                {item.action && (
                                  <Button 
                                    colorScheme="yellow" 
                                    size="sm" 
                                    alignSelf="flex-start"
                                    onClick={() => setShowInstructions(true)}
                                  >
                                    {item.action}
                                  </Button>
                                )}
                              </VStack>
                            </Box>
                          ))}
                        </Box>
                        <HStack position="absolute" bottom="-8" left="50%" transform="translateX(-50%)">
                          {quickHelp.map((_, index) => (
                            <Box
                              key={index}
                              w="2"
                              h="2"
                              borderRadius="full"
                              bg={index === currentSlide ? "yellow.400" : "gray.600"}
                            />
                          ))}
                        </HStack>
                        <IconButton
                          aria-label="Предыдущий"
                          icon={<ArrowsClockwise weight="bold" />}
                          position="absolute"
                          right="4"
                          top="50%"
                          transform="translateY(-50%)"
                          variant="ghost"
                          onClick={handleNextSlide}
                        />
                      </Box>
                    </VStack>
                  </Box>

                  <Box>
                    <HStack justify="space-between" mb={4}>
                      <Text fontWeight="bold">Самостоятельно</Text>
                      <IconButton
                        aria-label="Обновить"
                        icon={<ArrowsClockwise weight="bold" />}
                        variant="ghost"
                        size="sm"
                      />
                    </HStack>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      {selfHelpItems.map((item, index) => (
                        <Box key={index} p={4} bg="gray.800" borderRadius="md">
                          <VStack align="stretch" spacing={2}>
                            <Text>{item.title}</Text>
                            <Text fontSize="sm" color="gray.400">
                              {item.description}
                            </Text>
                          </VStack>
                        </Box>
                      ))}
                    </Grid>
                    <Button variant="ghost" size="sm" mt={4} w="100%">
                      Посмотреть все
                    </Button>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={4}>Часто задаваемые вопросы</Text>
                    <Accordion allowMultiple>
                      {faqSections.map((section, index) => (
                        <AccordionItem key={index} border="none">
                          <AccordionButton 
                            py={2} 
                            px={4} 
                            _hover={{ bg: 'gray.700' }}
                            borderRadius="md"
                          >
                            <Box flex="1" textAlign="left">
                              {section.title}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4}>
                            <VStack align="stretch" spacing={2}>
                              {section.items.map((item, idx) => (
                                <Link key={idx} color="gray.400" _hover={{ color: 'yellow.400' }}>
                                  {item}
                                </Link>
                              ))}
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Box>

                  <Link color="yellow.400" href="#" alignSelf="center">
                    Отзывы и предложения о продуктах
                  </Link>

                  <Button 
                    colorScheme="gray" 
                    size="lg" 
                    leftIcon={<Headphones weight="bold" />}
                    w="100%"
                    onClick={() => setShowChat(true)}
                  >
                    Найти ответ на вопрос
                  </Button>
                </VStack>
              </ModalBody>
            </>
          )}

          {showInstructions && (
            <HelpInstructions onClose={() => setShowInstructions(false)} />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}