/* eslint-disable import/extensions */
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// @mui
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Switch,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useSnackbar } from 'src/components/snackbar';
import DropdownAutocomplete from 'src/components/autocomplete/DropdownAutocomplete.tsx';

import { useLocales } from 'src/locales';

import { AppDispatch, useTypedSelector } from '../../utils/store.tsx';
import {
  getCities,
  escapeChars,
} from '../../utils/utils.tsx';

import slice, {
  name as sliceName,
  getFields,
  useFormik,
  formSchema,
  initialValues,
  prepareForm,
  prepareData,
} from './slice.tsx';

// ----------------------------------------------------------------------

export default function BuildingEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { t } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading, details } = useTypedSelector((state: any) => state[sliceName]);

  const formik = useFormik({
    initialValues,
    validationSchema: formSchema(t, Number(id)),
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: (values: any) => onSubmit(values),
  });

  const {
    values,
    errors,
    setErrors,
    resetForm,
    handleChange,
    setFieldValue,
    handleSubmit,
    resetSubmitted,
  }: any = formik;

  useEffect(() => {
    if (id) {
      dispatch(
        slice.callDetailsApi(Number(id), (state: boolean, data: any, message: string) => {
          if (!state && message) {
            enqueueSnackbar(message, { variant: 'error' });
          }
        })
      );
    }

    return () => {
      dispatch(slice.resetSlice());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (details) {
      dispatch(slice.setLoading(true));

      const form = prepareForm(details, initialValues);

      resetSubmitted();
      resetForm({ values: form });

      setTimeout(() => {
        setErrors({});
      }, 0);

      dispatch(slice.setLoading(false));
    }
  }, [details]);

  const onSubmit = (formValues: any) => {
    const data = prepareData(formValues, Number(id));

    dispatch(
      slice.callUpdateApi(data, (state: boolean, responseData: any, message: string) => {
        if (state) {
          if (message && message !== '') {
            enqueueSnackbar(message, { variant: 'success' });
          }

          navigate(`/building/${id}`);
        } else if (message && message !== '') {
          enqueueSnackbar(message, { variant: 'error' });
        }
      })
    );
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4">
            Edit building
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Building #{id}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => navigate(`/building/${id}`)}
        >
          Back to details
        </Button>
      </Stack>

      <Card sx={{ p: 3 }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              size="small"
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
                labelField="name"
                label={getFields(t, 'city').label}
                options={getCities()}
                value={values.city}
                onChange={(e: any, value: any) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setFieldValue('city', value?.name || '');
                }}
                onInputChange={(e: any, value: any) => {}}
                error={Boolean(errors.city)}
              />

              <FormHelperText>{errors.city as string}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="address"
              InputLabelProps={{ shrink: true }}
              size="small"
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
              name="units_number"
              InputLabelProps={{ shrink: true }}
              size="small"
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
              name="pib"
              InputLabelProps={{ shrink: true }}
              size="small"
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
              name="registration_number"
              InputLabelProps={{ shrink: true }}
              size="small"
              value={values.registration_number}
              error={Boolean(errors.registration_number)}
              helperText={errors.registration_number as string}
              onChange={handleChange}
              {...getFields(t, 'registration_number')}
            />
          </Grid>

          {/* <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="bank_account"
              InputLabelProps={{ shrink: true }}
              size="small"
              value={values.bank_account}
              error={Boolean(errors.bank_account)}
              helperText={errors.bank_account as string}
              onChange={handleChange}
              {...getFields(t, 'bank_account')}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="bank_ammount"
              InputLabelProps={{ shrink: true }}
              size="small"
              value={values.bank_ammount}
              error={Boolean(errors.bank_ammount)}
              helperText={errors.bank_ammount as string}
              onChange={handleChange}
              {...getFields(t, 'bank_ammount')}
            />
          </Grid> */}

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="area"
              InputLabelProps={{ shrink: true }}
              size="small"
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
              name="year_of_construction"
              InputLabelProps={{ shrink: true }}
              size="small"
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
              name="number_of_floors"
              InputLabelProps={{ shrink: true }}
              size="small"
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
              name="number_of_elevators"
              InputLabelProps={{ shrink: true }}
              size="small"
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
              name="roof_type"
              InputLabelProps={{ shrink: true }}
              size="small"
              value={values.roof_type}
              error={Boolean(errors.roof_type)}
              helperText={errors.roof_type as string}
              onChange={handleChange}
              {...getFields(t, 'roof_type')}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              name="description"
              InputLabelProps={{ shrink: true }}
              size="small"
              value={values.description}
              error={Boolean(errors.description)}
              helperText={errors.description as string}
              onChange={handleChange}
              {...getFields(t, 'description')}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(values.lightning_rod)}
                  onChange={(e: any) => {
                    setFieldValue('lightning_rod', e.target.checked);
                  }}
                />
              }
              label={getFields(t, 'lightning_rod').label}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(values.shelter)}
                  onChange={(e: any) => {
                    setFieldValue('shelter', e.target.checked);
                  }}
                />
              }
              label={getFields(t, 'shelter').label}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(values.remote_heating)}
                  onChange={(e: any) => {
                    setFieldValue('remote_heating', e.target.checked);
                  }}
                />
              }
              label={getFields(t, 'remote_heating').label}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(values.parking)}
                  onChange={(e: any) => {
                    setFieldValue('parking', e.target.checked);
                  }}
                />
              }
              label={getFields(t, 'parking').label}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(values.is_active)}
                  onChange={(e: any) => {
                    setFieldValue('is_active', e.target.checked);
                  }}
                />
              }
              label={getFields(t, 'is_active').label}
            />
          </Grid>
        </Grid>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
          sx={{ mt: 3 }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate(`/building/${id}`)}
          >
            Cancel
          </Button>

          <LoadingButton
            variant="contained"
            loading={isLoading}
            onClick={() => {
              handleSubmit();
            }}
          >
            Save
          </LoadingButton>
        </Stack>
      </Card>
    </Box>
  );
}