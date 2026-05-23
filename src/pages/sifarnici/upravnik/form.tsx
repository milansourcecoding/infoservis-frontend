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
import { useFormik } from 'formik';
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
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { createRow, updateRow, formatPhoneNumnber } from '../../../utils/utils.tsx';
import { UserType, UpravnikType } from '../../../utils/enums.tsx';

// components
import { useSnackbar } from 'src/components/snackbar';
import Block from 'src/components/block/block';
// import SelectAutocomplete from 'src/components/autocomplete/SelectAutocomplete.tsx';

// Redux
import { useDispatch } from 'react-redux';
import { RootState, AppDispatch, useTypedSelector } from '../../../utils/store.tsx';
import slice, { API, getFields, FormikContext, formSchema, initialValues, prepareForm, prepareData } from './reduxSlice.tsx';
import listSlice from '../../../utils/slice/form/listSlice.tsx';
// import selectAutocompleteSlice from '../../../components/autocomplete/selectAutocompleteSlice.tsx';

// ----------------------------------------------------------------------

const PhoneInput = (props: any) => (
  <InputMask {...props} mask={formatPhoneNumnber()} />
);


export default function Form(props: any) {
  const { t } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch<AppDispatch>();
  const { rows, total, searchQuery } = useTypedSelector((state: RootState) => state.listSlice);
  const { isLoading, show, details, id } = useTypedSelector((state: any) => state[API + 'ReduxSlice']);

  const password = useBoolean();


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
    setValues(form);
    setTimeout(() => {
      setErrors({});
    }, 0);
    dispatch(slice.setLoading(false));
  }, [details]);


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: formSchema(t, id),
    validateOnMount: false,
    validateOnChange: true,
    onSubmit: values => {
      onSubmit(values, (data: any) => {
        if(props && props.onSave){
          props.onSave(data);
        }

        onCancel();
      });
    },
  });
  const { values, errors, setValues, setErrors, handleChange, setFieldValue, validateForm, handleSubmit }: any = formik;


  const onSubmit = (values: any, callback: (data: any) => void) => {
    let data = prepareData(values, id);
    if(id > 0){
      dispatch(slice.callUpdateApi(data, (state: boolean, data: any, message: string) => {
        if(state){
          if(message && message != ''){
            enqueueSnackbar(message, { variant: state ? 'success' : 'error' });
          }

          const newRows: any = updateRow(rows, data);
          dispatch(listSlice.changeRows(newRows));
          dispatch(listSlice.calStatsApi(API, searchQuery));

          callback(data);
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

          const newRows: any = createRow(rows, data);
          const newTotal = (total + 1)

          dispatch(listSlice.changeRows(newRows));
          dispatch(listSlice.changeTotal(newTotal));
          dispatch(listSlice.calStatsApi(API, searchQuery));

          callback(data);
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
    setValues(form);
    dispatch(slice.setValues(form));
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
          value={values.imePrezime}
          error={Boolean(errors.imePrezime)}
          helperText={errors.imePrezime as string}
          onChange={handleChange}
          {...getFields(t, 'imePrezime')}
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
      {/* <Grid item xs={12}>
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
      </Grid> */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          name={'brojTelefona'}
          value={values.brojTelefona}
          error={Boolean(errors.brojTelefona)}
          helperText={errors.brojTelefona as string}
          onChange={handleChange}
          InputProps={{
            inputComponent: PhoneInput
          }}
          {...getFields(t, 'brojTelefona')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name={'grad'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.grad}
          error={Boolean(errors.grad)}
          helperText={errors.grad as string}
          onChange={handleChange}
          {...getFields(t, 'grad')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name={'adresa'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.adresa}
          error={Boolean(errors.adresa)}
          helperText={errors.adresa as string}
          onChange={handleChange}
          {...getFields(t, 'adresa')}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth error={Boolean(errors.tip)}>
          <InputLabel>{getFields(t, 'tip')?.label}</InputLabel>
          <Select
            size={'small'}
            value={values.tip}
            onChange={(e: any) => {
              setFieldValue('tip', e.target.value);
            }}
            {...getFields(t, 'tip')}
          >
            <MenuItem value={UpravnikType.DomaceLice}>{t('enums.upravnikType.domaceLice')}</MenuItem>
            <MenuItem value={UpravnikType.ProfesionalniUpravnik}>{t('enums.upravnikType.profesionalniUpravnik')}</MenuItem>
          </Select>
          <FormHelperText>{errors.tip as string}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={<Switch
            checked={values.isActive}
            onChange={(e: any) => {
              setFieldValue('isActive', e.target.checked);
            }}
          />}
          {...getFields(t, 'isActive')}
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
