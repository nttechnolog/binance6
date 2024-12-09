import { Box } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardPage } from './pages/DashboardPage';
import { UsersList } from './components/admin/UsersList';
import { BalanceManagement } from './components/admin/BalanceManagement';
import { VerificationRequests } from './components/admin/VerificationRequests';
import { AuditLogs } from './components/admin/audit/AuditLogs';
import { AdminStatistics } from './components/admin/statistics/AdminStatistics';
import { AdminSettings } from './components/admin/settings/AdminSettings';
import { NotificationManager } from './components/admin/notifications/NotificationManager';
import { SupportTickets } from './components/admin/support/SupportTickets';
import { SecurityDashboard } from './components/admin/security/SecurityDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 30000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Box minH="100vh" bg="gray.900">
          <Routes>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="users" element={<UsersList />} />
              <Route path="balances" element={<BalanceManagement />} />
              <Route path="verification" element={<VerificationRequests />} />
              <Route path="statistics" element={<AdminStatistics />} />
              <Route path="audit" element={<AuditLogs />} />
              <Route path="notifications" element={<NotificationManager />} />
              <Route path="support" element={<SupportTickets />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="security" element={<SecurityDashboard />} />
            </Route>
          </Routes>
        </Box>
      </BrowserRouter>
    </QueryClientProvider>
  );
}