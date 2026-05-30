/* eslint-disable jsx-a11y/aria-role */
import React from 'react';

import {
  Tabs,
  Tab,
} from '@mui/material';

// locales
import { useLocales } from 'src/locales';

// import { useAuthContext } from 'src/auth/hooks';

import { Icon } from '@iconify/react';

// enums
import { UserType } from '../../utils/enums.tsx';
// components
import MainContainer from '../../components/container/MainContainer.tsx';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs/index';

import AccountGeneral from './account-general';
import AccountChangePassword from './account-change-password';

// ----------------------------------------------------------------------



const Settings = () => {
  const { t } = useLocales();


  const TABS = [
    {
      value: 'general',
      label: t('profile.tabs.tab1'),
      icon: <Icon icon={'solar:user-id-bold'} width={24} />,
    },
    {
      value: 'security',
      label: t('profile.tabs.tab2'),
      icon: <Icon icon={'ic:round-vpn-key'} width={24} />
    },
  ];

  // const { user }: any = useAuthContext();

  const [currentTab, setCurrentTab] = React.useState('general');


  const handleChangeTab = React.useCallback((event: any, newValue: any) => {
    setCurrentTab(newValue);
  }, []);


  return <MainContainer title={t('profile.title')} roles={[ UserType.Admin, UserType.User ]}>
    <CustomBreadcrumbs
      heading={t('settings.settings')}
      links={[
        { name: t('menu.dashboard'), href: '/dashboard' },
        { name: t('profile.breadcrumbs.account') },
      ]}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
      action={null}
      moreLink={null}
      activeLast={null}
    />

    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {TABS.map((tab) => (
        <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
      ))}
    </Tabs>

    {currentTab === 'general' && <AccountGeneral />}

    {currentTab === 'security' && <AccountChangePassword />}
  </MainContainer>
}

export default Settings;
