import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

import { useLocales } from 'src/locales';

// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// Redux
// import { useDispatch } from 'react-redux';
import { RootState, useTypedSelector } from '../../utils/store.tsx';
// import listSlice from '../../../utils/slice/form/listSlice.tsx';

// ----------------------------------------------------------------------

export default function BasicTabsToolbar({
  filters,
  onFilters,
  onResetFilters,
  results,
  mainStatus = 'all',
  ...other
}: any) {
  const { t } = useLocales();

  const { search } = useTypedSelector((state: RootState) => state.listSlice);

  const handleRemoveStatus = () => {
    onFilters('status', mainStatus);
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2', pl: 1 }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          {t('resultsFound')}
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.status !== mainStatus && (
          <Block label={t('status.label')}>
            <Chip size="small" label={filters.label} onDelete={handleRemoveStatus} />
          </Block>
        )}

        {((filters.status !== mainStatus) || search) && (<Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Icon icon={'grommet-icons:clear'} />}
        >
          {t('buttons.clear')}
        </Button>)}
      </Stack>
    </Stack>
  );
}

BasicTabsToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  results: PropTypes.number,
  mainStatus: PropTypes.string,
};

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }: any) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
};
