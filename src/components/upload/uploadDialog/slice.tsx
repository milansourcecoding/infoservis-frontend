/* eslint-disable prefer-template */
/* eslint-disable no-loop-func */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from 'src/utils/axios';


export interface InitState {
  isLoading: boolean,
  show: boolean,
  
  progress: number|null,
  loadedProgress: number|null,
  totalProgress: number|null,
}


function NewReducer() {
  const name = 'uploadDialogSlice';


  const initialState: InitState = {
    isLoading: false,
    show: false,
  
    progress: null,
    loadedProgress: null,
    totalProgress: null,
  };


  const reducers = {
    setShow: (state: InitState, action: PayloadAction<{ show: boolean }>) => {
      const show = action.payload.show;

      if(show){
        state.progress = null;
        state.loadedProgress = null;
        state.totalProgress = null;
      }

      state.show = show;
    },

    setProgress: (state: InitState, action: PayloadAction<number|null>) => {
      state.progress = action.payload;
    },
    setLoadedProgress: (state: InitState, action: PayloadAction<number|null>) => {
      state.loadedProgress = action.payload;
    },
    setTotalProgress: (state: InitState, action: PayloadAction<number|null>) => {
      state.totalProgress = action.payload;
    },

    startBatchUpload: (state: InitState) => {
      state.isLoading = true;
    },
    finishBatchUpload: (state: InitState) => {
      state.isLoading = false;
    },
  };


  const apis = {
    callBatchUploadApi: (filePath: any, path: string, onUploadProgress?: (progress: number, loaded: number, total: number) => void, callback?: (data: any|null, state: boolean|null) => void) => async (dispatch: any) => {
      dispatch(actions.startBatchUpload());

      const formData = new FormData();
      if(filePath && filePath.length > 0){
        filePath.forEach((item: any, index: number) => {
          formData.append(`filePath[${index}]`, item);
        });
      }

      await axios.post(path, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) => {
          if(onUploadProgress){
            const loaded = (e && e.loaded) ? e.loaded : 0;
            const total = (e && e.total) ? e.total : 0;
            const progress = Math.round((100 * loaded) / total);
            onUploadProgress(progress, loaded, total);
          }
        },
      }).then(result => {
        dispatch(actions.finishBatchUpload());

        if(callback){
          callback(result, true);
        }
      }).catch(error => {
        dispatch(actions.finishBatchUpload());

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
