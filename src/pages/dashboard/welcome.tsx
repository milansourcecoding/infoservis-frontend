import React from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import {
  Typography,
  Stack,
} from '@mui/material';

// locales
import { useLocales } from 'src/locales';

import { useAuthContext } from 'src/auth/hooks';

// enums
import { RoleType } from '../../utils/enums.tsx';

// components
import MainContainer from '../../components/container/MainContainer.tsx';

import { bgGradient } from '../../theme/css';
import { ComingSoonIllustration } from '../../assets/illustrations';
// ----------------------------------------------------------------------

const WelcomePage = () => {
  const theme = useTheme();

  const { user }: any = useAuthContext();

  const { t } = useLocales();

  return <MainContainer title={t('menu.dashboard')} roles={Object.values(RoleType)}>
    <Stack
      flexDirection={{ xs: 'column', md: 'row' }}
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette.primary.light, 0.2),
          endColor: alpha(theme.palette.primary.main, 0.2),
        }),
        height: { md: 1 },
        borderRadius: 2,
        position: 'relative',
        color: 'primary.darker',
        backgroundColor: 'common.white',
      }}
    >
      <Stack
        flexGrow={1}
        justifyContent="center"
        alignItems={{ xs: 'center', md: 'flex-start' }}
        sx={{
          p: {
            xs: theme.spacing(5, 3, 0, 3),
            md: theme.spacing(5),
          },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {`Welcome back 👋 \n ${user?.name}`}
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {`ID : ${user?.id}`}
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {`Email : ${user?.email}`}
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {`Roles : ${user?.roles}`}
        </Typography>



        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {`City : ${user?.city}`}
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {`Address : ${user?.address}`}
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {`JMBG : ${user?.jmbg}`}
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {`Phone : ${user?.phone}`}
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {`Status : ${user?.status}`}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            opacity: 0.8,
            maxWidth: 360,
            mb: { xs: 3, xl: 5 },
          }}
        >
          {user?.email}
        </Typography>
      </Stack>

      <Stack
        component="span"
        justifyContent="center"
        sx={{
          p: { xs: 5, md: 3 },
          maxWidth: 360,
          mx: 'auto',
        }}
      >
        <ComingSoonIllustration />
      </Stack>
    </Stack>
  </MainContainer>
}

export default WelcomePage;
