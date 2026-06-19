import { useMemo } from 'react';
// locales
import { useLocales } from 'src/locales';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};



const NAV_ITEMS_BY_ROLE = {
  resident: [
    {
      title: 'menu.Resident.dashboard',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'menu.Resident.settings',
      path: '/settings',
      icon: ICONS.invoice,
    },
    {
      title: 'menu.Resident.category',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.job,
    },
  ],

  manager: [
    {
      title: 'menu.Manager.dashboard',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'menu.Manager.settings',
      path: '/settings',
      icon: ICONS.banking,
    },
    {
      title: 'menu.Manager.category',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.user,
    },
    {
      title: 'menu.Manager.tickets',
      path: '/tickets',
      icon: ICONS.job,
    },
  ],

  organization_admin: [
    {
      title: 'menu.OrganizationAdmin.dashboard',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'menu.OrganizationAdmin.settings',
      path: '/settings',
      icon: ICONS.user,
    },
    {
      title: 'menu.OrganizationAdmin.category',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.banking,
    },
    {
      title: 'menu.OrganizationAdmin.reports',
      path: '/reports',
      icon: ICONS.analytics,
    },
  ],

  super_admin: [
    {
      title: 'menu.SuperAdmin.dashboard',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'menu.SuperAdmin.settings',
      path: '/settings',
      icon: ICONS.user,
    },
    {
      title: 'menu.SuperAdmin.category',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.banking,
    },
    {
      title: 'menu.SuperAdmin.reports',
      path: '/reports',
      icon: ICONS.analytics,
    },
  ],

  accountant: [
    {
      title: 'menu.Accountant.dashboard',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'menu.Accountant.settings',
      path: '/settings',
      icon: ICONS.user,
    },
    {
      title: 'menu.Accountant.category',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.banking,
    },
    {
      title: 'menu.Accountant.reports',
      path: '/reports',
      icon: ICONS.analytics,
    },
  ],

  worker: [
    {
      title: 'menu.Worker.dashboard',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'menu.Worker.settings',
      path: '/settings',
      icon: ICONS.user,
    },
    {
      title: 'menu.Worker.category',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.banking,
    },
    {
      title: 'menu.Worker.reports',
      path: '/reports',
      icon: ICONS.analytics,
    },
  ],

  technician: [
    {
      title: 'menu.Technician.dashboard',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'menu.Technician.settings',
      path: '/settings',
      icon: ICONS.user,
    },
    {
      title: 'menu.Technician.category',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.banking,
    },
    {
      title: 'menu.Technician.reports',
      path: '/reports',
      icon: ICONS.analytics,
    },
  ],

  cleaner: [
    {
      title: 'menu.Cleaner.dashboard',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'menu.Cleaner.settings',
      path: '/settings',
      icon: ICONS.user,
    },
    {
      title: 'menu.Cleaner.category',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.banking,
    },
    {
      title: 'menu.Cleaner.reports',
      path: '/reports',
      icon: ICONS.analytics,
    },
  ],
  
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();
  const { user } = useAuthContext();
  const userRoles = user?.roles?.length ? user.roles : ['resident'];

  const data = useMemo(() => {
    const items = userRoles.flatMap((role) => NAV_ITEMS_BY_ROLE[role] || []);

    const uniqueItems = items.filter(
      (item, index, self) => index === self.findIndex((i) => i.path === item.path)
    );

    return [
      {
        subheader: t('menu.operativa'),
        items: uniqueItems.map((item) => ({
          ...item,
          title: t(item.title),
        })),
      },
    ];
  }, [t, userRoles]);

  return data;
}
