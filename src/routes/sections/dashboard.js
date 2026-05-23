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
const KategorijaList = lazy(() => import('src/pages/sifarnici/kategorija/list'));
const UpravnikList = lazy(() => import('src/pages/sifarnici/upravnik/list'));
const RadnikList = lazy(() => import('src/pages/sifarnici/radnik/list'));
const RadniNalogList = lazy(() => import('src/pages/radniNalog/list'));

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
    path: 'sifarnici/kategorija-list',
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
      { element: <KategorijaList />, index: true },
      { path: 'sifarnici/kategorija-list', element: <KategorijaList /> },
    ],
  },

  {
    path: 'sifarnici/upravnik-list',
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
      { element: <UpravnikList />, index: true },
      { path: 'sifarnici/upravnik-list', element: <UpravnikList /> },
    ],
  },

  {
    path: 'sifarnici/radnik-list',
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
      { element: <RadnikList />, index: true },
      { path: 'sifarnici/radnik-list', element: <RadnikList /> },
    ],
  },

  {
    path: 'radni-nalog/radni-nalog-list',
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
      { element: <RadniNalogList />, index: true },
      { path: 'radni-nalog/radni-nalog-list', element: <RadniNalogList /> },
    ],
  },

];
