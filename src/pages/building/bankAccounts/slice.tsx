/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
/* eslint-disable import/extensions */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable arrow-body-style */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-loop-func */
/* eslint-disable eqeqeq */
import React, { createContext, useContext } from 'react';
import { useFormik as useFormikOriginal } from 'formik';
import _ from 'lodash';

import {
  Grid,
  ListItemText,
} from '@mui/material';

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { da } from 'date-fns/locale';
import axios from '../../../utils/axios.jsx';
import Yup from '../../../utils/yup.tsx';
import { isNumeric, getUnitTypes, getBillingTypes, } from '../../../utils/utils.tsx';
import { RoleType, ManagerType, UnitType, BillingType } from '../../../utils/enums.tsx';



export const API = 'bank-account';
export const LANGUAGE = 'bankAccount';
export const name = LANGUAGE + 'Slice';
export const pageRoles = [RoleType.SuperAdmin, RoleType.OrganizationAdmin, RoleType.Manager, RoleType.Accountant, RoleType.Worker];


export const getFields = (t: any, field: string) => {
  let fields: any = [
    {
      id: 'account_number',
      name: 'account_number',
      label: t(LANGUAGE + '.table.account_number'),
      placeholder: '',
    },
    {
      id: 'account_holder_name',
      name: 'account_holder_name',
      label: t(LANGUAGE + '.table.account_holder_name'),
      placeholder: '',
    },

    {
      id: 'bank_name',
      name: 'bank_name',
      label: t(LANGUAGE + '.table.bank_name'),
      placeholder: '',
    },

    {
      id: 'balance',
      name: 'balance',
      label: t(LANGUAGE + '.table.balance'),
      placeholder: '',
    },

    {
      id: 'currency',
      name: 'currency',
      label: t(LANGUAGE + '.table.currency'),
      placeholder: '',
    },

    {
      id: 'iban',
      name: 'iban',
      label: t(LANGUAGE + '.table.iban'),
      placeholder: '',
    },

    {
      id: 'swift_code',
      name: 'swift_code',
      label: t(LANGUAGE + '.table.swift_code'),
      placeholder: '',
    },
    {
      id: 'description',
      name: 'description',
      label: t(LANGUAGE + '.table.description'),
      placeholder: '',
    },
  ];

  return fields.find((x: any) => x.id === field);
}

export const getFilterOptions = (t: any) => {
  return [
    {
      id: 'all',
      name: 'all',
      label: t('status.all'),
      placeholder: '',
    },
    { ...getFields(t, 'name') },
  ];
}

export const formSchema = (t: any, id: number|null = null) => {
  return Yup.object().shape({
    account_number: Yup.string().required().label(getFields(t, 'account_number')?.label),
    account_holder_name: Yup.string().nullable().label(getFields(t, 'account_holder_name')?.label),
    bank_name: Yup.string().nullable().label(getFields(t, 'bank_name')?.label),
    accounbalancet_holder_name: Yup.string().nullable().label(getFields(t, 'balance')?.label),
    currency: Yup.string().nullable().label(getFields(t, 'currency')?.label),
    iban: Yup.string().nullable().label(getFields(t, 'iban')?.label),
    swift_code: Yup.string().nullable().label(getFields(t, 'swift_code')?.label),
    description: Yup.string().max(255).label(getFields(t, 'description')?.label),
  })
}


let formikContext: any = null;
export const formikInstance = { current: null as any };
export const FormikContext = createContext<any>(null);
export const useFormikContext = () => {
    formikContext = useContext(FormikContext);
    if (!formikContext) {
      throw new Error('useFormikContext must be used within a FormikProvider');
    }
    return formikContext;
};
export const useFormik = (props: any) => {
  const [submitted, setSubmitted] = React.useState(false);

  const formik = useFormikOriginal({ ...props, validateOnChange: submitted });
  formikInstance.current = formik;

  React.useEffect(() => {
    if (formik.submitCount > 0) {
      setSubmitted(true);
    }
  }, [formik.submitCount]);

  React.useEffect(() => {
    if (formik.submitCount <= 0) {
      if(props && props.onChangeBeforeSubmit){
        props.onChangeBeforeSubmit();
      }
    }
  }, [formik.values]);

  const resetSubmitted = React.useCallback(() => {
    setSubmitted(false);
  }, []);

  const setSubmittedManually = React.useCallback((value: boolean) => {
    setSubmitted(value);
  }, []);

  return {
    ...formik,
    submitted,
    resetSubmitted,
    setSubmitted: setSubmittedManually,
  };
};


export const prepareForm = (values: any = null, defValues: any = null) => {
  let form = _.cloneDeep(values);
  let data = _.cloneDeep(defValues);

  if(data && form){
    data['account_number'] = form?.account_number || '';
    data['description'] = form?.description || '';
    data['account_holder_name'] = form?.account_holder_name || '';
    data['bank_name'] = form?.bank_name || '';
    data['balance'] = form?.balance || 0;
    data['currency'] = form?.currency || 'RSD';
    data['iban'] = form?.iban || '';
    data['swift_code'] = form?.swift_code || '';
  }

  return data;
};

export const prepareData = (values: any = null, id: number|null) => {
  let data: any = {};

  if(values){
    data['account_number'] = values?.account_number || '';
    data['description'] = values?.description || '';
    data['account_holder_name'] = values?.account_holder_name || '';
    data['bank_name'] = values?.bank_name || '';
    data['balance'] = values?.balance || 0;
    data['currency'] = values?.currency || 'RSD';
    data['iban'] = values?.iban || '';
    data['swift_code'] = values?.swift_code || '';

    if (isNumeric(id)) {
      data['id'] = id;
    }
  }

  return data;
};

export const renderField = (label: string, value: any, options: { xs: number, sm: number, md: number } = { xs: 12, sm: 6, md: 4 }) => (
  <Grid item xs={options?.xs} sm={options?.sm} md={options?.md}>
    <ListItemText
      primary={value || '-'}
      secondary={label}
      primaryTypographyProps={{ typography: 'body2' }}
      secondaryTypographyProps={{
        component: 'span',
        typography: 'caption',
        color: 'text.disabled',
      }}
    />
  </Grid>
);


export interface initialValuesStruct {
    account_number: string,
    description: string|null,
    account_holder_name: string|null,
    bank_name: string|null,
    balance: number|null,
    currency: string|null,
    iban: string|null,
    swift_code: string|null,
};
export const initialValues: initialValuesStruct = {
  account_number: '',
  description: '',
  account_holder_name: '',
  bank_name: '',
  balance: 0,
  currency: 'RSD',
  iban: '',
  swift_code: '',
};


interface InitState {
  isLoading: boolean,
  show: boolean,
  id: number|null,
  payload: any,
  details: any,
  items: Array<any>,
}

function NewReducer() {
  const initialState: InitState = {
    isLoading: false,
    show: false,
    id: null,
    payload: null,
    details: null,
    items: [],
  };


  const reducers = {
    resetSlice: () => {
      return initialState;
    },
    setLoading: (state: InitState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setShow: (state: InitState, action: PayloadAction<{ show: boolean, id: number|null, payload: any }>) => {
      state.id = action.payload.id;
      state.payload = action.payload.payload;
      state.show = action.payload.show;
    },

    startRead: (state: InitState) => {
      state.isLoading = true;
      state.items = [];
    },
    finishRead: (state: InitState, action: PayloadAction<any>) => {
      let data = (action.payload && action.payload.data && action.payload.data.length > 0) ? action.payload.data : [];
      state.items = data;
      state.isLoading = false;
    },

    startDetails: (state: InitState) => {
      state.isLoading = true;
    },
    finishDetails: (state: InitState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.details = action.payload;
    },

    start: (state: InitState) => {
      state.isLoading = true;
    },
    finish: (state: InitState, action: PayloadAction<any>) => {
      state.isLoading = false;
    },
  };


  const apis = {
    callReadApi: (params: any, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any) => {
      dispatch(actions.startRead());

      await axios.get(API, { params: params }).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, message);
        dispatch(actions.finishRead(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finishRead(null));
      });
    },

    callDetailsApi: (id: number|null, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any) => {
      dispatch(actions.startDetails());

      await axios.get(API + '/' + id).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, '');
        dispatch(actions.finishDetails(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finishDetails(null));
      });
    },

    callCreateApi: (params: any, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any) => {
      dispatch(actions.start());

      await axios.post(API, params).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, message);
        dispatch(actions.finish(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finish(null));
      });
    },

    callUpdateApi: (params: any, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any) => {
      dispatch(actions.start());

      await axios.put(API + '/' + params?.id, params).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, message);
        dispatch(actions.finish(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finish(null));
      });
    },

    callDeleteApi: (params: any, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any) => {
      dispatch(actions.start());

      await axios.delete(API + '/' + params?.id, { data: params }).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, message);
        dispatch(actions.finish(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finish(null));
      });
    },
  };


  const { reducer, actions } = createSlice({
    name,
    initialState,
    reducers,
  });


  return {
    reducer,
    ...actions,
    ...apis,
  };
}


export default NewReducer();
