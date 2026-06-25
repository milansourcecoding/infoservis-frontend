/* eslint-disable prefer-template */
/* eslint-disable no-loop-func */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from 'src/utils/axios';



export interface ApiCallParams {
  page: number,
  per_page: number,
  search: string|null,
  is_active: number|null,
  sortColumn: string|null,
  sortDir: string|null,
}

export interface InitState {
  isLoading: boolean,
  options: Array<any>,
  total: number,
}


function NewReducer() {
  const name = 'selectAutocompleteSlice';


  const initialState: InitState = {
    isLoading: false,
    options: [],
    total: 0,
  };


  const reducers = {
    setOptions: (state: InitState, action: PayloadAction<Array<any>>) => {
      state.options = action.payload;
    },

    startRead: (state: InitState) => {
      state.options = [];
      state.total = 0;
      state.isLoading = true;
    },
    finishRead: (state: InitState, action: PayloadAction<{ data: any, msg: string|null, state: boolean|null }>) => {
      const { list, total } = action.payload.data;

      state.options = list;
      state.total = total;
      state.isLoading = false;
    },
  };


  const apis = {
    calReadApi: (path: string, params: ApiCallParams|null, callback?: (data: any|null, msg: string|null, state: boolean|null) => void) => async (dispatch: any, getState: any) => {
      dispatch(actions.startRead());

      await axios.get(path, { params }).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finishRead({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finishRead({ data: [], msg: message, state: false }));

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
