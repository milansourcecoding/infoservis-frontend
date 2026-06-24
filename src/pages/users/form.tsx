/* eslint-disable no-shadow */
/* eslint-disable object-shorthand */
/* eslint-disable react/jsx-fragments */
/* eslint-disable arrow-body-style */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/order */
/* eslint-disable prefer-const */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-template */
/* eslint-disable no-lonely-if */
import React from 'react';
import { Icon } from '@iconify/react';
import InputMask from 'react-input-mask';


import { useLocales } from 'src/locales';
import { useBoolean } from 'src/hooks/use-boolean';

// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
// import InputLabel from '@mui/material/InputLabel';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

// components
import { useSnackbar } from 'src/components/snackbar';
import Block from 'src/components/block/block';
import DropdownAutocomplete from 'src/components/autocomplete/DropdownAutocomplete.tsx';
// import SelectAutocomplete from 'src/components/autocomplete/SelectAutocomplete.tsx';

// Redux
import { useDispatch } from 'react-redux';
import { AppDispatch, useTypedSelector } from '../../utils/store.tsx';
import slice, { name as sliceName, getFields, useFormik, FormikContext, formSchema, initialValues, prepareForm, prepareData } from './slice.tsx';
// import selectAutocompleteSlice from '../../components/autocomplete/selectAutocompleteSlice.tsx';

import { formatPhoneNumnber, getRoles, getCities } from '../../utils/utils.tsx';
// import {  } from '../../utils/enums.tsx';

// ----------------------------------------------------------------------

const PhoneInput = (props: any) => (
  <InputMask {...props} mask={formatPhoneNumnber()} />
);


export default function Form(props: any) {
  const { t } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, show, details, id } = useTypedSelector((state: any) => state[sliceName]);

  const password = useBoolean();
  const password_confirmation = useBoolean();


  React.useEffect(() => {
    return () => {
      dispatch(slice.resetSlice());
    }
  }, []);

  React.useEffect(() => {
    if(show){
      if(id && id > 0){
        dispatch(slice.callDetailsApi(id, (state: boolean, data: any, message: string) => {}));
      } else {
        setTimeout(() => {
          setErrors({});
        }, 0);
      }
    } else {
      setTimeout(() => {
        setErrors({});
      }, 0);
    }
  }, [show, id]);

  React.useEffect(() => {
    dispatch(slice.setLoading(true));
    let form = prepareForm(details, initialValues);
    resetForm({ values: form });
    setTimeout(() => {
      setErrors({});
    }, 0);
    dispatch(slice.setLoading(false));
  }, [details]);


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: formSchema(t, id),
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: (values: any) => onSubmit(values),
  });
  const { values, errors, setErrors, resetForm, handleChange, setFieldValue, handleSubmit }: any = formik;


  const onSubmit = (values: any) => {
    let data = prepareData(values, id);
    if(id > 0){
      dispatch(slice.callUpdateApi(data, (state: boolean, data: any, message: string) => {
        if(state){
          if(message && message != ''){
            enqueueSnackbar(message, { variant: state ? 'success' : 'error' });
          }

          if(props && props.onUpdate){
            props.onUpdate(data);
          }

          onCancel();
        } else {
          if(message && message != ''){
            enqueueSnackbar(message, { variant: 'error' });
          }
        }
      }));
    } else {
      dispatch(slice.callCreateApi(data, (state: boolean, data: any, message: string) => {
        if(state){
          if(message && message != ''){
            enqueueSnackbar(message, { variant: state ? 'success' : 'error' });
          }

          if(props && props.onCreate){
            props.onCreate(data);
          }
          
          onCancel();
        } else {
          if(message && message != ''){
            enqueueSnackbar(message, { variant: 'error' });
          }
        }
      }));
    }
  }
  const onCancel = () => {
    dispatch(slice.setShow({ show: false, id: null, payload: null }));
    let form = prepareForm(null, initialValues);
    resetForm({ values: form });
    setTimeout(() => {
      setErrors({});
    }, 0);
    dispatch(slice.resetSlice());
  }


  const footer = () => {
    return <React.Fragment>
      <Button
        variant="outlined"
        onClick={() => {
          onCancel();
        }}
      >
        {t('buttons.cancel')}
      </Button>

      <LoadingButton
        variant="contained"
        loading={isLoading}
        onClick={() => {
          handleSubmit();
        }}
      >
        {t('buttons.save')}
      </LoadingButton>
    </React.Fragment>
  }

  const form = () => {
    return <React.Fragment>
      <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          autoFocus
          value={values.name}
          error={Boolean(errors.name)}
          helperText={errors.name as string}
          onChange={handleChange}
          {...getFields(t, 'name')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.jmbg}
          error={Boolean(errors.jmbg)}
          helperText={errors.jmbg as string}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setFieldValue('jmbg', value);
          }}
          {...getFields(t, 'jmbg')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          name={'phone'}
          value={values.phone}
          error={Boolean(errors.phone)}
          helperText={errors.phone as string}
          onChange={handleChange}
          InputProps={{
            inputComponent: PhoneInput
          }}
          {...getFields(t, 'phone')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          type={'email'}
          name={'email'}
          autoComplete='off'
          value={values.email}
          error={Boolean(errors.email)}
          helperText={errors.email as string}
          onChange={handleChange}
          {...getFields(t, 'email')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          name={'password'}
          autoComplete="new-password"
          value={values.password}
          error={Boolean(errors.password)}
          helperText={errors.password as string}
          onChange={handleChange}
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end" size={'small'}>
                  <Icon icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...getFields(t, 'password')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          name={'password_confirmation'}
          autoComplete="new-password"
          value={values.password_confirmation}
          error={Boolean(errors.password_confirmation)}
          helperText={errors.password_confirmation as string}
          onChange={handleChange}
          type={password_confirmation.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password_confirmation.onToggle} edge="end" size={'small'}>
                  <Icon icon={password_confirmation.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...getFields(t, 'password_confirmation')}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth error={Boolean(errors.city)}>
          <DropdownAutocomplete
            freeSolo={false}
            multiple={false}
            disableClearable
            labelField={'name'}
            label={getFields(t, 'city').label}
            options={getCities()}
            value={values.city}
            onChange={(e, value) => {
              e.preventDefault();
              e.stopPropagation();

              setFieldValue('city', value?.name || '');
            }}
            onInputChange={(e, value) => {}}
            error={Boolean(errors.city)}
          />
          <FormHelperText>{errors.city as string}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name={'address'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.address}
          error={Boolean(errors.address)}
          helperText={errors.address as string}
          onChange={handleChange}
          {...getFields(t, 'address')}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth error={Boolean(errors.roles)}>
          <DropdownAutocomplete
            freeSolo={false}
            multiple
            disableClearable
            label={getFields(t, 'roles').label}
            options={getRoles()}
            value={values.roles}
            onChange={(e, value) => {
              e.preventDefault();
              e.stopPropagation();

              setFieldValue('roles', value);
            }}
            onInputChange={(e, value) => {}}
            error={Boolean(errors.roles)}
          />
          <FormHelperText>{errors.roles as string}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={<Switch
            checked={values.is_active}
            onChange={(e: any) => {
              setFieldValue('is_active', e.target.checked);
            }}
          />}
          {...getFields(t, 'is_active')}
        />
      </Grid>
    </React.Fragment>
  }


  return <Drawer
    anchor={'right'}
    open={show}
    onClose={() => {
      onCancel();
    }}
    PaperProps={{
      sx: {
        width: 400,
        backgroundColor: 'white'
      },
    }}
  >
    <FormikContext.Provider value={formik}>
      <Box sx={{
          position: 'sticky',
          top: '0px',
          zIndex: 2,
          backgroundColor: '#f4f6f8',
          margin: '0px',
        }}
      >
        <DialogTitle>{id ? t('form.editTitle') : t('form.addTitle')}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            onCancel();
          }}
          sx={{
            position: 'absolute',
            right: 12,
            top: 18,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Icon icon={'system-uicons:close'} />
        </IconButton>
        <Divider />
      </Box>

      <DialogContent sx={{ backgroundColor: 'white' }}>
        <Box sx={{ mt: 2, mb: 2, paddingBottom: '50px', height: 'calc(100vh - 178px)' }}>
          <Grid container spacing={2}>{form()}</Grid>
        </Box>
      </DialogContent>

      <Box sx={{
          position: 'sticky',
          bottom: '0px',
          width: '100%',
          zIndex: 2,
          backgroundColor: '#f4f6f8',
          margin: '0px',
        }}
      >
        <Divider />
        <DialogActions>{footer()}</DialogActions>
      </Box>

      <Block isLoading={isLoading} />
    </FormikContext.Provider>
  </Drawer>
}
