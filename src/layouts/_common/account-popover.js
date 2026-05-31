/* eslint-disable react/no-unknown-property */
/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-template */
/* eslint-disable react/jsx-curly-brace-presence */
import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { grey } from '@mui/material/colors';
// routes
// import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useLocales } from 'src/locales';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import Label from 'src/components/label';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// import { UserType } from '../../utils/enums.tsx';
// import {  } from '../../utils/utils.tsx';

// ----------------------------------------------------------------------

const { REACT_APP_VERSION, REACT_APP_ENVIRONMENT } = process.env;

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();

  const { logout, user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const popover = usePopover();

  const { t } = useLocales();



  const OPTIONS = [
    {
      label: t('settings.home'),
      linkTo: '/',
    },
    {
      label: t('settings.settings'),
      linkTo: '/settings',
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      popover.onClose();
      router.replace('/');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleClickItem = (path) => {
    popover.onClose();
    router.push(path);
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        {
          (user && user?.logo)
          ?
          // <Avatar
          //   src={(user?.uloga == UserType.Admin) ? getFirmaLogo(user?.logo) : getUserLogo(user?.logo, VelicinaSlike.Mala)}
          //   alt={user?.name}
          //   sx={{
          //     width: 36,
          //     height: 36,
          //     border: (theme) => `solid 2px ${theme.palette.background.default}`,
          //   }}
          // >
          //   {user?.name.charAt(0).toUpperCase()}
          // </Avatar>
          <Avatar alt={user?.name} sx={{ width: 36, height: 36, bgcolor: grey[400] }}>{user?.name[0]}</Avatar>
          :
          <Avatar alt={user?.name} sx={{ width: 36, height: 36, bgcolor: grey[400] }}>{user?.name[0]}</Avatar>
        }
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          {t('settings.logout')}
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box pt={0.2} pb={1} pr={1} textAlign={'end'}>
          <Tooltip title={REACT_APP_ENVIRONMENT} style={{ cursor: 'help' }} >
            <Label variant={'soft'} color={(REACT_APP_ENVIRONMENT == 'production') ? 'success' : (REACT_APP_ENVIRONMENT == 'staging') ? 'error' : 'default'} sx={{ textTransform: 'lowercase' }}>v{REACT_APP_VERSION}</Label>
          </Tooltip>
        </Box>
      </CustomPopover>
    </>
  );
}
