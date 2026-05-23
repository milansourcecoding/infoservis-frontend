/* eslint-disable no-shadow */
/* eslint-disable no-lonely-if */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/order */
/* eslint-disable prefer-template */
/* eslint-disable import/extensions */
import React from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSnackbar } from 'src/components/snackbar';

import { RemoveAction } from '../../enums.tsx';

// Redux
import { useDispatch } from 'react-redux';
import { RootState, AppDispatch, useTypedSelector } from '../../store.tsx';
import removeSlice from './removeSlice.tsx';

// ----------------------------------------------------------------------

const RemovePopup = ({path, callback}: any) => {
  const { enqueueSnackbar } = useSnackbar();

  const { isOpen, isLoading, isBatch, ids, title, text, btn, type } = useTypedSelector((state: RootState) => state.removeSlice);
  const dispatch = useDispatch<AppDispatch>();


  return <ConfirmDialog
    open={isOpen}
    onClose={() => {
      dispatch(removeSlice.hide())
    }}
    title={title}
    content={<>{text}</>}
    action={
      <LoadingButton color="error" variant="contained" loading={isLoading}
        onClick={() => {
          if(type === RemoveAction.Storniraj){
            dispatch(removeSlice.calStornirajApi(ids, path, (data: any|null, msg: string|null, state: boolean|null, type: number) => {
              if(state){
                enqueueSnackbar(msg, { variant: 'success' });
              } else {
                enqueueSnackbar(msg, { variant: 'error' });
              }

              if(callback){
                callback(data, msg, state, type, isBatch);
              }
            }))

          } else if((type === RemoveAction.Activate) || (type === RemoveAction.Deactivate)){
            if(isBatch){
              dispatch(removeSlice.calBatchUpdateApi(path + '/batchUpdate', (data: any|null, msg: string|null, state: boolean|null, type: number) => {
                if(state){
                  enqueueSnackbar(msg, { variant: 'success' });
                } else {
                  enqueueSnackbar(msg, { variant: 'error' });
                }

                if(callback){
                  callback(data, msg, state, type, isBatch);
                }
              }))

            } else {
              dispatch(removeSlice.calUpdateApi(ids, path, (data: any|null, msg: string|null, state: boolean|null, type: number) => {
                if(state){
                  enqueueSnackbar(msg, { variant: 'success' });
                } else {
                  enqueueSnackbar(msg, { variant: 'error' });
                }

                if(callback){
                  callback(data, msg, state, type, isBatch);
                }
              }))
            }

          } else {
            if(isBatch){
              dispatch(removeSlice.calBatchDeleteApi(path + '/batchDelete', (data: any|null, msg: string|null, state: boolean|null, type: number) => {
                if(state){
                  enqueueSnackbar(msg, { variant: 'success' });
                } else {
                  enqueueSnackbar(msg, { variant: 'error' });
                }

                if(callback){
                  callback(data, msg, state, type, isBatch);
                }
              }))

            } else {
              dispatch(removeSlice.calDeleteApi(ids, path, (data: any|null, msg: string|null, state: boolean|null, type: number) => {
                if(state){
                  enqueueSnackbar(msg, { variant: 'success' });
                } else {
                  enqueueSnackbar(msg, { variant: 'error' });
                }

                if(callback){
                  callback(data, msg, state, type, isBatch);
                }
              }))
            }
          }
        }}
      >
      {btn}
      </LoadingButton>
    }
  />
}

export default RemovePopup;
