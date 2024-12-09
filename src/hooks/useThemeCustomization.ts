import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import tinycolor from 'tinycolor2';

interface CustomTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  fontFamily: string;
}

const defaultTheme: CustomTheme = {
  primaryColor: '#F0B90B',
  backgroundColor: '#1A202C',
  textColor: '#FFFFFF',
  buttonColor: '#F0B90B',
  fontFamily: 'system-ui'
};

export function useThemeCustomization() {
  const [theme, setTheme] = useState<CustomTheme>(() => {
    const saved = localStorage.getItem('userTheme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });
  
  const toast = useToast();

  useEffect(() => {
    localStorage.setItem('userTheme', JSON.stringify(theme));
  }, [theme]);

  const validateContrast = (background: string, text: string): boolean => {
    const contrast = tinycolor.readability(background, text);
    return contrast >= 4.5; // Минимальный рекомендуемый контраст WCAG AA
  };

  const updateTheme = (updates: Partial<CustomTheme>) => {
    setTheme(prev => {
      const newTheme = { ...prev, ...updates };
      
      // Проверка контраста
      if (!validateContrast(newTheme.backgroundColor, newTheme.textColor)) {
        toast({
          title: 'Внимание',
          description: 'Выбранное сочетание цветов может быть трудночитаемым',
          status: 'warning',
          duration: 3000,
        });
      }
      
      return newTheme;
    });
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    toast({
      title: 'Тема сброшена',
      status: 'success',
      duration: 2000,
    });
  };

  return {
    theme,
    updateTheme,
    resetTheme,
    defaultTheme
  };
}