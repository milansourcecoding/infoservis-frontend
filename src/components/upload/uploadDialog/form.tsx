/* eslint-disable eqeqeq */
/* eslint-disable import/order */
import { Icon } from '@iconify/react';

import { useLocales } from 'src/locales';

// @mui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Redux
import { useDispatch } from 'react-redux';
import { RootState, AppDispatch, useTypedSelector } from '../../../utils/store.tsx';
import slice from './slice.tsx';

import UploadField from './UploadField.tsx';

// ----------------------------------------------------------------------

export default function Form({ path, accept = { '*': ['.*'] }, multiple = true, numOfFiles = null, maxFileSize = null, onSuccess }:
  {
    path: string,
    accept: any,
    multiple?: boolean,
    numOfFiles?: number | null,
    maxFileSize?: number | null,
    onSuccess: (data: any|null, state: boolean|null) => void
  }) {
  const { t } = useLocales();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const { show } = useTypedSelector((state: RootState) => state.uploadDialogSlice);
  const dispatch = useDispatch<AppDispatch>();

  const handleCancel = () => {
    dispatch(slice.setShow({ show: false }))
  };

  return (
    <Dialog
      fullWidth
      disableEscapeKeyDown
      maxWidth={false}
      open={show}
      onClose={(e, reason) => {
        if(reason != 'backdropClick'){
          handleCancel()
        }
      }}
      PaperProps={{
        sx: { maxWidth: fullScreen ? '100%' : 720 },
      }}
    >
      <DialogTitle>{t('uploading.title')}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => {
          handleCancel()
        }}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <Icon icon={'material-symbols:close'} />
      </IconButton>

      <DialogContent sx={{ mt: 2, mb: 2 }}>
        <UploadField
          path={path}
          accept={accept}
          multiple={multiple}
          numOfFiles={numOfFiles}
          maxFileSize={maxFileSize}
          onSuccess={(data, state) => {
            if(onSuccess){ onSuccess(data, state); }
            if(state){ handleCancel(); }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}