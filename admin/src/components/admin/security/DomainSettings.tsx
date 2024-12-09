import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Switch,
  useDisclosure,
  useToast,
  Badge,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { db } from '../../../db/db';

interface Domain {
  id?: number;
  domain: string;
  isActive: boolean;
  sslEnabled: boolean;
  lastChecked?: Date;
  createdAt: Date;
}

export function DomainSettings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: domains } = useQuery('domains', async () => {
    // В реальном приложении здесь будет запрос к API
    return [
      {
        id: 1,
        domain: 'admin.binance.com',
        isActive: true,
        sslEnabled: true,
        lastChecked: new Date(),
        createdAt: new Date()
      }
    ];
  });

  const mutation = useMutation(
    async (domain: Domain) => {
      // В реальном приложении здесь будет сохранение через API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return domain;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('domains');
        toast({
          title: 'Домен сохранен',
          status: 'success',
          duration: 3000,
        });
        onClose();
      }
    }
  );

  const handleAddDomain = () => {
    setSelectedDomain(null);
    onOpen();
  };

  const handleEditDomain = (domain: Domain) => {
    setSelectedDomain(domain);
    onOpen();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDomain?.domain) return;
    
    mutation.mutate(selectedDomain);
  };

  return (
    <Box bg="gray.800" p={6} borderRadius="lg">
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold">Управление доменами</Text>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="yellow"
            onClick={handleAddDomain}
          >
            Добавить домен
          </Button>
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Домен</Th>
              <Th>Статус</Th>
              <Th>SSL</Th>
              <Th>Последняя проверка</Th>
              <Th>Действия</Th>
            </Tr>
          </Thead>
          <Tbody>
            {domains?.map((domain) => (
              <Tr key={domain.id}>
                <Td>{domain.domain}</Td>
                <Td>
                  <Badge
                    colorScheme={domain.isActive ? 'green' : 'red'}
                  >
                    {domain.isActive ? 'Активен' : 'Неактивен'}
                  </Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={domain.sslEnabled ? 'green' : 'red'}
                  >
                    {domain.sslEnabled ? 'Включен' : 'Отключен'}
                  </Badge>
                </Td>
                <Td>{domain.lastChecked?.toLocaleString()}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Редактировать"
                      icon={<EditIcon />}
                      size="sm"
                      onClick={() => handleEditDomain(domain)}
                    />
                    <IconButton
                      aria-label="Удалить"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSave}>
            <ModalHeader>
              {selectedDomain ? 'Редактировать домен' : 'Добавить домен'}
            </ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Домен</FormLabel>
                  <Input
                    value={selectedDomain?.domain || ''}
                    onChange={(e) => setSelectedDomain(prev => ({
                      ...prev!,
                      domain: e.target.value
                    }))}
                    placeholder="example.com"
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">
                    Активен
                  </FormLabel>
                  <Switch
                    isChecked={selectedDomain?.isActive}
                    onChange={(e) => setSelectedDomain(prev => ({
                      ...prev!,
                      isActive: e.target.checked
                    }))}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">
                    SSL сертификат
                  </FormLabel>
                  <Switch
                    isChecked={selectedDomain?.sslEnabled}
                    onChange={(e) => setSelectedDomain(prev => ({
                      ...prev!,
                      sslEnabled: e.target.checked
                    }))}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Отмена
              </Button>
              <Button
                colorScheme="yellow"
                type="submit"
                isLoading={mutation.isLoading}
              >
                Сохранить
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}