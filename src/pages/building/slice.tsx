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


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import axios from '../../utils/axios.jsx';
import Yup from '../../utils/yup.tsx';
import { isNumeric, getRoles } from '../../utils/utils.tsx';
// import {  } from '../../utils/enums.tsx';


export const API = 'building';
export const LANGUAGE = 'building';
export const name = LANGUAGE + 'Slice';


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
      id: 'country',
      name: 'country',
      label: t(LANGUAGE + '.table.country'),
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
    { ...getFields(t, 'name') },
    { ...getFields(t, 'address') },
    { ...getFields(t, 'city') },
    { ...getFields(t, 'country') },
  ];
}

export const formSchema = (t: any, id: number|null = null) => {
  return Yup.object().shape({
    name: Yup.string().required().label(getFields(t, 'name')?.label),
    city: Yup.string().required().label(getFields(t, 'city')?.label),
    address: Yup.string().required().label(getFields(t, 'address')?.label),
    country: Yup.string().required().label(getFields(t, 'country')?.label),
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
    data['country'] = form?.country || '';

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
    data['country'] = values?.country || '';

    data['is_active'] = values?.is_active || false;

    if (isNumeric(id)) {
      data['id'] = id;
    }
  }

  return data;
};


export interface initialValuesStruct {
  name: string,
  city: string,
  address: string,
  country: string,
  is_active: boolean,
};
export const initialValues: initialValuesStruct = {
  name: '',
  city: '',
  address: '',
  country: '',
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
