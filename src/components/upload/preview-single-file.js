import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
//
import FileThumbnail, { fileData, fileFormat } from '../file-thumbnail';

// ----------------------------------------------------------------------

export default function SingleFilePreview({ file }) {
  const { path = '', preview = '' } = fileData(file);
  const format = fileFormat(path || preview);
  const isImage = format === 'image';

  if (isImage) {
    return (
      <Box
        sx={{
          p: 1,
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          position: 'absolute',
        }}
      >
        <FileThumbnail
          imageView
          file={file}
          imgSx={{
            width: 1,
            height: 1,
            objectFit: 'cover',
            borderRadius: 1,
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FileThumbnail tooltip file={file} sx={{ width: 64, height: 64 }} />
    </Box>
  );
}

SingleFilePreview.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};