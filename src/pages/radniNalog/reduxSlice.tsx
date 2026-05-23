/* eslint-disable eqeqeq */
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

import axios from '../../utils/axios.jsx';
import Yup from '../../utils/yup.tsx';
import { isNumeric, twoDecimalValidation } from '../../utils/utils.tsx';
import { StatusDokumenta } from '../../utils/enums.tsx';


export const API = 'radniNalog';
export const LANGUAGE = API;
export const name = API + 'ReduxSlice';


export const getFields = (t: any, field: string) => {
  let fields: any = [
    {
      id: 'brojDokumenta',
      name: 'brojDokumenta',
      label: t(LANGUAGE + '.table.brojDokumenta'),
      placeholder: '',
    },
    {
      id: 'napomena',
      name: 'napomena',
      label: t(LANGUAGE + '.table.napomena'),
      placeholder: '',
    },
    {
      id: 'brojRadnihSatiPoRadniku',
      name: 'brojRadnihSatiPoRadniku',
      label: t(LANGUAGE + '.table.brojRadnihSatiPoRadniku'),
      placeholder: '',
    },
    {
      id: 'cenaRadnogSataIzUgovora',
      name: 'cenaRadnogSataIzUgovora',
      label: t(LANGUAGE + '.table.cenaRadnogSataIzUgovora'),
      placeholder: '',
    },
    {
      id: 'status',
      name: 'status',
      label: t(LANGUAGE + '.table.status'),
      placeholder: '',
    },
    {
      id: 'lift_id',
      name: 'lift_id',
      label: t(LANGUAGE + '.table.lift_id'),
      placeholder: '',
    },
    {
      id: 'kategorija_id',
      name: 'kategorija_id',
      label: t(LANGUAGE + '.table.kategorija_id'),
      placeholder: '',
    },
    {
      id: 'radnici_ids',
      name: 'radnici_ids',
      label: t(LANGUAGE + '.table.radnici_ids'),
      placeholder: '',
    },
  ];

  return fields.find((x: any) => x.id === field);
}

export const formSchema = (t: any) => {
  return Yup.object().shape({
    napomena: Yup.string().required().label(getFields(t, 'napomena')?.label),
    brojRadnihSatiPoRadniku: Yup.number().integer().nullable().min(0).required().label(getFields(t, 'brojRadnihSatiPoRadniku')?.label),
    cenaRadnogSataIzUgovora: Yup.number().min(0).required().test('decimal-places', 'Morate uneti tačno 2 decimalna mesta.', twoDecimalValidation).label(getFields(t, 'cenaRadnogSataIzUgovora')?.label),
    status: Yup.number().required().label(getFields(t, 'status')?.label),
    lift_id: Yup.number().required().label(getFields(t, 'lift_id')?.label),
    kategorija_id: Yup.number().required().label(getFields(t, 'kategorija_id')?.label),
    radnici_ids: Yup.array().min(1).label(getFields(t, 'radnici_ids')?.label),
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


export const preparePayloadForm = (values: any = null, defValues: any = null) => {
  let form = _.cloneDeep(values);
  let data = _.cloneDeep(defValues);

  if(data && form){
    let lift_id = (form && isNumeric(form.lift_id)) ? form.lift_id : null;
    let kategorija_id = (form && isNumeric(form.kategorija_id)) ? form.kategorija_id : null;
    let zahtev_za_radni_nalog_id = (form && isNumeric(form.id)) ? form.id : null;


    data['isActive'] = true;
    data['napomena'] = form?.napomena || '';
    data['status'] = StatusDokumenta.Processing;
    data['lift'] = form?.lift || null;
    data['lift_id'] = lift_id;
    data['kategorija'] = form?.kategorija || null;
    data['kategorija_id'] = kategorija_id;

    data['zahtev_za_radni_nalog_id'] = zahtev_za_radni_nalog_id;
  }

  return data;
};
export const prepareForm = (values: any = null, defValues: any = null) => {
  let form = _.cloneDeep(values);
  let data = _.cloneDeep(defValues);

  if(data && form){
    let lift_id = (form && isNumeric(form.lift_id)) ? form.lift_id : null;
    let kategorija_id = (form && isNumeric(form.kategorija_id)) ? form.kategorija_id : null;
    let radnici_ids = (form.radnici_ids && form.radnici_ids != '') ? form.radnici_ids.split(',') : [];


    data['brojDokumenta'] = form?.brojDokumenta || '';
    data['isActive'] = form?.isActive || false;
    data['napomena'] = form?.napomena || '';
    data['brojRadnihSatiPoRadniku'] = form?.brojRadnihSatiPoRadniku || null;
    data['cenaRadnogSataIzUgovora'] = form?.cenaRadnogSataIzUgovora || null;
    data['status'] = form?.status || StatusDokumenta.None;
    data['lift'] = form?.lift || null;
    data['lift_id'] = lift_id;
    data['kategorija'] = form?.kategorija || null;
    data['kategorija_id'] = kategorija_id;
    data['radnici_ids'] = radnici_ids;
    data['radnici'] = form?.radnici || [];
  }

  return data;
};
export const prepareData = (values: any = null, id: number|null) => {
  let data: any = {};

  if(values){
    let status = (values && isNumeric(values.status)) ? values.status : StatusDokumenta.None;
    let lift_id = (values && isNumeric(values.lift_id)) ? values.lift_id : null;
    let kategorija_id = (values && isNumeric(values.kategorija_id)) ? values.kategorija_id : null;


    data['isActive'] = values?.isActive || false;
    data['napomena'] = values?.napomena || '';
    data['brojRadnihSatiPoRadniku'] = values?.brojRadnihSatiPoRadniku || null;
    data['cenaRadnogSataIzUgovora'] = values?.cenaRadnogSataIzUgovora || null;
    data['status'] = status;
    data['lift_id'] = lift_id;
    data['kategorija_id'] = kategorija_id;
    data['radnici_ids'] = values?.radnici_ids.join(',') || '';

    if (isNumeric(values.zahtev_za_radni_nalog_id)) {
      data['zahtev_za_radni_nalog_id'] = values.zahtev_za_radni_nalog_id;
    }

    if (isNumeric(id)) {
      data['id'] = id;
    }
  }

  return data;
};


export interface initialValuesStruct {
  isActive: boolean,
  napomena: string,
  brojRadnihSatiPoRadniku: number|null,
  cenaRadnogSataIzUgovora: number|null,
  status: number,
  lift_id: any,
  kategorija_id: any,
  radnici: Array<any>,
  radnici_ids: Array<any>,
};
export const initialValues: initialValuesStruct = {
  isActive: true,
  napomena: '',
  brojRadnihSatiPoRadniku: null,
  cenaRadnogSataIzUgovora: null,
  status: StatusDokumenta.Processing,
  lift_id: null,
  kategorija_id: null,
  radnici: [],
  radnici_ids: [],
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
