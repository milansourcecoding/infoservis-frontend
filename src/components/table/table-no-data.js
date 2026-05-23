/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
//
import { useLocales } from 'src/locales';
import EmptyContent from '../empty-content';

// ----------------------------------------------------------------------

export default function TableNoData({ notFound, isLoading, sx }) {
  const { t } = useLocales();

  return (
    <TableRow>
      {
        isLoading
        ?
        <TableCell colSpan={12}>
            <EmptyContent
              filled
              title={t('table.loading')}
              sx={{
                py: 10,
                ...sx,
              }}
            />
          </TableCell>
        :
        notFound ? (
          <TableCell colSpan={12}>
            <EmptyContent
              filled
              title={t('table.noData')}
              sx={{
                py: 10,
                ...sx,
              }}
            />
          </TableCell>
        ) : (
          <TableCell colSpan={12} sx={{ p: 0 }} />
        )
      }
    </TableRow>
  );
}

TableNoData.propTypes = {
  notFound: PropTypes.bool,
  isLoading: PropTypes.bool,
  sx: PropTypes.object,
};
