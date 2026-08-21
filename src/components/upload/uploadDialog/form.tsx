/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/order */
/* eslint-disable prefer-const */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-template */
import { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';

import { useLocales } from 'src/locales';

// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { formatBytes } from '../../../utils/utils.tsx';
// import {  } from '../../utils/enums.tsx';

// components
import { useSnackbar } from 'src/components/snackbar';
import Block from 'src/components/block/block';
import { Upload } from 'src/components/upload';

// Redux
import { useDispatch } from 'react-redux';
import { RootState, AppDispatch, useTypedSelector } from '../../../utils/store.tsx';
import slice from './slice.tsx';

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

  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const { isLoading, show, progress, loadedProgress, totalProgress } = useTypedSelector((state: RootState) => state.uploadDialogSlice);
  const dispatch = useDispatch<AppDispatch>();

  const [files, setFiles] = useState<File[]>([]);


  useEffect(() => {
    if(show){
      setFiles([]);
    }
  }, [show]);


  const handleCancel = () => {
    dispatch(slice.setShow({ show: false }))
  };


  const isOverFilesLimit = (multiple && numOfFiles != null && files) ? files.length > numOfFiles : false;
  const oversizedFiles = (maxFileSize != null && files) ? files.filter((file: any) => file.size > maxFileSize) : [];

  const handleDrop = useCallback(
    (acceptedFiles: any) => {
      const newFiles = acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      if(multiple){
        setFiles([...files, ...newFiles]);
      } else {
        setFiles(newFiles.slice(0, 1));
      }
    },
    [files, multiple]
  );

  const handleRemoveFile = (inputFile: any) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };


  const handleUpload = () => {
    if(isOverFilesLimit){
      enqueueSnackbar(t('uploading.title1') + ' ' + numOfFiles + ' ' + t('uploading.title2'), { variant: 'warning' });
    } else if(oversizedFiles.length > 0){
      enqueueSnackbar(t('uploading.maxSizeError') + ' ' + formatBytes(maxFileSize as number), { variant: 'warning' });
    } else {
      dispatch(slice.callBatchUploadApi(files, path,
        (progressValue, loadedValue, totalValue) => {
          dispatch(slice.setProgress(progressValue));
          dispatch(slice.setLoadedProgress(loadedValue));
          dispatch(slice.setTotalProgress(totalValue));
        },
        (data: any|null, state: boolean|null) => {
          dispatch(slice.setProgress(null));
          dispatch(slice.setLoadedProgress(null));
          dispatch(slice.setTotalProgress(null));

          if(state){
            enqueueSnackbar(t('uploading.success'), { variant: 'success'  });
            if(onSuccess){ onSuccess(data, state); }
            handleCancel()
          } else {
            enqueueSnackbar(t('uploading.error'), { variant: 'error' });
          }
      }))
    }
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

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} mt={2} mb={2}>

            {isOverFilesLimit && <Box textAlign={'center'} pb={2}>
              <Alert severity="warning">{t('uploading.title1') + ' ' + numOfFiles + ' ' + t('uploading.title2')}</Alert>
            </Box>}

            {(maxFileSize != null && oversizedFiles.length > 0) && <Box textAlign={'center'} pb={2}>
              <Alert severity="error">
                {t('uploading.maxSizeError') + ' ' + formatBytes(maxFileSize)}
              </Alert>
            </Box>}

            {progress && <Box width={'100%'}>
              <Box textAlign={'center'}>
                {
                  (progress === 100)
                  ?
                  <Typography variant={'caption'}>{t('table.loading')}</Typography>
                  :
                  <Grid container>
                    <Grid item xs={4}>&nbsp;</Grid>
                    <Grid item xs={4} textAlign={'center'}>
                      <Typography variant={'caption'}>{t('table.uploading')}</Typography>
                    </Grid>
                    <Grid item xs={4} textAlign={'end'}>
                      <Typography variant={'caption'}>{formatBytes(loadedProgress)} / {formatBytes(totalProgress)}</Typography>
                    </Grid>
                  </Grid>
                }
              </Box>
              <Box>
                {
                  (progress === 100)
                  ?
                  <LinearProgress color={'info'} />
                  :
                  <LinearProgress variant={'determinate'} color={'info'} value={(progress && progress > 0) ? progress : 0} />
                }
              </Box>
              <Box textAlign={'center'}>
                {
                  (progress != null) && <Typography variant={'button'}>{(progress && progress > 0) ? progress : 0}%</Typography>}
              </Box>
            </Box>}

            <Upload
              accept={accept}
              multiple={multiple}
              maxSize={maxFileSize ?? undefined}
              numOfFiles={numOfFiles ?? undefined}
              files={multiple ? files : undefined}
              file={!multiple ? files?.[0] : undefined}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              onDelete={!multiple ? () => handleRemoveFile(files[0]) : undefined}
              onUpload={handleUpload}
              onCancel={handleCancel}

              thumbnail
              onRemoveAll={undefined}

              disabled={undefined}
              error={undefined}
              helperText={undefined}
              sx={undefined}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Block isLoading={isLoading} />
    </Dialog>
  );
}