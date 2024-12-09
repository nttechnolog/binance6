import { Text } from '@chakra-ui/react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return <Text color="red.400">{message}</Text>;
}