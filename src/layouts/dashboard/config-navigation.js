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
      title: 'Item.resident.1',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'Item.resident.2',
      path: '/settings',
      icon: ICONS.invoice,
    },
    {
      title: 'Item.resident.3',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.job,
    },
  ],

  manager: [
    {
      title: 'Item.manager.1',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'Item.manager.2',
      path: '/settings',
      icon: ICONS.banking,
    },
    {
      title: 'Item.manager.3',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.user,
    },
    {
      title: 'Item.manager.4',
      path: '/tickets',
      icon: ICONS.job,
    },
  ],

  organization_admin: [
    {
      title: 'Item.organization.1',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'Item.organization.2',
      path: '/settings',
      icon: ICONS.user,
    },
    {
      title: 'Item.organization.3',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.banking,
    },
    {
      title: 'Item.organization.4',
      path: '/reports',
      icon: ICONS.analytics,
    },
  ],

  super_admin: [
    {
      title: 'Item.super_admin.1',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'Item.super_admin.2',
      path: '/settings',
      icon: ICONS.user,
    },
    {
      title: 'Item.super_admin.3',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.banking,
    },
    {
      title: 'Item.super_admin.4',
      path: '/reports',
      icon: ICONS.analytics,
    },
  ],

  acountant: [
    {
      title: 'Item.acountant.1',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'Item.acountant.2',
      path: '/settings',
      icon: ICONS.user,
    },
    {
      title: 'Item.acountant.3',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.banking,
    },
    {
      title: 'Item.acountant.4',
      path: '/reports',
      icon: ICONS.analytics,
    },
  ],

  worker: [
    {
      title: 'Item.worker.1',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'Item.worker.2',
      path: '/settings',
      icon: ICONS.user,
    },
    {
      title: 'Item.worker.3',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.banking,
    },
    {
      title: 'Item.worker.4',
      path: '/reports',
      icon: ICONS.analytics,
    },
  ],

  tecnician: [
    {
      title: 'Item.tecnician.1',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'Item.tecnician.2',
      path: '/settings',
      icon: ICONS.user,
    },
    {
      title: 'Item.tecnician.3',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.banking,
    },
    {
      title: 'Item.tecnician.4',
      path: '/reports',
      icon: ICONS.analytics,
    },
  ],

  cleaner: [
    {
      title: 'Item.cleaner.1',
      path: '/dashboard',
      icon: ICONS.dashboard,
    },
    {
      title: 'Item.cleaner.2',
      path: '/settings',
      icon: ICONS.user,
    },
    {
      title: 'Item.cleaner.3',
      path: '/sifarnici/kategorija-list',
      icon: ICONS.banking,
    },
    {
      title: 'Item.cleaner.4',
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
