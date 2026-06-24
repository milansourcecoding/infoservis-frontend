/* eslint-disable eqeqeq */
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';


import { useAuthContext } from 'src/auth/hooks';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useLocales } from 'src/locales';

// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// Redux
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../utils/store.tsx';
import settings from './redux/settings.tsx';
import { RoleType } from '../../utils/enums.tsx';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useLocales();

  const { user, setUser } = useAuthContext();

  const { isLoading } = useTypedSelector((state) => state.settings);
  const dispatch = useDispatch();

  const password = useBoolean();

  const ChangePassWordSchema = Yup.object().shape({
    // oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string()
      .required()
      .min(6, t('profile.info.password'))
      .test(
        'no-match',
        t('profile.info.new_password'),
        (value, { parent }) => value !== parent.oldPassword
      ),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], t('profile.info.match_password')),
  });

  const defaultValues = {
    // oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if(user?.uloga == RoleType.SuperAdmin){
      await dispatch(settings.callChangePasswordApi({ password: data.newPassword }, (res, msg, state) => {
        if(state){
          enqueueSnackbar(msg, { variant: 'success' });
        } else {
          enqueueSnackbar(msg, { variant: 'error' });
        }
      }));

    } else if(user?.uloga == RoleType.Worker){
      await dispatch(settings.callChangePasswordRadnikApi({ id: user?.id, password: data.newPassword }, (res, msg, state) => {
        if(state){
          enqueueSnackbar(msg, { variant: 'success' });
        } else {
          enqueueSnackbar(msg, { variant: 'error' });
        }
      }));
    }

  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        {/* <RHFTextField
          name="oldPassword"
          type={password.value ? 'text' : 'password'}
          label="Old Password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        /> */}

        <RHFTextField
          name="newPassword"
          InputLabelProps={{ shrink: true }}
          size={'small'}
          label={t('profile.form.fields.password')}
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end" size={'small'}>
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> {t('profile.info.password')}
            </Stack>
          }
        />

        <RHFTextField
          name="confirmNewPassword"
          InputLabelProps={{ shrink: true }}
          size={'small'}
          type={password.value ? 'text' : 'password'}
          label={t('profile.form.fields.password_again')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end" size={'small'}>
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting || isLoading} sx={{ ml: 'auto' }}>
        {t('profile.form.buttons.save')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
