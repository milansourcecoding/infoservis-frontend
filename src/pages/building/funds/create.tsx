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
import { getBillingTypes, getUnitTypes} from '../../../utils/utils.tsx';
import { AppDispatch, useTypedSelector } from '../../../utils/store.tsx';

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

import DatePicker from 'src/components/datePicker/DatePicker.tsx';


// ----------------------------------------------------------------------
const unitTypeOptions = getUnitTypes();
const billingTypeOptions = getBillingTypes();
const initialValues = {
  name: '',
  description: '',
  start_date: null,
  end_date: null,
  is_active: true,
  amount: 0
};

// ----------------------------------------------------------------------

const formSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .max(255, 'Name cannot be longer than 255 characters'),

  description: Yup.string().nullable(),

  amount: Yup.number()
    .nullable(),

  start_date: Yup.date().nullable(),
  end_date: Yup.date().nullable(),
  is_active: Yup.boolean(),
});

// ----------------------------------------------------------------------

export default function BuildingFundCreatePage() {
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
        building_id: Number(id),
        is_active: values.is_active,
        description: values.description || null,
        amount: values.amount || null,
        start_date: values.start_date || null,
        end_date: values.end_date || null,
      };

      await axiosInstance.post(`/building/${id}/fund`, data);

      navigate(`/building/${id}`);
    } catch (error) {
      console.error('Unable to save fund:', error);
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
            label={t('fund.details.name')}
            value={values.name}
            error={Boolean(errors.name)}
            helperText={errors.name as string}
            onChange={handleChange}
          />
        </Grid>



        <Grid item xs={12} md={6}>
          <DatePicker
            label={t('fund.details.start_date')}
            value={values.start_date}
            onChange={(date) => {
              setFieldValue(
                'start_date',
                date ? date.format('YYYY-MM-DD') : null
              );
            }}
          />

          {errors.start_date && (
            <FormHelperText error>
              {errors.start_date as string}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <DatePicker
            label={t('fund.details.end_date')}
            value={values.end_date}
            minDate={values.start_date}
            onChange={(date) => {
              setFieldValue(
                'end_date',
                date ? date.format('YYYY-MM-DD') : null
              );
            }}
          />

          {errors.end_date && (
            <FormHelperText error>
              {errors.end_date as string}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            rows={4}
            name="amount"
            label={t('fund.details.amount')}
            value={values.amount}
            error={Boolean(errors.amount)}
            helperText={errors.amount as string}
            onChange={handleChange}
          />
        </Grid>
  
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            name="description"
            label={t('fund.details.description')}
            value={values.description}
            error={Boolean(errors.description)}
            helperText={errors.description as string}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            label={t('fund.details.active')}
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
            {t('building.details.add_fund')}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Building #{id}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          disabled={submitting}
          onClick={() => {
            navigate(
              `/building/${id}`,
              {
                state: {
                  activeTab: 'funds',
                },
              }
            );
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
                  navigate(
                    `/building/${id}`,
                    {
                      state: {
                        activeTab: 'funds',
                      },
                    }
                  );
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