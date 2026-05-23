import { useMemo } from 'react';
// locales
import { useLocales } from 'src/locales';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

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

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      {
        subheader: t(t('menu.operativa')),
        items: [

          {
            title: t('menu.dashboard'),
            path: '/dashboard',
            icon: ICONS.dashboard,
          },

          {
            title: t('menu.radni_nalog'),
            path: 'radni-nalog',
            icon: ICONS.job,
            children: [
              {
                title: t('menu.radni_nalog_item.radni_nalog'),
                path: '/radni-nalog/radni-nalog-list',
              },
            ],
          },

          {
            title: t('menu.sifarnici'),
            path: 'sifarnici',
            icon: ICONS.blank,
            children: [
              {
                title: t('menu.sifarnici_item.kategorija'),
                path: '/sifarnici/kategorija-list',
              },
              {
                title: t('menu.sifarnici_item.radnik'),
                path: '/sifarnici/radnik-list',
              },
              {
                title: t('menu.sifarnici_item.upravnik'),
                path: '/sifarnici/upravnik-list',
              },
            ],
          },

        ],
      },

    ],
    [t]
  );

  return data;
}
