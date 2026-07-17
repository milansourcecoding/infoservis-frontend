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

import { formatPhoneNumnber, getRoles, getCities, escapeChars } from '../../utils/utils.tsx';
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
      resetSubmitted();

      if(id && id > 0){
        dispatch(slice.callDetailsApi(id, (state: boolean, data: any, message: string) => {}));
      }
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
  const { values, errors, setErrors, resetForm, handleChange, setFieldValue, handleSubmit, resetSubmitted }: any = formik;


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
          onKeyDown={escapeChars}
          {...getFields(t, 'name')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
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
      <Grid item xs={12} md={6}>
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


      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'units_number'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.units_number}
          error={Boolean(errors.units_number)}
          helperText={errors.units_number as string}
          onChange={handleChange}
          {...getFields(t, 'units_number')}
        />
      </Grid>


      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'pib'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.pib}
          error={Boolean(errors.pib)}
          helperText={errors.pib as string}
          onChange={handleChange}
          {...getFields(t, 'pib')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'registration_number'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.registration_number}
          error={Boolean(errors.registration_number)}
          helperText={errors.registration_number as string}
          onChange={handleChange}
          {...getFields(t, 'registration_number')}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'bank_account'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.bank_account}
          error={Boolean(errors.bank_account)}
          helperText={errors.bank_account as string}
          onChange={handleChange}
          {...getFields(t, 'bank_account')}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'bank_ammount'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.bank_ammount}
          error={Boolean(errors.bank_ammount)}
          helperText={errors.bank_ammount as string}
          onChange={handleChange}
          {...getFields(t, 'bank_ammount')}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'area'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.area}
          error={Boolean(errors.area)}
          helperText={errors.area as string}
          onChange={handleChange}
          {...getFields(t, 'area')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'year_of_construction'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.year_of_construction}
          error={Boolean(errors.year_of_construction)}
          helperText={errors.year_of_construction as string}
          onChange={handleChange}
          {...getFields(t, 'year_of_construction')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'number_of_floors'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.number_of_floors}
          error={Boolean(errors.number_of_floors)}
          helperText={errors.number_of_floors as string}
          onChange={handleChange}
          {...getFields(t, 'number_of_floors')}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'number_of_elevators'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.number_of_elevators}
          error={Boolean(errors.number_of_elevators)}
          helperText={errors.number_of_elevators as string}
          onChange={handleChange}
          {...getFields(t, 'number_of_elevators')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'roof_type'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.roof_type}
          error={Boolean(errors.roof_type)}
          helperText={errors.roof_type as string}
          onChange={handleChange}
          {...getFields(t, 'roof_type')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'lightning_rod'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.lightning_rod}
          error={Boolean(errors.lightning_rod)}
          helperText={errors.lightning_rod as string}
          onChange={handleChange}
          {...getFields(t, 'lightning_rod')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'shelter'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.shelter}
          error={Boolean(errors.shelter)}
          helperText={errors.shelter as string}
          onChange={handleChange}
          {...getFields(t, 'shelter')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'remote_heating'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.remote_heating}
          error={Boolean(errors.remote_heating)}
          helperText={errors.remote_heating as string}
          onChange={handleChange}
          {...getFields(t, 'remote_heating')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'parking'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.parking}
          error={Boolean(errors.parking)}
          helperText={errors.parking as string}
          onChange={handleChange}
          {...getFields(t, 'parking')}
        />
      </Grid>


      {/* <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          name={'country'}
          InputLabelProps={{ shrink: true }}
          size={'small'}
          value={values.country}
          error={Boolean(errors.country)}
          helperText={errors.country as string}
          onChange={handleChange}
          {...getFields(t, 'country')}
        />
      </Grid> */}


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
        width: '40%',
        backgroundColor: 'white'
      },
    }}
  >
    <FormikContext.Provider value={formik}>
      <Box sx={{
          position: 'sticky',
          top: '0px',
          zIndex: 2,
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
        <Box sx={{ mt: 3, mb: 3, paddingBottom: '50px', height: 'calc(100vh - 178px)' }}>
          <Grid container spacing={2.5}>{form()}</Grid>
        </Box>
      </DialogContent>

      <Box sx={{
          position: 'sticky',
          bottom: '0px',
          width: '100%',
          zIndex: 2,
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
