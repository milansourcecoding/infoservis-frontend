/* eslint-disable no-shadow */
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';

import { useAuthContext } from 'src/auth/hooks';

import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';

// routes
// import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import Label from 'src/components/label';
import { VelicinaSlike } from '../../utils/enums.tsx'
// import { getFirmaLogo } from '../../utils/utils.tsx';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { logout, user } = useAuthContext();

  const router = useRouter();
  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const { t } = useLocales();


  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('logout_error'), { variant: 'error' });
    }
  };


  return (
    <Stack
      sx={{
        px: 2,
        py: 1,
        textAlign: 'center',

        [theme.breakpoints.up('lg')]: {
          position: 'sticky',
          bottom: '0px',
          backgroundColor: 'white',
        },
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          {
            (user && user.logo)
            ?
            // <Avatar
            //   src={getFirmaLogo(firma?.logo, VelicinaSlike.Mala)}
            //   alt={firma?.name}
            //   sx={{
            //     width: 48,
            //     height: 48,
            //     border: (theme) => `solid 2px ${theme.palette.background.default}`,
            //   }}
            // >
            //   {firma?.name.charAt(0).toUpperCase()}
            // </Avatar>
            <Avatar alt={user?.name} sx={{ width: 48, height: 48, bgcolor: grey[400] }}>{(user && user?.name && user?.name !== '') ? user?.name[0] : ''}</Avatar>
            :
            <Avatar alt={user?.name} sx={{ width: 48, height: 48, bgcolor: grey[400] }}>{(user && user?.name && user?.name !== '') ? user?.name[0] : ''}</Avatar>
          }

          <Label
            color={'default'}
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            {user?.name || ''}
          </Label>
        </Box>

        <Stack spacing={0} sx={{ mt: 1, mb: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.email || ''}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.disabled' }} style={{ width: '225px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} noWrap>
            {user?.address || ''}
          </Typography>
        </Stack>

        <Button variant="contained" size='small' onClick={handleLogout}>
        {t('settings.logout')}
        </Button>
      </Stack>
    </Stack>
  );
}
