import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Link,
  Button,
  HStack,
  Icon,
  Divider,
  VStack,
} from '@chakra-ui/react';
import {
  DiscordLogo,
  TelegramLogo,
  TiktokLogo,
  FacebookLogo,
  TwitterLogo,
  RedditLogo,
  InstagramLogo,
  YoutubeLogo,
} from '@phosphor-icons/react';

export function Footer() {
  const sections = [
    {
      title: 'О нас',
      links: [
        { text: 'О нас', href: '#' },
        { text: 'Вакансии', href: '#' },
        { text: 'Анонсы', href: '#' },
        { text: 'Новости', href: '#' },
        { text: 'Пресс-центр', href: '#' },
        { text: 'Правовое регулирование', href: '#' },
        { text: 'Условия', href: '#' },
        { text: 'Конфиденциальность', href: '#' },
      ],
    },
    {
      title: 'Продукты',
      links: [
        { text: 'Exchange', href: '#' },
        { text: 'Купить криптовалюту', href: '#' },
        { text: 'Pay', href: '#' },
        { text: 'Academy', href: '#' },
        { text: 'Live', href: '#' },
        { text: 'Tax', href: '#' },
        { text: 'Подарочная карта', href: '#' },
        { text: 'Launchpool', href: '#' },
      ],
    },
    {
      title: 'Для компаний',
      links: [
        { text: 'Стать P2P-мерчантом', href: '#' },
        { text: 'Заявка на получение статуса мерчанта P2Pro', href: '#' },
        { text: 'Заявка на листинг', href: '#' },
        { text: 'Институциональные и VIP-услуги', href: '#' },
        { text: 'Labs', href: '#' },
        { text: 'Binance Connect', href: '#' },
      ],
    },
    {
      title: 'Услуги',
      links: [
        { text: 'Партнерская программа', href: '#' },
        { text: 'Реферальная программа', href: '#' },
        { text: 'OTC торговля', href: '#' },
        { text: 'Исторические данные о рынке', href: '#' },
        { text: 'Сведения о хранении активов', href: '#' },
      ],
    },
    {
      title: 'Служба поддержки',
      links: [
        { text: 'Помощь в чате 24/7', href: '#' },
        { text: 'Центр поддержки', href: '#' },
        { text: 'Отзывы и предложения о продуктах', href: '#' },
        { text: 'Комиссии', href: '#' },
        { text: 'API', href: '#' },
        { text: 'Binance Verify', href: '#' },
      ],
    },
  ];

  const socialIcons = [
    { icon: DiscordLogo, href: '#' },
    { icon: TelegramLogo, href: '#' },
    { icon: TiktokLogo, href: '#' },
    { icon: FacebookLogo, href: '#' },
    { icon: TwitterLogo, href: '#' },
    { icon: RedditLogo, href: '#' },
    { icon: InstagramLogo, href: '#' },
    { icon: YoutubeLogo, href: '#' },
  ];

  return (
    <Box bg="gray.900" color="gray.400" mt={8}>
      <Container maxW="container.xl" py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={8}>
          {sections.map((section) => (
            <Stack key={section.title} align="flex-start">
              <Text fontWeight="semibold" color="gray.300" mb={2}>
                {section.title}
              </Text>
              {section.links.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  fontSize="sm"
                  _hover={{ color: 'yellow.400' }}
                >
                  {link.text}
                </Link>
              ))}
            </Stack>
          ))}
        </SimpleGrid>

        <Divider my={8} borderColor="gray.700" />

        <VStack spacing={6}>
          <HStack spacing={4} wrap="wrap" justify="center">
            {socialIcons.map((social, index) => (
              <Link key={index} href={social.href} isExternal>
                <Icon
                  as={social.icon}
                  boxSize={6}
                  _hover={{ color: 'yellow.400' }}
                />
              </Link>
            ))}
          </HStack>

          <HStack spacing={4}>
            <Button variant="ghost" size="sm">
              Русский
            </Button>
            <Button variant="ghost" size="sm">
              RUB-₽
            </Button>
            <Button variant="ghost" size="sm">
              Тема
            </Button>
          </HStack>

          <Text fontSize="sm" textAlign="center">
            © 2024 Trade PX. Все права защищены
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}