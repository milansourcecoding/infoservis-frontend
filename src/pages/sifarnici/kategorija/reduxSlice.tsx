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
// import {  } from '../../../utils/enums.tsx';


export const API = 'kategorija';
export const LANGUAGE = API;
export const name = API + 'ReduxSlice';


export const getFields = (t: any, field: string) => {
  let fields: any = [
    {
      id: 'naziv',
      name: 'naziv',
      label: t(LANGUAGE + '.table.naziv'),
      placeholder: '',
    },
    {
      id: 'isActive',
      name: 'isActive',
      label: t(LANGUAGE + '.table.isActive'),
      placeholder: '',
    },
    {
      id: 'isDefault',
      name: 'isDefault',
      label: t(LANGUAGE + '.table.isDefault'),
      placeholder: '',
    },
    {
      id: 'isNaplativ',
      name: 'isNaplativ',
      label: t(LANGUAGE + '.table.isNaplativ'),
      placeholder: '',
    },
  ];

  return fields.find((x: any) => x.id === field);
}

export const formSchema = (t: any) => {
  return Yup.object().shape({
    naziv: Yup.string().required().label(getFields(t, 'naziv')?.label),
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
    data['isActive'] = form?.isActive || false;
    data['isNaplativ'] = form?.isNaplativ || false;
    data['naziv'] = form?.naziv || '';
  }

  return data;
};
export const prepareData = (values: any = null, id: number|null) => {
  let data: any = {};

  if(values){
    data['isActive'] = values?.isActive || false;
    data['isNaplativ'] = values?.isNaplativ || false;
    data['naziv'] = values?.naziv || '';

    if (isNumeric(id)) {
      data['id'] = id;
    }
  }

  return data;
};


export interface initialValuesStruct {
  naziv: string,
  isNaplativ: boolean,
  isActive: boolean,
};
export const initialValues: initialValuesStruct = {
  naziv: '',
  isNaplativ: true,
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

    startDefault: (state: InitState) => {
      state.isLoading = true;
    },
    finishDefault: (state: InitState, action: PayloadAction<any>) => {
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

    calSetDefaultApi: (id: number|null, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any) => {
      dispatch(actions.startDefault());

      await axios.put(API + '/setDefault/' + id).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, message);
        dispatch(actions.finishDefault(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finishDefault(null));
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
