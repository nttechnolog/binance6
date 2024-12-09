import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const getThemeFromStorage = () => {
  try {
    const saved = localStorage.getItem('userTheme');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const userTheme = getThemeFromStorage();

const theme = extendTheme({
  config,
  colors: {
    brand: {
      yellow: userTheme?.primaryColor || '#F0B90B',
      hover: userTheme?.buttonColor || '#F8D33A',
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: userTheme?.backgroundColor || props.colorMode === 'dark' ? 'gray.900' : 'white',
        color: userTheme?.textColor || props.colorMode === 'dark' ? 'white' : 'gray.900',
        fontFamily: userTheme?.fontFamily || 'system-ui',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        _focus: {
          boxShadow: 'none',
        },
      },
      variants: {
        solid: (props: any) => ({
          bg: userTheme?.buttonColor || 'brand.yellow',
          color: userTheme?.textColor || 'black',
          _hover: {
            bg: userTheme?.buttonColor ? `${userTheme.buttonColor}dd` : 'brand.hover',
          },
        }),
        ghost: (props: any) => ({
          _hover: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
          },
        }),
      },
    },
    Menu: {
      baseStyle: (props: any) => ({
        list: {
          bg: userTheme?.backgroundColor || props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
        },
        item: {
          _hover: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
          },
        },
      }),
    },
  },
});

export default theme;