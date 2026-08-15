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
const Building = lazy(() => import('src/pages/building/list'));
const BuildingDetails = lazy(() => import('src/pages/building/details'));
const BuildingEditPage = lazy(() => import('src/pages/building/edit'));
const BuildingUnitCreatePage = lazy(() => import('src/pages/building/units/create'));
const BuildingManagerCreatePage = lazy(() => import('src/pages/building/managers/create'));
const Organization = lazy(() => import('src/pages/organization/list'));
const OrganizationDetails = lazy(() => import('src/pages/organization/details'));
const UnitDetailsPage = lazy(() => import('src/pages/building/units/details'));
const BuildingBillableServiceCreatePage = lazy(() => import('src/pages/building/billableServices/create'));
const BuildingBillableServiceDetailsPage = lazy(() => import('src/pages/building/billableServices/details'));
const UnitBillableServiceCreatePage = lazy(() => import('src/pages/building/units/billableServices/create'));
const UnitBillableServiceDetailsPage = lazy(() => import('src/pages/building/units/billableServices/details'));
const BuildingBankAccountCreatePage = lazy(() => import('src/pages/building/bankAccounts/create'));
const BuildingBankAccountDetailsPage = lazy(() => import('src/pages/building/bankAccounts/details'));

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

  {
    path: 'building',
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
      { element: <Building />, index: true },
      { path: ':id', element: <BuildingDetails /> },
      { path: ':id/edit', element: <BuildingEditPage /> },
      { path: ':id/units/create', element: <BuildingUnitCreatePage /> },
      { path: ':id/managers/create', element: <BuildingManagerCreatePage /> },
      { path: ':building_id/units/:id', element: <UnitDetailsPage /> },
      { path: ':id/units/create', element: <BuildingUnitCreatePage /> },
      { path: ':id/billable-services/create', element: <BuildingBillableServiceCreatePage /> },
      { path: ':building_id/billable-services/:id', element: <BuildingBillableServiceDetailsPage /> },
      { path: ':id/units/:unit_id/billable-services/create', element: <UnitBillableServiceCreatePage /> },
      { path: ':building_id/units/:unit_id/billable-services/:id', element: <UnitBillableServiceDetailsPage /> },
      { path: ':id/bank-accounts/create', element: <BuildingBankAccountCreatePage /> },
      { path: ':building_id/bank-accounts/:id', element: <BuildingBankAccountDetailsPage /> },
    ],
  },


  {
    path: 'organization',
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
      { element: <Organization />, index: true },
      { path: ':id', element: <OrganizationDetails /> },
    ],
  },

];
