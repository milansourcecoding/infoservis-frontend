/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-loop-func */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from 'src/utils/axios';


export interface InitState {
  isLoading: boolean,
  state: boolean|null,
  data: any,
  msg: string,
}

export interface ApiCallChangeGeneral {
  imePrezime: string,
  grad: string,
  email: string,
}

export interface ApiCallChangeGeneralRadnik {
  id: number,
  imePrezime: string,
  grad: string,
  adresa: string,
  email: string,
}

export interface ApiCallChangeUser {
  id: number,
  name: string,
  city: string,
  address: string,
  email: string,
  phone: string,
  jmbg: string,
  status: string,
}

export interface ApiCallChangePassword {
  password: string,
}

export interface ApiCallChangePasswordRadnik {
  id: number,
  password: string,
}


function NewReducer() {
  const name = 'settings';


  const initialState: InitState = {
    isLoading: false,
    state: null,
    data: null,
    msg: ''
  };


  const reducers = {
    startChange: (state: InitState) => {
      state.isLoading = true;
      state.state = null;
      state.data = null;
      state.msg = '';
    },
    finishChange: (state: InitState, action: PayloadAction<{ data: any, msg: string, state: boolean|null }>) => {
      state.msg = action.payload.msg;
      state.data = action.payload.data;
      state.state = action.payload.state;
      state.isLoading = false;
    },
  };


  const apis = {
    callChangeGeneralApi: (params: ApiCallChangeGeneral, callback: (data: any, msg: string, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startChange());

      await axios.put('changeGeneral', params).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finishChange({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finishChange({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false);
        }
      });
    },

    callChangeGeneralRadnikApi: (params: ApiCallChangeGeneralRadnik, callback: (data: any, msg: string, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startChange());

      let { id, email, imePrezime, grad, adresa } = params;
      let args: any = {
        email,
        imePrezime,
        grad,
        adresa,
      };

      await axios.put(`radnik/changeGeneral/${id}`, args).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finishChange({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finishChange({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false);
        }
      });
    },

    // ############################
    callChangeUserApi: (params: ApiCallChangeUser, callback: (data: any, msg: string, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startChange());

      let { id, email, name, city, address, phone, jmbg, status } = params;
      let args: any = {
        email,
        name,
        city,
        address,
        phone,
        jmbg,
        status,
      };


      await axios.put(`user/${id}`, args).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finishChange({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finishChange({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false);
        }
      });
    },
    // ###########################

    callChangePasswordApi: (params: ApiCallChangePassword, callback: (data: any, msg: string, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startChange());

      await axios.put('changePassword', params).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finishChange({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finishChange({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false);
        }
      });
    },

    callChangePasswordRadnikApi: (params: ApiCallChangePasswordRadnik, callback: (data: any, msg: string, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startChange());

      let { id, password } = params;
      let args: any = { password };

      await axios.put(`radnik/changePassword/${id}`, args).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finishChange({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finishChange({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false);
        }
      });
    },

    callUploadLogoApi: (file: File, callback: (data: any, msg: string, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startChange());

      let formData = new FormData();
      formData.append('logo', file);

      await axios.post('uploadLogo', formData).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finishChange({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finishChange({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false);
        }
      });
    },

    callUploadLogoRadnikApi: (id: number, file: File, callback: (data: any, msg: string, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startChange());

      let formData = new FormData();
      formData.append('logo', file);

      await axios.post(`radnik/uploadLogo/${id}`, formData).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finishChange({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finishChange({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false);
        }
      });
    },

    callremoveLogoApi: (callback: (data: any, msg: string, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startChange());

      await axios.post('removeLogo', null).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finishChange({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finishChange({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false);
        }
      });
    },

    callremoveLogoRadnikApi: (id: number, callback: (data: any, msg: string, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startChange());

      await axios.post(`radnik/removeLogo/${id}`, null).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finishChange({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finishChange({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false);
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
