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
// import React, { createContext, useContext } from 'react';
// import { useFormik as useFormikOriginal } from 'formik';
import _ from 'lodash';
import moment from 'moment';

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from '../../../utils/axios.jsx';
// import Yup from '../../../utils/yup.tsx';
import { apiDateFormat } from '../../../utils/utils.tsx';
// import {  } from '../../../utils/enums.tsx';



export const name = 'bulkInvoicingSlice';


interface InitState {
  isLoading: boolean,
  show: boolean,
  isLoadingGenerate: boolean,
  items: Array<any>,
  checked: Array<any>,
  selectedDate: any,
  progress: number|null,
}

function NewReducer() {
  const initialState: InitState = {
    isLoading: false,
    show: false,
    isLoadingGenerate: false,
    items: [],
    checked: [],
    selectedDate: moment().endOf('month').format(apiDateFormat()),
    progress: null,
  };


  const reducers = {
    resetSlice: () => {
      return initialState;
    },
    setLoading: (state: InitState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSelectedDate: (state: InitState, action: PayloadAction<any>) => {
      state.selectedDate = action.payload;
    },
    setProgress: (state: InitState, action: PayloadAction<number|null>) => {
      state.progress = action.payload;
    },
    setShow: (state: InitState, action: PayloadAction<{ show: boolean }>) => {
      state.checked = [];
      state.show = action.payload.show;
    },
    setChecked: (state: InitState, action: PayloadAction<number|null>) => {
      let id = action.payload;
      let checked = [...state.checked];

      const index = checked.findIndex((x: any) => x == id);

      if (index === -1) {
        checked.push(id);
      } else {
        checked.splice(index, 1);
      }

      state.checked = checked;
    },
    setCheckedAll: (state: InitState, action: PayloadAction<Array<any>>) => {
      state.checked = action.payload;
    },

    startRead: (state: InitState) => {
      state.isLoading = true;
      state.items = [];
    },
    finishRead: (state: InitState, action: PayloadAction<any>) => {
      let data = (action.payload && action.payload.length > 0) ? action.payload : [];
      state.items = data;
      state.checked = data.map((x: any) => x.id)
      state.isLoading = false;
    },

    start: (state: InitState) => {
      state.isLoadingGenerate = true;
    },
    finish: (state: InitState, action: PayloadAction<any>) => {
      state.isLoadingGenerate = false;
    },
  };

  const downloadInvoices = async (invoiceIds: number[]) => {
    const response = await axios.post(
      'invoices/bulk-download',
      {
        invoice_ids: invoiceIds,
      },
      {
        responseType: 'blob',
      }
    );

    const url = window.URL.createObjectURL(response.data);

    const link = document.createElement('a');

    link.href = url;
    link.download = 'invoices.zip';

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  };


  const apis = {
    callReadApi: (params: any, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any) => {
      dispatch(actions.startRead());

      await axios.get('building', { params: params }).then((result: any) => {
        const { data, message } = result.data;

        callback(true, data, message);
        dispatch(actions.finishRead(data));
      }).catch((error: any) => {
        const { message } = error;

        callback(false, null, message);
        dispatch(actions.finishRead(null));
      });
    },

    callGenerateApi: (params: any, callback: (state: boolean, data: any, message: string) => void) => async (dispatch: any, getState: any) => {
      dispatch(actions.start());
      dispatch(actions.setProgress(0));

      const { items } = getState()?.[name];

      

      dispatch(actions.start());

      await axios.post('building/bulk-invoicing', params).then(async (result: any) => {
        const { data, message } = result.data;

       await downloadInvoices(data.invoice_ids);

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
