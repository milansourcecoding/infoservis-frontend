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
import { getBillingTypes, getUnitTypes } from '../../../utils/utils.tsx';

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
  account_number: '',
  description: '',
  account_holder_name: '',
  bank_name: '',
  balance: 0,
  currency: 'RSD',
  iban: '',
  swift_code: '',
};

// ----------------------------------------------------------------------

const formSchema = Yup.object().shape({
  account_number: Yup.string()
    .required('Account number is required')
    .max(255, 'Account number cannot be longer than 255 characters'),

  description: Yup.string().nullable(),

  account_holder_name: Yup.string().nullable(),

  bank_name: Yup.string().nullable(),

  balance: Yup.number().nullable(),

  currency: Yup.string().nullable(),

  iban: Yup.string().nullable(),

  swift_code: Yup.string().nullable(),
});

// ----------------------------------------------------------------------

export default function BuildingBankAccountCreatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLocales();
  const [submitting, setSubmitting] = React.useState(false);


  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      let data = {
        account_number: values.account_number,
        building_id: Number(id),
        account_holder_name: values.account_holder_name || null,
        bank_name: values.bank_name|| null,
        balance: values.balance || null,
        currency: values.currency || null,
        iban: values.iban || null,
        swift_code: values.swift_code || null,
        description: values.description || null,
      };

      await axiosInstance.post(`/building/${id}/bank-account`, data);

      navigate(`/building/${id}`);
    } catch (error) {
      console.error('Unable to save bank account:', error);
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
            name="account_number"
            label={t('bankAccount.details.account_number')}
            value={values.account_number}
            error={Boolean(errors.account_number)}
            helperText={errors.account_number as string}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            rows={4}
            name="account_holder_name"
            label={t('bankAccount.details.account_holder_name')}
            value={values.account_holder_name}
            error={Boolean(errors.account_holder_name)}
            helperText={errors.account_holder_name as string}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            rows={4}
            name="bank_name"
            label={t('bankAccount.details.bank_name')}
            value={values.bank_name}
            error={Boolean(errors.bank_name)}
            helperText={errors.bank_name as string}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            rows={4}
            name="balance"
            label={t('bankAccount.details.balance')}
            value={values.balance}
            error={Boolean(errors.balance)}
            helperText={errors.balance as string}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            rows={4}
            name="currency"
            label={t('bankAccount.details.currency')}
            value={values.currency}
            error={Boolean(errors.currency)}
            helperText={errors.currency as string}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            rows={4}
            name="iban"
            label={t('bankAccount.details.iban')}
            value={values.iban}
            error={Boolean(errors.iban)}
            helperText={errors.iban as string}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            rows={4}
            name="swift_code"
            label={t('bankAccount.details.swift_code')}
            value={values.swift_code}
            error={Boolean(errors.swift_code)}
            helperText={errors.swift_code as string}
            onChange={handleChange}
          />
        </Grid>

  
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            name="description"
            label={t('billableService.details.description')}
            value={values.description}
            error={Boolean(errors.description)}
            helperText={errors.description as string}
            onChange={handleChange}
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
            {t('building.details.add_bank_account')}
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
                  activeTab: 'bank_accounts',
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
                disabled={submitting}
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
                        activeTab: 'bank_accounts',
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