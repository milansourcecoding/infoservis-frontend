/* eslint-disable prefer-template */
/* eslint-disable no-loop-func */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from 'src/utils/axios';

import { RemoveAction } from '../../enums.tsx';


export interface InitState {
  isOpen: boolean,
  isBatch: boolean,
  isLoading: boolean,
  ids: string|number|null,
  title: string,
  text: any,
  btn: any,
  state: boolean|null,
  data: any|null,
  msg: string|null,
  type: number,
  params: any,
}


function NewReducer() {
  const name = 'removeSlice';


  const initialState: InitState = {
    isOpen: false,
    isBatch: false,
    isLoading: false,
    ids: null,
    title: '',
    btn: '',
    text: null,
    state: null,
    data: null,
    msg: '',
    type: RemoveAction.Delete,
    params: null
  };


  const reducers = {
    show: (state: InitState, action: PayloadAction<{ type: number, params: any, title: string, text: any, btn: any, ids: string|number|null, isBatch: boolean}>) => {
      state.params = action.payload.params;
      state.type = action.payload.type;
      state.ids = action.payload.ids;
      state.isBatch = action.payload.isBatch;
      state.title = action.payload.title;
      state.text = action.payload.text;
      state.btn = action.payload.btn;
      state.state = null;
      state.data = null;
      state.msg = '';
      state.isLoading = false;
      state.isOpen = true;
    },
    hide: (state: InitState) => {
      state.type = RemoveAction.Delete;
      state.params = null;
      state.ids = null;
      state.title = '';
      state.text = null;
      state.btn = null;
      state.state = null;
      state.data = null;
      state.msg = '';
      state.isLoading = false;
      state.isBatch = false;
      state.isOpen = false;
    },

    start: (state: InitState) => {
      state.isLoading = true;
    },
    finish: (state: InitState, action: PayloadAction<{ data: any|null, msg: string|null, state: boolean|null }>) => {
      state.type = RemoveAction.Delete;
      state.params = null;
      state.ids = null;
      state.title = '';
      state.text = null;
      state.btn = null;
      state.msg = action.payload.msg;
      state.data = action.payload.data;
      state.state = action.payload.state;
      state.isLoading = false;
      state.isBatch = false;
      state.isOpen = false;
    },
  };


  const apis = {
    calDeleteApi: (id: string|number|null, path: string, callback: (data: any|null, msg: string|null, state: boolean|null, type: number) => void) => async (dispatch: any, getState: any) => {
      dispatch(actions.start());

      const { type } = getState().removeSlice;

      await axios.delete(path + '/' + id).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finish({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true, type);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finish({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false, type);
        }
      });
    },

    calBatchDeleteApi: (path: string, callback: (data: any|null, msg: string|null, state: boolean|null, type: number) => void) => async (dispatch: any, getState: any) => {
      dispatch(actions.start());

      const { type, params } = getState().removeSlice;

      await axios.post(path, params).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finish({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true, type);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finish({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false, type);
        }
      });
    },

    calUpdateApi: (id: string|number|null, path: string, callback: (data: any|null, msg: string|null, state: boolean|null, type: number) => void) => async (dispatch: any, getState: any) => {
      dispatch(actions.start());

      const { type, params } = getState().removeSlice;

      await axios.put(path + '/' + id, params).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finish({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true, type);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finish({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false, type);
        }
      });
    },

    calBatchUpdateApi: (path: string, callback: (data: any|null, msg: string|null, state: boolean|null, type: number) => void) => async (dispatch: any, getState: any) => {
      dispatch(actions.start());

      const { type, params } = getState().removeSlice;

      await axios.post(path, params).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finish({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true, type);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finish({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false, type);
        }
      });
    },

    calStornirajApi: (id: string|number|null, path: string, callback: (data: any|null, msg: string|null, state: boolean|null, type: number) => void) => async (dispatch: any, getState: any) => {
      dispatch(actions.start());

      const { type, params } = getState().removeSlice;

      await axios.put(path + '/storniraj/' + id, params).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finish({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true, type);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finish({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false, type);
        }
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
