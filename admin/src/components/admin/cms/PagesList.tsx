import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useToast,
  HStack,
  Text,
} from '@chakra-ui/react';
import { DotsThree, PencilSimple, Trash, Eye } from '@phosphor-icons/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format } from 'date-fns';
import { db } from '../../../db/db';
import { Page } from '../../../db/schemas/cmsSchema';
import { PageEditor } from './PageEditor';

export function PagesList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPage, setSelectedPage] = React.useState<Page | null>(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: pages } = useQuery('pages', () => 
    db.pages.orderBy('updatedAt').reverse().toArray()
  );

  const deleteMutation = useMutation(
    async (id: number) => {
      await db.pages.delete(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pages');
        toast({
          title: 'Страница удалена',
          status: 'success',
          duration: 3000,
        });
      }
    }
  );

  const handleEdit = (page: Page) => {
    setSelectedPage(page);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту страницу?')) {
      await deleteMutation.mutate(id);
    }
  };

  const handleCreate = () => {
    setSelectedPage(null);
    onOpen();
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">Управление страницами</Text>
        <Button colorScheme="yellow" onClick={handleCreate}>
          Создать страницу
        </Button>
      </HStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Заголовок</Th>
            <Th>URL</Th>
            <Th>Категория</Th>
            <Th>Статус</Th>
            <Th>Последнее обновление</Th>
            <Th>Действия</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pages?.map((page) => (
            <Tr key={page.id}>
              <Td>{page.title}</Td>
              <Td>{page.slug}</Td>
              <Td>{page.category}</Td>
              <Td>
                <Badge
                  colorScheme={page.status === 'published' ? 'green' : 'yellow'}
                >
                  {page.status === 'published' ? 'Опубликовано' : 'Черновик'}
                </Badge>
              </Td>
              <Td>{format(new Date(page.updatedAt), 'dd.MM.yyyy HH:mm')}</Td>
              <Td>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<DotsThree />}
                    variant="ghost"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem 
                      icon={<Eye />}
                      onClick={() => window.open(`/pages/${page.slug}`, '_blank')}
                    >
                      Просмотр
                    </MenuItem>
                    <MenuItem 
                      icon={<PencilSimple />}
                      onClick={() => handleEdit(page)}
                    >
                      Редактировать
                    </MenuItem>
                    <MenuItem 
                      icon={<Trash />}
                      onClick={() => page.id && handleDelete(page.id)}
                      color="red.400"
                    >
                      Удалить
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {isOpen && (
        <PageEditor
          page={selectedPage || undefined}
          onSave={onClose}
        />
      )}
    </Box>
  );
}