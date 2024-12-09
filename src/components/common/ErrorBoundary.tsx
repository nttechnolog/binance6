import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { Warning } from '@phosphor-icons/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box p={4} bg="gray.800" borderRadius="lg">
          <VStack spacing={4} align="center">
            <Icon as={Warning} boxSize={8} color="yellow.400" />
            <Text>Произошла ошибка при загрузке компонента</Text>
            <Button
              colorScheme="yellow"
              size="sm"
              onClick={() => this.setState({ hasError: false })}
            >
              Попробовать снова
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}