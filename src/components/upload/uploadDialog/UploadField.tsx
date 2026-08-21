/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-template */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

import { useLocales } from 'src/locales';
import { Upload } from 'src/components/upload';

import { formatBytes } from '../../../utils/utils.tsx';
import { useUpload } from './useUpload.tsx';

// ----------------------------------------------------------------------

export default function UploadField({ path, accept = { '*': ['.*'] }, multiple = true, numOfFiles = null, maxFileSize = null, variant = 'dropzone', onSuccess }:
  {
    path: string,
    accept: any,
    multiple?: boolean,
    numOfFiles?: number | null,
    maxFileSize?: number | null,
    variant?: 'dropzone' | 'button',
    onSuccess?: (data: any|null, state: boolean|null) => void,
  }) {
  const { t } = useLocales();

  const {
    files, isLoading, progress, loadedProgress, totalProgress,
    isOverFilesLimit, oversizedFiles,
    handleDrop, handleRemoveFile, handleUpload,
  } = useUpload({ path, multiple, numOfFiles, maxFileSize, onSuccess });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>

        {isOverFilesLimit && <Box textAlign={'center'} pb={2}>
          <Alert severity="warning">{t('uploading.title1') + ' ' + numOfFiles + ' ' + t('uploading.title2')}</Alert>
        </Box>}

        {(maxFileSize != null && oversizedFiles.length > 0) && <Box textAlign={'center'} pb={2}>
          <Alert severity="error">
            {t('uploading.maxSizeError') + ' ' + formatBytes(maxFileSize)}
          </Alert>
        </Box>}

        {progress != null && <Box width={'100%'} pb={2}>
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
            <Typography variant={'button'}>{(progress && progress > 0) ? progress : 0}%</Typography>
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
          thumbnail
          disabled={isLoading}
          variant={variant}
          onRemoveAll={undefined}
          error={undefined}
          helperText={undefined}
          sx={undefined}
        />
      </Grid>
    </Grid>
  );
}