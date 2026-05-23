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
import React, { createContext, useContext } from 'react';
import _ from 'lodash';


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import axios from '../../../utils/axios.jsx';
import Yup from '../../../utils/yup.tsx';
import { isNumeric } from '../../../utils/utils.tsx';
import { UserType, RadnikType } from '../../../utils/enums.tsx';


export const API = 'radnik';
export const LANGUAGE = API;
export const name = API + 'ReduxSlice';


export const getFields = (t: any, field: string) => {
  let fields: any = [
    {
      id: 'imePrezime',
      name: 'imePrezime',
      label: t(LANGUAGE + '.table.imePrezime'),
      placeholder: '',
    },
    {
      id: 'adresa',
      name: 'adresa',
      label: t(LANGUAGE + '.table.adresa'),
      placeholder: '',
    },
    {
      id: 'brojTelefona',
      name: 'brojTelefona',
      label: t(LANGUAGE + '.table.brojTelefona'),
      placeholder: '',
    },
    {
      id: 'email',
      name: 'email',
      label: t(LANGUAGE + '.table.email'),
      placeholder: '',
    },
    {
      id: 'password',
      name: 'password',
      label: t(LANGUAGE + '.table.password'),
      placeholder: '',
    },
    {
      id: 'grad',
      name: 'grad',
      label: t(LANGUAGE + '.table.grad'),
      placeholder: '',
    },
    {
      id: 'adresa',
      name: 'adresa',
      label: t(LANGUAGE + '.table.adresa'),
      placeholder: '',
    },
    {
      id: 'adresa',
      name: 'adresa',
      label: t(LANGUAGE + '.table.adresa'),
      placeholder: '',
    },
    {
      id: 'tip',
      name: 'tip',
      label: t(LANGUAGE + '.table.tip'),
      placeholder: '',
    },
    {
      id: 'isActive',
      name: 'isActive',
      label: t(LANGUAGE + '.table.isActive'),
      placeholder: '',
    },
  ];

  return fields.find((x: any) => x.id === field);
}

export const formSchema = (t: any, id: number|null = null) => {
  return Yup.object().shape({
    imePrezime: Yup.string().required().label(getFields(t, 'imePrezime')?.label),
    grad: Yup.string().required().label(getFields(t, 'grad')?.label),
    adresa: Yup.string().required().label(getFields(t, 'adresa')?.label),
    brojTelefona: Yup.string().required().label(getFields(t, 'brojTelefona')?.label),
    email: Yup.string().email().required().label(getFields(t, 'email')?.label),

    password: Yup.string().when(['email'], (email: any) => {
      return id
      ?
      Yup.string().nullable().label(getFields(t, 'password')?.label)
      :
      Yup.string().nullable().required().label(getFields(t, 'password')?.label)
    }),

    uloga: Yup.number().required().label(getFields(t, 'uloga')?.label),
    tip: Yup.number().required().label(getFields(t, 'tip')?.label),
    isActive: Yup.boolean(),
  })
}


let formikContext: any = null;
export const FormikContext = createContext<any>(null);
export const useFormikContext = () => {
    formikContext = useContext(FormikContext);
    if (!formikContext) {
      throw new Error('useFormikContext must be used within a FormikProvider');
    }
    return formikContext;
};


export const prepareForm = (values: any = null, defValues: any = null) => {
  let form = _.cloneDeep(values);
  let data = _.cloneDeep(defValues);

  if(data && form){
    data['imePrezime'] = form?.imePrezime || '';
    data['grad'] = form?.grad || '';
    data['adresa'] = form?.adresa || '';
    data['brojTelefona'] = form?.brojTelefona || '';
    data['email'] = form?.email || '';
    data['password'] = form?.password || '';
    data['uloga'] = form?.uloga || UserType.Radnik;
    data['tip'] = form?.tip || RadnikType.Serviser;
    data['isActive'] = form?.isActive || false;
  }

  return data;
};
export const prepareData = (values: any = null, id: number|null) => {
  let data: any = {};

  if(values){
    data['imePrezime'] = values?.imePrezime || '';
    data['grad'] = values?.grad || '';
    data['adresa'] = values?.adresa || '';
    data['brojTelefona'] = values?.brojTelefona || '';
    data['email'] = values?.email || '';
    data['uloga'] = values?.uloga || UserType.Radnik;
    data['tip'] = values?.tip || RadnikType.Serviser;
    data['isActive'] = values?.isActive || false;

    if (values?.password && values?.password !== '') {
      data['password'] = values?.password || '';
    }

    if (isNumeric(id)) {
      data['id'] = id;
    }
  }

  return data;
};


export interface initialValuesStruct {
  imePrezime: string,
  grad: string,
  adresa: string,
  email: string,
  password: string,
  brojTelefona: string,
  uloga: number|null,
  tip: number|null,
  isActive: boolean,
};
export const initialValues: initialValuesStruct = {
  imePrezime: '',
  grad: '',
  adresa: '',
  brojTelefona: '',
  email: '',
  password: '',
  uloga: UserType.Radnik,
  tip: RadnikType.Serviser,
  isActive: true,
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
    setValues: (state: InitState, action: PayloadAction<any>) => {
      state.details = action.payload;
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

    startCreate: (state: InitState) => {
      state.isLoading = true;
    },
    finishCreate: (state: InitState, action: PayloadAction<any>) => {
      state.isLoading = false;
    },

    startUpdate: (state: InitState) => {
      state.isLoading = true;
    },
    finishUpdate: (state: InitState, action: PayloadAction<any>) => {
      state.isLoading = false;
    },

    startDelete: (state: InitState) => {
      state.isLoading = true;
    },
    finishDelete: (state: InitState, action: PayloadAction<any>) => {
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
      dispatch(actions.startCreate());

      await axios.post(API, params).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, message);
        dispatch(actions.finishCreate(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finishCreate(null));
      });
    },

    callUpdateApi: (params: any, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any) => {
      dispatch(actions.startUpdate());

      await axios.put(API + '/' + params?.id, params).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, message);
        dispatch(actions.finishUpdate(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finishUpdate(null));
      });
    },

    callDeleteApi: (params: any, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any) => {
      dispatch(actions.startDelete());

      await axios.delete(API + '/' + params?.id, { data: params }).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, message);
        dispatch(actions.finishDelete(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finishDelete(null));
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
