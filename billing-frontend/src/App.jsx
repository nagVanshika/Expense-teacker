import Configuration from './features/configuration/Configuration';
import Expenses from './features/expenses/Expenses';
import Collections from './features/collections/Collections';
import Overview from './features/overview/Overview';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './screens/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './styles/globals.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Overview /> },
      { path: '/collections', element: <Collections /> },
      { path: '/expenses', element: <Expenses /> },
      { path: '/config', element: <Configuration /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
