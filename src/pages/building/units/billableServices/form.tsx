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
import { AppDispatch, useTypedSelector } from '../../../../utils/store.tsx';
import slice, { name as sliceName, getFields, useFormik, FormikContext, formSchema, initialValues, prepareForm, prepareData } from './slice.tsx';
// import selectAutocompleteSlice from '../../components/autocomplete/selectAutocompleteSlice.tsx';

import { getCities, escapeChars, getBillingTypes, getUnitTypes  } from '../../../../utils/utils.tsx';
// import {  } from '../../utils/enums.tsx';

// ----------------------------------------------------------------------

export default function Form(props: any) {
  const { t } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, show, details, id } = useTypedSelector((state: any) => state[sliceName]);


  React.useEffect(() => {
    return () => {
      dispatch(slice.resetSlice());
    }
  }, [dispatch]);

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
   // dispatch(slice.resetSlice());
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
          <FormControl
            fullWidth
            error={Boolean(errors.unit_type)}
          >
            <DropdownAutocomplete
              freeSolo={false}
              multiple={false}
              disableClearable
              label={t('building.details.unit_type')}
              options={getUnitTypes()}
              value={values.unit_type}
              onChange={(e: any, value: any) => {
                e.preventDefault();
                e.stopPropagation();

                setFieldValue('unit_type', value);
              }}
              onInputChange={(e: any, value: any) => {}}
              error={Boolean(errors.unit_type)}
            />

            <FormHelperText>
              {errors.unit_type as string}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl
            fullWidth
            error={Boolean(errors.billing_type)}
          >
            <DropdownAutocomplete
              freeSolo={false}
              multiple={false}
              disableClearable
              label={t('building.details.billing_type')}
              options={getBillingTypes()}
              value={values.billing_type}
              onChange={(e: any, value: any) => {
                e.preventDefault();
                e.stopPropagation();

                setFieldValue('billing_type', value);
              }}
              onInputChange={(e: any, value: any) => {}}
              error={Boolean(errors.billing_type)}
            />

            <FormHelperText>
              {errors.billing_type as string}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          autoFocus
          value={values.quantity}
          error={Boolean(errors.quantity)}
          helperText={errors.quantity as string}
          onChange={handleChange}
          onKeyDown={escapeChars}
          {...getFields(t, 'quantity')}
        />
      </Grid>
            <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          autoFocus
          value={values.price}
          error={Boolean(errors.price)}
          helperText={errors.price as string}
          onChange={handleChange}
          onKeyDown={escapeChars}
          {...getFields(t, 'price')}
        />
      </Grid>
            <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          autoFocus
          value={values.start_date}
          error={Boolean(errors.start_date)}
          helperText={errors.start_date as string}
          onChange={handleChange}
          onKeyDown={escapeChars}
          {...getFields(t, 'start_date')}
        />
      </Grid>
            <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          autoFocus
          value={values.end_date}
          error={Boolean(errors.end_date)}
          helperText={errors.end_date as string}
          onChange={handleChange}
          onKeyDown={escapeChars}
          {...getFields(t, 'end_date')}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          multiline
          rows={3}
          value={values.description}
          error={Boolean(errors.description)}
          helperText={errors.description as string}
          onChange={handleChange}
          {...getFields(t, 'description')}
        />
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
        width: {
          xs: '100%',
          md: '40%',
        },
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
