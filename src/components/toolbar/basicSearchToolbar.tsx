/* eslint-disable import/order */
/* eslint-disable no-unneeded-ternary */
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Icon } from '@iconify/react';

import { useLocales } from 'src/locales';

// @mui
import {
  Stack,
  Grid,
  MenuItem,
  IconButton,
  Hidden,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { downloadPDF, viewPDF, downloadCSV, escapeChars, escapeCharsInStringOnPaste } from '../../utils/utils.tsx';

// Redux
import { useDispatch } from 'react-redux';
import { RootState, AppDispatch, useTypedSelector } from '../../utils/store.tsx';
import listSlice from '../../utils/slice/form/listSlice.tsx';

// ----------------------------------------------------------------------

export default function BasicSearchToolbar({ path, title, onSearch, extraFilterComponent, preFilterComponent, disabled = false }: any) {
  const { t } = useLocales();

  const popover = usePopover();

  const { search } = useTypedSelector((state: RootState) => state.listSlice);
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(search);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    dispatch(listSlice.changeSearch(inputValue));
  };


  return (
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-center', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        {preFilterComponent && <Grid item xs={'auto'}>{preFilterComponent}</Grid>}

        <Grid container spacing={2} alignItems={'center'}>
          <Grid item xs={9} sm={10} md={6} lg={5}>
            <TextField
              fullWidth
              size={'small'}
              value={search ? search : ''}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                escapeChars(e);
              }}
              onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                e.preventDefault();

                const pastedText = e.clipboardData.getData('text');
                const cleanedText = escapeCharsInStringOnPaste(pastedText);

                dispatch(listSlice.changeSearch(cleanedText));
              }}
              placeholder={t('search')}
              disabled={disabled}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon={'eva:search-fill'} color={'text.disabled'} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {extraFilterComponent && <Grid item xs={9} sm={10} md={3}>{extraFilterComponent}</Grid>}

          <Hidden xsDown>
            <Grid item xs />
          </Hidden>
          <Grid item xs={'auto'}>
            <IconButton disabled={disabled} onClick={popover.onOpen}>
              <Icon icon={'eva:more-vertical-fill'} />
            </IconButton>
          </Grid>
        </Grid>

        <CustomPopover
          hiddenArrow
          open={popover.open}
          onClose={popover.onClose}
          arrow="right-top"
          sx={null}
        >
          <MenuItem
            onClick={() => {
              popover.onClose();

              const params: any = { title, orientation: 'portrait', ids: null };
              dispatch(listSlice.calGeneratePDFApi(params, path, (_data: any|null, _state: boolean|null) => {
                if(_state){
                  viewPDF(_data);
                }
              }))
            }}
          >
            <Icon icon={'solar:printer-minimalistic-bold'} />
            {t('buttons.printAll')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();

              const params: any = { title, ids: null };
              dispatch(listSlice.calGenerateCSVApi(params, path, (_data: any|null, _state: boolean|null) => {
                if(_state){
                  downloadCSV(title, _data);
                }
              }))
            }}
          >
            <Icon icon={'ph:file-csv-bold'} />
            {t('buttons.exportAllCSV')}
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();

              const params: any = { title, orientation: 'portrait', ids: null };
              dispatch(listSlice.calGeneratePDFApi(params, path, (_data: any|null, _state: boolean|null) => {
                if(_state){
                  downloadPDF(title, _data);
                }
              }))
            }}
          >
            <Icon icon={'ph:file-pdf-bold'} />
            {t('buttons.exportAllPdf')}
          </MenuItem>

          {/* <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Icon icon={'solar:import-bold'} />
            {t('buttons.import')}
          </MenuItem> */}
        </CustomPopover>
      </Stack>
  );
}

BasicSearchToolbar.propTypes = {
  path: PropTypes.string,
  title: PropTypes.string,
  onSearch: PropTypes.func,
  extraFilterComponent: PropTypes.element,
  preFilterComponent: PropTypes.element,
  disabled: PropTypes.bool,
};
