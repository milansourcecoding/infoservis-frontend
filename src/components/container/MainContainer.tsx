import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import {
  Container,
} from '@mui/material';

// auth
import { RoleBasedGuard } from 'src/auth/guard';

// components
import { useSettingsContext, SettingsType } from '../settings';

// ----------------------------------------------------------------------

const MainContainer = ({ title, roles, children }: any) => {
  const settings = useSettingsContext();
  const themeStretch = (settings as SettingsType)?.themeStretch ? false : 'xl';

  const [role] = useState('admin');

  return <>
    <Helmet>
      <title>{title}</title>
    </Helmet>

    <RoleBasedGuard hasContent roles={roles} sx={{ py: 10 }}>
      <Container maxWidth={themeStretch}>{children}</Container>
    </RoleBasedGuard>
  </>
}

export default MainContainer;
