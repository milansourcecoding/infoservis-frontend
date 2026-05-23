/* eslint-disable react/prop-types */
import react from 'react';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

// eslint-disable-next-line arrow-body-style
const Block = ({ isLoading }) => {
    return isLoading && <div style={{
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      opacity: '0.3',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}><CircularProgress /></div>
}

export default Block;
