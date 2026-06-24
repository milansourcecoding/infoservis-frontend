/* eslint-disable arrow-body-style */
/* eslint-disable prefer-template */
/* eslint-disable no-loop-func */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from 'src/utils/axios';
import moment from 'moment';

import { saveDate, prepareDate, apiDateFormat } from '../../utils.tsx';


export interface InitState {
  isOpen: boolean,
  isLoading: boolean,

  id: number|null,
  data: any|null,

  rows: Array<any>,
  total: number,

  page: number,
  per_page: number,
  search: string|null,
  isActive: number|null,
  sortColumn: string|null,
  sortDir: string|null,
  from: any,
  to: any,

  customField?: string|null,
  customFieldValue?: string|null,

  stats: Array<any>
}


function NewReducer() {
  const name = 'listSlice';


  const initialState: InitState = {
    isOpen: false,
    isLoading: false,

    id: null,
    data: null,

    rows: [],
    total: 0,

    page: 1,
    per_page: 10,
    search: null,
    isActive: null,
    sortColumn: 'created_at',
    sortDir: 'asc',
    from: '',
    to: '',

    customField: null,
    customFieldValue: null,

    stats: []
  };


  const reducers = {
    hide: (state: InitState) => {
      state.id = null;
      state.data = null;
      state.isLoading = false;
      state.isOpen = false;
    },

    changeRows: (state: InitState, action: PayloadAction<Array<any>>) => {
      state.rows = action.payload;
    },
    changeTotal: (state: InitState, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    changePage: (state: InitState, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    changePerPage: (state: InitState, action: PayloadAction<number>) => {
      state.per_page = action.payload;
    },
    changeSearch: (state: InitState, action: PayloadAction<string|null>) => {
      state.search = action.payload;
    },
    changeIsActive: (state: InitState, action: PayloadAction<number|null>) => {
      state.isActive = action.payload;
    },
    changeSortColumn: (state: InitState, action: PayloadAction<string|null>) => {
      state.sortColumn = action.payload;
    },
    changeSortDir: (state: InitState, action: PayloadAction<string|null>) => {
      state.sortDir = action.payload;
    },
    changeFrom: (state: InitState, action: PayloadAction<any>) => {
      state.from = action.payload;
    },
    changeTo: (state: InitState, action: PayloadAction<any>) => {
      state.to = action.payload;
    },
    changeFromToDate: (state: InitState, action: PayloadAction<{ from: string, to: string }>) => {
      state.from = action.payload?.from;
      state.to = action.payload?.to;
    },
    changeSort: (state: InitState, action: PayloadAction<{ sortColumn: string|null, sortDir: string|null }>) => {
      state.sortColumn = action.payload.sortColumn;
      state.sortDir = action.payload.sortDir;
    },
    changeCustomField: (state: InitState, action: PayloadAction<{ customField: string|null, customFieldValue: string|null }>) => {
      state.customField = action.payload.customField;
      state.customFieldValue = action.payload.customFieldValue;
    },

    resetForm: (state: InitState) => {
      return initialState;
    },

    startRead: (state: InitState) => {
      state.rows = [];
      state.total = 0;
      state.isLoading = true;
    },
    finishRead: (state: InitState, action: PayloadAction<{ data: any, msg: string|null, state: boolean|null }>) => {
      const { data, meta } = action.payload.data;

      state.rows = data;
      state.total = meta?.total || 0;
      state.isLoading = false;
    },

    startNewDetails: (state: InitState) => {
      state.id = null;
      state.data = null;
      state.isLoading = false;
      state.isOpen = true;
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

    startCreate: (state: InitState) => {
      state.isLoading = true;
    },
    finishCreate: (state: InitState, action: PayloadAction<{ data: any|null, msg: string|null, state: boolean|null }>) => {
      state.isLoading = false;

      if(action.payload.state){
        state.data = action.payload.data;
        state.isOpen = false;
      }
    },

    startUpdate: (state: InitState) => {
      state.isLoading = true;
    },
    finishUpdate: (state: InitState, action: PayloadAction<{ data: any|null, msg: string|null, state: boolean|null }>) => {
      state.isLoading = false;

      if(action.payload.state){
        state.isOpen = false;
        state.data = action.payload.data;
      }
    },

    startDefault: (state: InitState) => {
      state.isLoading = true;
    },
    finishDefault: (state: InitState, action: PayloadAction<{ data: any|null, msg: string|null, state: boolean|null }>) => {
      state.isLoading = false;
    },

    startStats: (state: InitState) => {
      state.stats = [];
      state.isLoading = true;
    },
    finishStats: (state: InitState, action: PayloadAction<{ data: any, msg: string|null, state: boolean|null }>) => {
      state.stats = action.payload.data;
      state.isLoading = false;
    },

    startGeneratePDF: (state: InitState) => {
      state.isLoading = true;
    },
    finishGeneratePDF: (state: InitState) => {
      state.isLoading = false;
    },

    startGenerateCSV: (state: InitState) => {
      state.isLoading = true;
    },
    finishGenerateCSV: (state: InitState) => {
      state.isLoading = false;
    },
  };


  const apis = {
    calReadApi: (path: string, callback?: (data: any|null, msg: string|null, state: boolean|null) => void) => async (dispatch: any, getState: any) => {
      dispatch(actions.startRead());

      const { page, per_page, search, isActive, sortColumn, sortDir, from, to, customField, customFieldValue } = getState().listSlice;

      const fromVal = prepareDate(from);
      const toVal = prepareDate(to);

      const params: any = {
        page,
        per_page,
        search: (customField !== undefined && customField !== null && customField !== '') ? null : search,
        // isActive,
        sortColumn,
        sortDir,
        [customField]: customFieldValue,
      };

      if(fromVal && toVal){
        params.from = moment(fromVal).format(apiDateFormat());
        params.to = moment(toVal).format(apiDateFormat());
      }

      await axios.get(path, { params }).then(result => {
        const { data, meta, message } = result.data;

        dispatch(actions.finishRead({ data: { data, meta }, msg: message, state: true}));

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
        dispatch(actions.startNewDetails());
      }
    },

    calCreateApi: (params: any, path: string, callback?: (data: any|null, msg: string|null, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startCreate());

      await axios.post(path, params).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finishCreate({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finishCreate({ data: [], msg: message, state: false }));

        if(callback){
          callback(null, message, false);
        }
      });
    },

    calUpdateApi: (id: number|null, params: any, path: string, callback?: (data: any|null, msg: string|null, state: boolean|null) => void) => async (dispatch: any) => {
      if(id){
        dispatch(actions.startUpdate());

        await axios.put(path + '/' + id, params).then(result => {
          const { data, message } = result.data;

          dispatch(actions.finishUpdate({ data, msg: message, state: true}));

          if(callback){
            callback(data, message, true);
          }
        }).catch(error => {
          const { message } = error;

          dispatch(actions.finishUpdate({ data: null, msg: message, state: false }));

          if(callback){
            callback(null, message, false);
          }
        });
      } else {
        dispatch(actions.startNewDetails());
      }
    },

    calSetDefaultApi: (id: number|null, path: string, callback?: (data: any|null, msg: string|null, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startDefault());

      await axios.put(path + '/setDefault/' + id).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finishDefault({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finishDefault({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false);
        }
      });
    },

    calGetDefaultApi: (path: string, callback?: (data: any|null, msg: string|null, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startDefault());

      await axios.get(path + '/getDefault').then(result => {
        const { data, message } = result.data;

        dispatch(actions.finishDefault({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finishDefault({ data: null, msg: message, state: false }));

        if(callback){
          callback(null, message, false);
        }
      });
    },

    calStatsApi: (path: string, searchValue: string|null, callback?: (data: any|null, msg: string|null, state: boolean|null) => void) => async (dispatch: any, getState: any) => {
      dispatch(actions.startStats());

      const { customField, customFieldValue, from, to } = getState().listSlice;
    
      const fromVal = prepareDate(from);
      const toVal = prepareDate(to);
      
      const params: any = {
        search: (customField !== undefined && customField !== null && customField !== '') ? null : searchValue,
        [customField]: customFieldValue,
      };

      if(fromVal && toVal){
        params.from = moment(fromVal).format(apiDateFormat());
        params.to = moment(toVal).format(apiDateFormat());
      }

      await axios.get(path + '/stats', { params }).then(result => {
        const { data, message } = result.data;

        dispatch(actions.finishStats({ data, msg: message, state: true}));

        if(callback){
          callback(data, message, true);
        }
      }).catch(error => {
        const { message } = error;

        dispatch(actions.finishStats({ data: [], msg: message, state: false }));

        if(callback){
          callback(null, message, false);
        }
      });
    },

    calGeneratePDFApi: (params: any, path: string, callback?: (data: any|null, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startGeneratePDF());

      await axios.post(path + '/generatePDF', params).then(result => {
        dispatch(actions.finishGeneratePDF());

        if(callback){
          callback(result.data, true);
        }
      }).catch(error => {
        dispatch(actions.finishGeneratePDF());

        if(callback){
          callback(null, false);
        }
      });
    },

    calGenerateCSVApi: (params: any, path: string, callback?: (data: any|null, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startGenerateCSV());

      await axios.put(path + '/generateCSV', params).then(result => {
        dispatch(actions.finishGenerateCSV());

        if(callback){
          callback(result.data, true);
        }
      }).catch(error => {
        dispatch(actions.finishGenerateCSV());

        if(callback){
          callback(null, false);
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
