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
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocales } from 'src/locales';

import axiosInstance from 'src/utils/axios';
import DropdownAutocomplete from 'src/components/autocomplete/DropdownAutocomplete.tsx';
import { getUnitTypes } from '../../../utils/utils.tsx';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

// ----------------------------------------------------------------------

const initialValues = {
  name: '',
  unit_type: null,
  unit_number: '',
  floor: '',
  area: '',
  description: '',
  owner: '',
  tenant: '',
  user: null,
  is_active: true,
};

// ----------------------------------------------------------------------

const formSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .max(255, 'Name cannot be longer than 255 characters'),

  unit_type: Yup.object()
    .nullable()
    .required('Unit type is required'),

  unit_number: Yup.string()
    .nullable()
    .max(255, 'Unit number cannot be longer than 255 characters'),

  floor: Yup.string().nullable(),

  area: Yup.string().nullable(),

  owner: Yup.string()
    .nullable()
    .max(255, 'Owner cannot be longer than 255 characters'),

  tenant: Yup.string()
    .nullable()
    .max(255, 'Tenant cannot be longer than 255 characters'),

  description: Yup.string().nullable(),

  user: Yup.object().nullable(),

  is_active: Yup.boolean(),
});

// ----------------------------------------------------------------------

export default function BuildingUnitCreatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLocales();

  const [userOptions, setUserOptions] = React.useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const searchUsers = async (e: any, search: string) => {
    if(search.length < 3){
      setUserOptions([]);
      return;
    }

    try {
      setLoadingUsers(true);

      const response = await axiosInstance.get('/user/all', {
        params: {
          search,
        },
      });

      setUserOptions(response.data.data ?? []);
    } catch (error) {
      console.error('Unable to load users:', error);
      setUserOptions([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      let data = {
        name: values.name,
        unit_type: values.unit_type?.id || null,
        unit_number: values.unit_number || null,
        building_id: Number(id),
        is_active: values.is_active,
        floor: values.floor || null,
        area: values.area || null,
        description: values.description || null,
        owner: values.owner || null,
        tenant: values.tenant || null,
        user_id: values.user?.id || null,
      };

      await axiosInstance.post(`/building/${id}/unit`, data);

      navigate(`/building/${id}`);
    } catch (error) {
      console.error('Unable to save unit:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: formSchema,
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: (values: any) => onSubmit(values),
  });

  const {
    values,
    errors,
    handleChange,
    setFieldValue,
    handleSubmit,
  }: any = formik;

  const form = () => {
    return (
      <React.Fragment>
        <Grid item xs={12}>
          <TextField
            fullWidth
            autoFocus
            name="name"
            label={t('building.details.unit_name')}
            value={values.name}
            error={Boolean(errors.name)}
            helperText={errors.name as string}
            onChange={handleChange}
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
          <TextField
            fullWidth
            name="unit_number"
            label={t('building.details.unit_number')}
            value={values.unit_number}
            error={Boolean(errors.unit_number)}
            helperText={errors.unit_number as string}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="floor"
            label={t('building.details.floor')}
            value={values.floor}
            error={Boolean(errors.floor)}
            helperText={errors.floor as string}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="area"
            label={t('building.details.area')}
            value={values.area}
            error={Boolean(errors.area)}
            helperText={errors.area as string}
            onChange={handleChange}
            inputProps={{
              min: 0,
              step: 0.01,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="owner"
            label={t('building.details.owner')}
            value={values.owner}
            error={Boolean(errors.owner)}
            helperText={errors.owner as string}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="tenant"
            label={t('building.details.tenant')}
            value={values.tenant}
            error={Boolean(errors.tenant)}
            helperText={errors.tenant as string}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(errors.user)}
          >
            <DropdownAutocomplete
              freeSolo={false}
              multiple={false}
              disableClearable={false}
              labelField="name"
              label={t('building.details.associated_user')}
              options={userOptions}
              value={values.user}
              onChange={(e: any, value: any) => {
                e.preventDefault();
                e.stopPropagation();

                setFieldValue('user', value);
              }}
              onInputChange={searchUsers}
              error={Boolean(errors.user)}
            />

            <FormHelperText>
              {errors.user as string}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            name="description"
            label={t('building.details.description')}
            value={values.description}
            error={Boolean(errors.description)}
            helperText={errors.description as string}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            label={t('building.details.active')}
            control={
              <Switch
                checked={values.is_active}
                onChange={(e: any) => {
                  setFieldValue('is_active', e.target.checked);
                }}
              />
            }
          />
        </Grid>
      </React.Fragment>
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
            {t('building.details.add_unit')}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Building #{id}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          disabled={submitting}
          onClick={() => {
            navigate(`/building/${id}`);
          }}
        >
          {t('building.details.back_to_list')}
        </Button>
      </Stack>

      <Card sx={{ p: 3 }}>
        <Grid container spacing={2.5}>
          {form()}

          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                disabled={submitting || loadingUsers}
                onClick={() => {
                  handleSubmit();
                }}
              >
                {t('building.details.save')}
              </Button>

              <Button
                variant="outlined"
                disabled={submitting}
                onClick={() => {
                  navigate(`/building/${id}`);
                }}
              >
                {t('building.details.cancel')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}