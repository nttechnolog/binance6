import React, { useState, useCallback } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Select,
  Switch,
  useToast,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { db } from '../../../db/db';
import { Page } from '../../../db/schemas/cmsSchema';
import { useAuthStore } from '../../../stores/useAuthStore';
import { Editor } from '@tinymce/tinymce-react';

interface PageEditorProps {
  page?: Page;
  onSave?: () => void;
}

export function PageEditor({ page, onSave }: PageEditorProps) {
  const [formData, setFormData] = useState<Partial<Page>>(page || {
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    images: [],
    category: 'general',
    status: 'draft'
  });

  const toast = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const mutation = useMutation(
    async (data: Partial<Page>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const pageData = {
        ...data,
        authorId: user.id,
        updatedAt: new Date(),
        createdAt: page?.createdAt || new Date()
      };

      if (page?.id) {
        await db.pages.update(page.id, pageData);
      } else {
        await db.pages.add(pageData as Page);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pages');
        toast({
          title: 'Страница сохранена',
          status: 'success',
          duration: 3000,
        });
        onSave?.();
      },
      onError: (error) => {
        toast({
          title: 'Ошибка при сохранении',
          description: error instanceof Error ? error.message : 'Неизвестная ошибка',
          status: 'error',
          duration: 3000,
        });
      }
    }
  );

  const handleEditorChange = useCallback((content: string) => {
    setFormData(prev => ({ ...prev, content }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <FormControl isRequired>
          <FormLabel>Заголовок</FormLabel>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>URL (slug)</FormLabel>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Контент</FormLabel>
          <Editor
            apiKey="your-tinymce-api-key"
            value={formData.content}
            onEditorChange={handleEditorChange}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
            }}
          />
        </FormControl>

        <HStack spacing={6}>
          <FormControl>
            <FormLabel>Категория</FormLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="general">Общее</option>
              <option value="about">О нас</option>
              <option value="blog">Блог</option>
              <option value="wallet">Криптокошелек</option>
              <option value="career">Карьера</option>
              <option value="announcements">Объявления</option>
              <option value="news">Новости</option>
              <option value="press">Пресс-центр</option>
              <option value="legal">Юридическая информация</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Статус</FormLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                status: e.target.value as 'draft' | 'published'
              }))}
            >
              <option value="draft">Черновик</option>
              <option value="published">Опубликовано</option>
            </Select>
          </FormControl>
        </HStack>

        <Box bg="gray.700" p={4} borderRadius="md">
          <Text fontWeight="bold" mb={4}>META информация</Text>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>META заголовок</FormLabel>
              <Input
                value={formData.metaTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>META описание</FormLabel>
              <Textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
              />
            </FormControl>
          </VStack>
        </Box>

        <HStack justify="flex-end" spacing={4}>
          <Button variant="ghost">Отмена</Button>
          <Button
            colorScheme="yellow"
            type="submit"
            isLoading={mutation.isLoading}
          >
            {page ? 'Сохранить изменения' : 'Создать страницу'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}