import React from 'react';

// @mui
import { useTheme, alpha } from '@mui/material/styles';
import {
  Typography,
  Stack,
  Button,
} from '@mui/material';

// locales
import { useLocales } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useDispatch } from 'react-redux';

// components
import UploadDialog from 'src/components/upload/uploadDialog/form.tsx';
import uploadDialogSlice from 'src/components/upload/uploadDialog/slice.tsx';

import MainContainer from '../../components/container/MainContainer.tsx';

import { bgGradient } from '../../theme/css';
import { ComingSoonIllustration } from '../../assets/illustrations';

// utils
import { AppDispatch } from '../../utils/store.tsx';
import { mbToBytes } from '../../utils/utils.tsx';
import { RoleType } from '../../utils/enums.tsx';

// ----------------------------------------------------------------------

const WelcomePage = () => {
  const theme = useTheme();

  const { user }: any = useAuthContext();

  const { t } = useLocales();

  const dispatch = useDispatch<AppDispatch>();


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

        <Button
          variant='contained'
          onClick={() => {
            dispatch(uploadDialogSlice.setShow({ show: true }));
          }}
        >Upload Dialog</Button>
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

    <UploadDialog
      path={'https://httpbin.org/post'}
      // accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.bmp'] }}
      // accept={{ 'application/pdf': ['.pdf'] }}
      accept={{ 
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
      }}
      multiple={false}
      numOfFiles={null}
      maxFileSize={mbToBytes(5)}
      onSuccess={(data: any|null, state: boolean|null) => {
        if(state && data && data.data){
          console.log("🚀 ~ WelcomePage ~ UploadDialog:", data.data)
        }
      }}
    />
  </MainContainer>
}

export default WelcomePage;
