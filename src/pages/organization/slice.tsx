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

import axios from '../../utils/axios.jsx';
import Yup from '../../utils/yup.tsx';
import { isNumeric } from '../../utils/utils.tsx';
import { RoleType, ManagerType, UnitType, OrganizationType } from '../../utils/enums.tsx';


export const API = 'organization';
export const LANGUAGE = 'organization';
export const name = LANGUAGE + 'Slice';
export const pageRoles = [RoleType.SuperAdmin, RoleType.OrganizationAdmin, RoleType.Manager, RoleType.Accountant, RoleType.Worker];


export const getFields = (t: any, field: string) => {
  let fields: any = [
    {
      id: 'name',
      name: 'name',
      label: t(LANGUAGE + '.table.name'),
      placeholder: '',
    },
    {
      id: 'city',
      name: 'city',
      label: t(LANGUAGE + '.table.city'),
      placeholder: '',
    },
    {
      id: 'address',
      name: 'address',
      label: t(LANGUAGE + '.table.address'),
      placeholder: '',
    },
    {
      id: 'pib',
      name: 'pib',
      label: t(LANGUAGE + '.table.pib'),
      labelTable: t(LANGUAGE + '.table.pib'),
      placeholder: '',
    },
    {
      id: 'registration_number',
      name: 'registration_number',
      label: t(LANGUAGE + '.table.registration_number'),
      labelTable: t(LANGUAGE + '.table.mb'),
      placeholder: '',
    },
    {
      id: 'bank_account',
      name: 'bank_account',
      label: t(LANGUAGE + '.table.bank_account'),
      placeholder: '',
    },
      {
      id: 'responsible_person',
      name: 'responsible_person',
      label: t(LANGUAGE + '.table.responsible_person'),
      placeholder: '',
    },
    {
      id: 'description',
      name: 'description',
      label: t(LANGUAGE + '.table.description'),
      placeholder: '',
    },    
    {
      id: 'type',
      name: 'type',
      label: t(LANGUAGE + '.table.type'),
      placeholder: '',
    },
    {
      id: 'is_active',
      name: 'is_active',
      label: t(LANGUAGE + '.table.is_active'),
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
    { ...getFields(t, 'address') },
    { ...getFields(t, 'city') },
  ];
}

export const formSchema = (t: any, id: number|null = null) => {
  return Yup.object().shape({
    name: Yup.string().required().label(getFields(t, 'name')?.label),
    city: Yup.string().required().label(getFields(t, 'city')?.label),
    address: Yup.string().required().label(getFields(t, 'address')?.label),
    description: Yup.string().max(255).label(getFields(t, 'description')?.label),
    registration_number: Yup.string().max(255).label(getFields(t, 'registration_number')?.label),
    bank_account: Yup.string().max(255).label(getFields(t, 'bank_account')?.label),
    pib: Yup.string().max(255).label(getFields(t, 'pib')?.label),
    responsible_person: Yup.string().max(255).label(getFields(t, 'responsible_person')?.label),
    type: Yup.string().max(255).label(getFields(t, 'type')?.label),
    is_active: Yup.boolean(),
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
    data['name'] = form?.name || '';
    data['city'] = form?.city || '';
    data['address'] = form?.address || '';
    data['description'] = form?.description || '';
    data['registration_number'] = form?.registration_number || '';
    data['bank_account'] = form?.bank_account || '';
    data['pib'] = form?.pib || '';
    data['responsible_person'] = form?.responsible_person || '';
    data['type'] = form?.type || '';

    data['is_active'] = form?.is_active || false;
  }

  return data;
};
export const prepareData = (values: any = null, id: number|null) => {
  let data: any = {};

  if(values){
    data['name'] = values?.name || '';
    data['city'] = values?.city || '';
    data['address'] = values?.address || '';
    data['description'] = values?.description || '';
    data['registration_number'] = values?.registration_number || '';
    data['bank_account'] = values?.bank_account || '';
    data['pib'] = values?.pib || '';
    data['responsible_person'] = values?.responsible_person || '';
    data['type'] = values?.type || '';

    data['is_active'] = values?.is_active || false;

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
  name: string,
  city: string,
  address: string,
  pib: string,
  registration_number: string,
  bank_account: string,
  description: string,
  responsible_person: string,
  type: string,
  is_active: boolean,
};
export const initialValues: initialValuesStruct = {
  name: '',
  city: '',
  address: '',
  pib: '',
  registration_number: '',
  bank_account: '',
  description: '',
  responsible_person: '',
  type: '',
  is_active: true,
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
          console.log('ORGANIZATION FULL RESPONSE:', result);
  console.log('ORGANIZATION RESULT DATA:', result.data);

  const { data, message } = result.data;

  console.log('ORGANIZATION EXTRACTED DATA:', data);

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
