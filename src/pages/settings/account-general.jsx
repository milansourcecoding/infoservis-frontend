/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable prefer-template */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';
import { fData } from 'src/utils/format-number';

import { useLocales } from 'src/locales';
// Redux
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../utils/store.tsx';
import settings from './redux/settings.tsx';

// import {  } from '../../utils/utils.tsx';
import { UserType } from '../../utils/enums.tsx';

// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
} from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useLocales();

  const { isLoading } = useTypedSelector((state) => state.settings);
  const dispatch = useDispatch();

  const { user, setUser } = useAuthContext();

  const UpdateUserSchemaAdmin = Yup.object().shape({
    naziv: Yup.string().required(),
    imePrezime: Yup.string().required(),
    grad: Yup.string().required(),
    adresa: Yup.string().required(),
    email: Yup.string().required().email(),
  });

  const UpdateUserSchemaRadnik = Yup.object().shape({
    imePrezime: Yup.string().required(),
    grad: Yup.string().required(),
    adresa: Yup.string().required(),
    email: Yup.string().required().email(),
  });

  const defaultValues = {
    id: user?.id || '',
    naziv: user?.naziv || '',
    imePrezime: user?.imePrezime || '',
    grad: user?.grad || '',
    adresa: user?.adresa || '',
    email: user?.email || '',
    uloga: user?.uloga || UserType.None,
    logo: null, // user?.logo ? (user?.uloga == UserType.Admin) ? getFirmaLogo(user?.logo) : getUserLogo(user?.logo) : null,
  };

  const methods = useForm({
    resolver: yupResolver((user?.uloga == UserType.Admin) ? UpdateUserSchemaAdmin : UpdateUserSchemaRadnik),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if(user?.uloga == UserType.Admin){
      await dispatch(settings.callChangeGeneralApi(data, (res, msg, state) => {
        if(state){
          setUser(res);
          enqueueSnackbar(msg, { variant: 'success' });
        } else {
          enqueueSnackbar(msg, { variant: 'error' });
        }
      }));

    } else if(user?.uloga == UserType.User){
      await dispatch(settings.callChangeGeneralRadnikApi(data, (res, msg, state) => {
        if(state){
          setUser(res);
          enqueueSnackbar(msg, { variant: 'success' });
        } else {
          enqueueSnackbar(msg, { variant: 'error' });
        }
      }));
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('logo', newFile, { shouldValidate: true });

        if(user?.uloga == UserType.Admin){
          dispatch(settings.callUploadLogoApi(newFile, (res, msg, state) => {
            if(state){
              setUser(res);
              enqueueSnackbar(t('profile.info.slika'), { variant: 'success' });
            } else {
              enqueueSnackbar(msg, { variant: 'error' });
            }
          }));

        } else if(user?.uloga == UserType.User){
          dispatch(settings.callUploadLogoRadnikApi(user?.id, newFile, (res, msg, state) => {
            if(state){
              setUser(res);
              enqueueSnackbar(t('profile.info.slika'), { variant: 'success' });
            } else {
              enqueueSnackbar(msg, { variant: 'error' });
            }
          }));
        }
      }
    },
    [setValue]
  );

  const removeLogo = async () => {
    if(user?.uloga == UserType.Admin){
      await dispatch(settings.callremoveLogoApi((res, msg, state) => {
        if(state){
          setValue('logo', null, { shouldValidate: true });
          setUser(res);
          enqueueSnackbar(msg, { variant: 'success' });
        } else {
          enqueueSnackbar(msg, { variant: 'error' });
        }
      }));

    } else if(user?.uloga == UserType.User){
      await dispatch(settings.callremoveLogoRadnikApi(user?.id, (res, msg, state) => {
        if(state){
          setValue('logo', null, { shouldValidate: true });
          setUser(res);
          enqueueSnackbar(msg, { variant: 'success' });
        } else {
          enqueueSnackbar(msg, { variant: 'error' });
        }
      }));
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
      <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }} style={{ minHeight: 400 }}>
            <RHFUploadAvatar
              name="logo"
              maxSize={2048000}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  {t('profile.info.allowed')} *.jpeg, *.jpg, *.png
                  <br /> {t('profile.info.max_size')} {fData(2048000)}
                </Typography>
              }
            />

            {user?.logo && <Button variant="soft" color="error" sx={{ mt: 3 }} onClick={removeLogo}>{t('profile.form.buttons.remove')}</Button>}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }} style={{ minHeight: 400 }}>
            {(user?.uloga == UserType.Admin) && <Stack spacing={3} alignItems="flex-end" sx={{ mb: 3 }}>
              <RHFTextField name="naziv" label={t('profile.form.fields.naziv')}
                InputLabelProps={{ shrink: true }}
                size={'small'}
              />
            </Stack>}

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              sx={{ mb: 3 }}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="imePrezime" label={t('profile.form.fields.imePrezime')}
                InputLabelProps={{ shrink: true }}
                size={'small'}
              />
              <RHFTextField name="email" label={t('profile.form.fields.email')}
                InputLabelProps={{ shrink: true }}
                size={'small'}
              />
            </Box>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              sx={{ mb: 3 }}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="grad" label={t('profile.form.fields.grad')}
                InputLabelProps={{ shrink: true }}
                size={'small'}
              />
              <RHFTextField name="adresa" label={t('profile.form.fields.adresa')}
                InputLabelProps={{ shrink: true }}
                size={'small'}
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading}>
              {t('profile.form.buttons.save')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
