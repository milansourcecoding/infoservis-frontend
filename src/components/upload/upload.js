import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { useLocales } from 'src/locales';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// assets
import { UploadIllustration } from 'src/assets/illustrations';
//
import Iconify from '../iconify';
//
import RejectionFiles from './errors-rejection-files';
import MultiFilePreview from './preview-multi-file';
import SingleFilePreview from './preview-single-file';

// ----------------------------------------------------------------------

export default function Upload({
  disabled,
  multiple = false,
  maxSize,
  numOfFiles,
  variant = 'dropzone',
  error,
  helperText,
  //
  file,
  onDelete,
  //
  files,
  thumbnail,
  onUpload,
  onRemove,
  onRemoveAll,
  sx,
  ...other
}) {
  const { t } = useLocales();

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple,
    disabled,
    maxSize: maxSize ?? undefined,
    maxFiles: numOfFiles ?? undefined,
    noDrag: variant === 'button',
    ...other,
  });

  const hasFile = !!file && !multiple;

  const hasFiles = !!files && multiple && !!files.length;

  const hasError = isDragReject || !!error;

  const renderPlaceholder = (
    <Stack spacing={3} alignItems="center" justifyContent="center" flexWrap="wrap">
      <UploadIllustration sx={{ width: 1, maxWidth: 200 }} />
      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Typography variant="h6">{t('uploading.dropzoneTitle')}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('uploading.dropzoneDesc1')}
          <Box
            component="span"
            sx={{
              mx: 0.5,
              color: 'primary.main',
              textDecoration: 'underline',
            }}
          >
            {t('uploading.dropzoneDesc2')}
          </Box>
          {t('uploading.dropzoneDesc3')}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderSinglePreview = (
    <SingleFilePreview file={file} />
  );

  const removeSinglePreview = hasFile && onDelete && (
    <IconButton
      size="small"
      onClick={onDelete}
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: 'absolute',
        color: (theme) => alpha(theme.palette.common.white, 0.8),
        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
        },
      }}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );

  const renderSingleActions = hasFile && onUpload && (
    <Stack direction="row" justifyContent="center" spacing={1.5} sx={{ mt: 2 }}>
      <Button
        size="small"
        variant="contained"
        onClick={onUpload}
        startIcon={<Iconify icon="eva:cloud-upload-fill" />}
      >
        {t('buttons.upload')}
      </Button>
    </Stack>
  );

  const renderMultiPreview = hasFiles && (
    <>
      <Box sx={{ my: 3 }}>
        <MultiFilePreview files={files} thumbnail={thumbnail} onRemove={onRemove} />
      </Box>

      <Stack direction="row" justifyContent="center" spacing={1.5}>
        {onRemoveAll && (
          <Button color="inherit" variant="outlined" size="small" onClick={onRemoveAll}>
            {t('buttons.removeAll')}
          </Button>
        )}

        {onUpload && (
          <Button
            size="small"
            variant="contained"
            onClick={onUpload}
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          >
            {t('buttons.upload')}
          </Button>
        )}
      </Stack>
    </>
  );

  // ---- "button" variant: kompaktan izgled kao klasičan file input ----
  if (variant === 'button') {
    return (
      <Box sx={{ width: 1, ...sx }}>
        <Box {...getRootProps()} sx={{ display: 'inline-block' }}>
          <input {...getInputProps()} />
          <Button
            variant="outlined"
            component="span"
            disabled={disabled}
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            color={hasError ? 'error' : 'inherit'}
          >
            {multiple ? t('buttons.chooseFiles') : t('buttons.chooseFile')}
          </Button>
        </Box>

        {helperText && helperText}

        <RejectionFiles fileRejections={fileRejections} />

        {hasFile && (
          <Box sx={{ mt: 2, position: 'relative', width: 120, height: 120 }}>
            {renderSinglePreview}
            {removeSinglePreview}
          </Box>
        )}
        {renderSingleActions}

        {renderMultiPreview}
      </Box>
    );
  }

  // ---- default "dropzone" variant (izgled koji već imaš) ----
  return (
    <Box sx={{ width: 1, position: 'relative', ...sx }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 5,
          outline: 'none',
          borderRadius: 1,
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
          transition: (theme) => theme.transitions.create(['opacity', 'padding']),
          '&:hover': {
            opacity: 0.72,
          },
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasError && {
            color: 'error.main',
            borderColor: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }),
          ...(hasFile && {
            padding: '24% 0',
          }),
        }}
      >
        <input {...getInputProps()} />

        {hasFile ? renderSinglePreview : renderPlaceholder}
      </Box>

      {removeSinglePreview}

      {renderSingleActions}

      {helperText && helperText}

      <RejectionFiles fileRejections={fileRejections} />

      {renderMultiPreview}
    </Box>
  );
}

Upload.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  files: PropTypes.array,
  helperText: PropTypes.object,
  multiple: PropTypes.bool,
  maxSize: PropTypes.number,
  numOfFiles: PropTypes.number,
  variant: PropTypes.oneOf(['dropzone', 'button']),
  onDelete: PropTypes.func,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  onUpload: PropTypes.func,
  sx: PropTypes.object,
  thumbnail: PropTypes.bool,
};