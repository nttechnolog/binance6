import { Box } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useInitialLoad } from './hooks/useInitialLoad';
import { PageLoader } from './components/common/PageLoader';

export default function App() {
  const { isLoading, progress } = useInitialLoad();

  if (isLoading) {
    return <PageLoader progress={progress} />;
  }

  return (
    <Box minH="100vh" bg="gray.900">
      <RouterProvider router={router} />
    </Box>
  );
}