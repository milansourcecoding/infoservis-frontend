/* eslint-disable react/jsx-boolean-value */
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


import { useLocales } from 'src/locales';

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
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { createRow, updateRow } from '../../utils/utils.tsx';
import { StatusDokumenta } from '../../utils/enums.tsx';

// components
import { useSnackbar } from 'src/components/snackbar';
import Block from 'src/components/block/block';
import SelectAutocomplete from 'src/components/autocomplete/SelectAutocomplete.tsx';

// Redux
import { useDispatch } from 'react-redux';
import { RootState, AppDispatch, useTypedSelector } from '../../utils/store.tsx';
import slice, { API, getFields, FormikContext, formSchema, initialValues, prepareForm, prepareData, preparePayloadForm } from './reduxSlice.tsx';
import listSlice from '../../utils/slice/form/listSlice.tsx';
import selectAutocompleteSlice from '../../components/autocomplete/selectAutocompleteSlice.tsx';

// ----------------------------------------------------------------------

export default function Form(props: any) {
  const { t } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch<AppDispatch>();
  const { rows, total, searchQuery } = useTypedSelector((state: RootState) => state.listSlice);
  const { isLoading, show, details, id, payload } = useTypedSelector((state: any) => state[API + 'ReduxSlice']);


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
        dispatch(listSlice.calGetDefaultApi('kategorija', (option: any) => {
          dispatch(selectAutocompleteSlice.setOptions([option]));
          setFieldValue('kategorija', option);
          setFieldValue('kategorija_id', option ? option.id : null);

          setTimeout(() => {
            setErrors({});
          }, 0);
        }));
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
    dispatch(slice.setLoading(false));
  }, [details]);

  React.useEffect(() => {
    dispatch(slice.setLoading(true));
    let form = preparePayloadForm(payload, initialValues);
    setValues(form);
    dispatch(slice.setLoading(false));
  }, [payload]);


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: formSchema(t),
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

          if(!payload){
            const newRows: any = createRow(rows, data);
            const newTotal = (total + 1)

            dispatch(listSlice.changeRows(newRows));
            dispatch(listSlice.changeTotal(newTotal));
            dispatch(listSlice.calStatsApi(API, searchQuery));
          }

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
      {id && <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          disabled
          value={values.brojDokumenta}
          error={Boolean(errors.brojDokumenta)}
          helperText={errors.brojDokumenta as string}
          onChange={handleChange}
          {...getFields(t, 'brojDokumenta')}
        />
      </Grid>}

      <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          autoFocus
          multiline
          rows={3}
          value={values.napomena}
          error={Boolean(errors.napomena)}
          helperText={errors.napomena as string}
          onChange={handleChange}
          {...getFields(t, 'napomena')}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth error={Boolean(errors.lift_id)}>
          <SelectAutocomplete
            error={Boolean(errors.lift_id)}
            freeSolo={false}
            path={'lift'}
            params={{
              currentPage: 1,
              pageSize: 10,
              searchQuery: null,
              isActive: 1,
              sortColumn: null,
              sortDir: null,
            }}
            value={values.lift}
            onChange={(e, value) => {
              e.preventDefault();
              e.stopPropagation();

              setFieldValue('lift', value);
              setFieldValue('lift_id', value ? value.id : null);
            }}
            onInputChange={(e, value) => {

            }}
            {...getFields(t, 'lift_id')}
          />
          <FormHelperText>{errors.lift_id as string}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth error={Boolean(errors.kategorija_id)}>
          <SelectAutocomplete
            error={Boolean(errors.kategorija_id)}
            freeSolo={false}
            path={'kategorija'}
            params={{
              currentPage: 1,
              pageSize: 10,
              searchQuery: null,
              isActive: 1,
              sortColumn: null,
              sortDir: null,
            }}
            value={values.kategorija}
            onChange={(e, value) => {
              e.preventDefault();
              e.stopPropagation();

              setFieldValue('kategorija', value);
              setFieldValue('kategorija_id', value ? value.id : null);
            }}
            onInputChange={(e, value) => {

            }}
            {...getFields(t, 'kategorija_id')}
          />
          <FormHelperText>{errors.kategorija_id as string}</FormHelperText>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          type={'number'}
          value={values.brojRadnihSatiPoRadniku}
          error={Boolean(errors.brojRadnihSatiPoRadniku)}
          helperText={errors.brojRadnihSatiPoRadniku as string}
          onChange={handleChange}
          {...getFields(t, 'brojRadnihSatiPoRadniku')}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          InputLabelProps={{ shrink: true }}
          size={'small'}
          type={'number'}
          value={values.cenaRadnogSataIzUgovora}
          error={Boolean(errors.cenaRadnogSataIzUgovora)}
          helperText={errors.cenaRadnogSataIzUgovora as string}
          onChange={handleChange}
          {...getFields(t, 'cenaRadnogSataIzUgovora')}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth error={Boolean(errors.radnici_ids)}>
          <SelectAutocomplete
            error={Boolean(errors.radnici_ids)}
            freeSolo={false}
            multiple={true}
            labelField={'imePrezime'}
            path={'radnik'}
            params={{
              currentPage: 1,
              pageSize: 10,
              searchQuery: null,
              isActive: 1,
              sortColumn: null,
              sortDir: null,
            }}
            value={values.radnici}
            onChange={(e, value) => {
              e.preventDefault();
              e.stopPropagation();

              setFieldValue('radnici', value);
              setFieldValue('radnici_ids', value.map((x: any) => x.id));
            }}
            onInputChange={(e, value) => {

            }}
            {...getFields(t, 'radnici_ids')}
          />
          <FormHelperText>{errors.radnici_ids as string}</FormHelperText>
        </FormControl>
      </Grid>

      {(values.status === StatusDokumenta.Storniran) && <Grid item xs={12}>
        <FormControl fullWidth error={Boolean(errors.status)}>
          <InputLabel>{getFields(t, 'status')?.label}</InputLabel>
          <Select
            value={values.status}
            onChange={(e) => {
              setFieldValue('status', e.target.value);
            }}
            size={'small'}
            {...getFields(t, 'status')}
          >
            <MenuItem value={StatusDokumenta.Storniran}>{t('enums.statusDokumenta.storniran')}</MenuItem>
            <MenuItem value={StatusDokumenta.Processing}>{t('enums.statusDokumenta.processing')}</MenuItem>
          </Select>
          <FormHelperText>{errors.status as string}</FormHelperText>
        </FormControl>
      </Grid>}
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
