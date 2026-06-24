/* eslint-disable import/no-unresolved */
import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// MENU
const WelcomePage = lazy(() => import('src/pages/dashboard/welcome'));
const SettingsPage = lazy(() => import('src/pages/settings/settings'));
const Users = lazy(() => import('src/pages/users/list'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <WelcomePage />, index: true },
      { path: 'dashboard', element: <WelcomePage /> },
    ],
  },

  {
    path: 'settings',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <SettingsPage />, index: true },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },

  {
    path: 'users',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <Users />, index: true },
      { path: 'users', element: <Users /> },
    ],
  },

];
