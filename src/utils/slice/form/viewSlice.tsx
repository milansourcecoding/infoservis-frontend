/* eslint-disable prefer-template */
/* eslint-disable no-loop-func */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from 'src/utils/axios';


export interface InitState {
  isOpen: boolean,
  isLoading: boolean,

  id: number|null,
  data: any|null
}


function NewReducer() {
  const name = 'viewSlice';


  const initialState: InitState = {
    isOpen: false,
    isLoading: false,

    id: null,
    data: null
  };


  const reducers = {
    hide: (state: InitState) => {
      state.id = null;
      state.data = null;
      state.isLoading = false;
      state.isOpen = false;
    },

    startDetails: (state: InitState, action: PayloadAction<number|null>) => {
      state.id = action.payload;
      state.data = null;
      state.isLoading = true;
      state.isOpen = true;
    },
    finishDetails: (state: InitState, action: PayloadAction<{ data: any|null, msg: string|null, state: boolean|null }>) => {
      state.data = action.payload.data;
      state.isLoading = false;
    },
  };


  const apis = {
    calDetailsApi: (id: number|null, path: string, callback?: (data: any|null, msg: string|null, state: boolean|null) => void) => async (dispatch: any) => {
      if(id){
        dispatch(actions.startDetails(id));

        await axios.get(path + '/' + id).then(result => {
          const { data, message } = result.data;

          dispatch(actions.finishDetails({ data, msg: message, state: true}));

          if(callback){
            callback(data, message, true);
          }
        }).catch(error => {
          const { message } = error;

          dispatch(actions.finishDetails({ data: null, msg: message, state: false }));

          if(callback){
            callback(null, message, false);
          }
        });
      } else {
        dispatch(actions.finishDetails({ data: null, msg: '', state: false }));
      }
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
