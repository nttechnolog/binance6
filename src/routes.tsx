import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Markets } from './pages/Markets';
import { TradingView } from './pages/TradingView';
import { Profile } from './pages/Profile';
import { SpotPage } from './pages/SpotPage';
import { MarginPage } from './pages/MarginPage';
import { P2PPage } from './pages/P2PPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './middleware/authMiddleware';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Markets /> },
      { path: 'trading/:symbol', element: <TradingView /> },
      { path: 'profile', element: <Profile /> },
      { path: 'spot', element: <SpotPage /> },
      { path: 'margin', element: <MarginPage /> },
      { path: 'p2p', element: <P2PPage /> },
    ]
  },
  {
    path: '/admin',
    children: [
      { path: 'login', element: <LoginPage /> },
      {
        path: '',
        element: (
          <ProtectedRoute requiredRole="admin">
            <DashboardPage />
          </ProtectedRoute>
        )
      }
    ]
  }
]);