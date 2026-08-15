/* eslint-disable no-shadow */
/* eslint-disable object-shorthand */
/* eslint-disable react/jsx-fragments */
/* eslint-disable arrow-body-style */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/order */
/* eslint-disable prefer-const */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-template */
/* eslint-disable no-lonely-if */
import React from 'react';
import { Icon } from '@iconify/react';
import moment from 'moment';


import { useLocales } from 'src/locales';
// import { useBoolean } from 'src/hooks/use-boolean';

// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
// import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import TextField from '@mui/material/TextField';
// import FormControl from '@mui/material/FormControl';
// import FormHelperText from '@mui/material/FormHelperText';
// import InputLabel from '@mui/material/InputLabel';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
// import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
// import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// components
import { useSnackbar } from 'src/components/snackbar';
import Block from 'src/components/block/block';
import { ConfirmDialog } from 'src/components/custom-dialog';
// import DropdownAutocomplete from 'src/components/autocomplete/DropdownAutocomplete.tsx';
// import SelectAutocomplete from 'src/components/autocomplete/SelectAutocomplete.tsx';

// Redux
import { useDispatch } from 'react-redux';
import { AppDispatch, useTypedSelector } from '../../../utils/store.tsx';
import slice, { name as sliceName } from './slice.tsx';
// import selectAutocompleteSlice from '../../components/autocomplete/selectAutocompleteSlice.tsx';

import { apiDateFormat, saveDate } from '../../../utils/utils.tsx';
// import {  } from '../../../utils/enums.tsx';

// ----------------------------------------------------------------------

const StyledList = styled(List)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,

  '& .list-all-only': {
    display: 'none',
  },

  '& .MuiListItem-root:hover .list-all-only': {
    display: 'block',
  },
}));


export default function Form(props: any) {
  const { t } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, show, isLoadingGenerate, items, checked, selectedDate, progress } = useTypedSelector((state: any) => state[sliceName]);

  const [open, setOpen] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);


  React.useEffect(() => {
    if(show){
      let params = {
        is_active: true
      };
      dispatch(slice.callReadApi(params, (state: boolean, data: any, message: string) => {}));
    }
  }, [show]);


  const onSubmit = () => {
    if(checked && checked.length > 0){
      setOpen(true)
    }
  }
  const onCancel = () => {
    setOpen(false)
    dispatch(slice.setShow({ show: false }));
    dispatch(slice.resetSlice());
  }


  const footer = () => {
    return <>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FormControlLabel
          sx={{
            m: 0,
            '& .MuiFormControlLabel-label': {
              fontSize: '12px',
              userSelect: 'none',
              cursor: 'pointer',
            },
          }}
          control={
            <Checkbox
              size="small"
              checked={checked.length === items.length && items.length > 0}
              indeterminate={
                checked.length > 0 &&
                checked.length < items.length
              }
              onChange={(event) => {
                dispatch(
                  slice.setCheckedAll(
                    event.target.checked
                      ? items.map((itm: any) => itm.id)
                      : []
                  )
                );
              }}
            />
          }
          label={(checked.length === items.length && items.length > 0) ? t('buttons.deselectAll') : t('buttons.selectAll')}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
        >
          {t('buttons.cancel')}
        </Button>

        <LoadingButton
          variant="contained"
          loading={isLoading}
          disabled={checked.length <= 0}
          onClick={onSubmit}
        >
          {t('buttons.generate')}
          {checked.length > 0 ? ` (${checked.length})` : ''}
        </LoadingButton>
      </Box>
    </>
  }

  const form = () => {
    return <React.Fragment>
      <StyledList dense>
        {items.map((itm: any, i: number) => {
          return <ListItem key={'bulkinv_itm_' + i}>
            <ListItemButton
              onClick={(e: any) => {
                e.stopPropagation();
                e.preventDefault();

                dispatch(slice.setChecked(itm?.id));
              }}
            >
              <Checkbox
                edge="start"
                checked={checked.includes(itm?.id)}
                tabIndex={-1}
                disableRipple
                style={{ marginRight: '12px' }}
              />
              <ListItemText
                primary={itm?.name || ''}
                secondary={itm?.city || ''}
                primaryTypographyProps={{ typography: 'body2' }}
                secondaryTypographyProps={{
                  component: 'span',
                  color: 'text.disabled',
                }}
              />
              <Link
                href={'/building/' + (itm?.id ?? '')}
                target="_blank"
                rel="noopener noreferrer"
                variant="caption"
                color="text.disabled"
                onClick={(e: any) => {
                  e.stopPropagation();
                }}
              >
                {t('buttons.details')}
              </Link>
            </ListItemButton>
          </ListItem>
        })}
      </StyledList>
    </React.Fragment>
  }


  return <Drawer
    anchor={'right'}
    open={show}
    onClose={() => {
      onCancel();
    }}
    PaperProps={{
      sx: {
        width: {
          xs: '100%',
          md: '22%',
        },
        backgroundColor: 'white'
      },
    }}
  >
    <Box sx={{
        position: 'sticky',
        top: '0px',
        zIndex: 2,
        margin: '0px',
      }}
    >
      <DialogTitle>
        <div>{t('buttons.generateInvoices')}</div>
        <div style={{ fontWeight: 'lighter', fontSize: '12px' }}>{t('building.form.generateInvoicesDesc')}</div>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => {
          onCancel();
        }}
        sx={{
          position: 'absolute',
          right: 12,
          top: 18,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Icon icon={'system-uicons:close'} />
      </IconButton>
      <Divider />
    </Box>

    <DialogContent sx={{ backgroundColor: 'white', paddingLeft: '0px', paddingRight: '0px' }}>
      <Box sx={{ mt: 3, mb: 3, paddingBottom: '50px', marginTop: '0px',  height: 'calc(100vh - 206px)' }}>
        {
          isLoading
          ?
          <div style={{ textAlign: 'center', marginTop: '16px' }}><small>{t('table.loading')}</small></div>
          :
            (items && items.length > 0)
            ?
            <>{form()}</>
            :
            <div style={{ textAlign: 'center', marginTop: '16px' }}><small>{t('table.noData')}</small></div>
        }
      </Box>
    </DialogContent>

    <Box sx={{
        position: 'sticky',
        bottom: '0px',
        width: '100%',
        zIndex: 2,
        margin: '0px',
      }}
    >
      <Divider />
      <DialogActions>{footer()}</DialogActions>
    </Box>

    <ConfirmDialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      PaperProps={{
        sx: {
          width: '270px',
        },
      }}
      disabledCancel={isLoadingGenerate}
      disableBackdropClick={isLoadingGenerate}
      title={t('buttons.generateInvoices')}
      content={<>
        {
          isLoadingGenerate
          ?
          <div>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ flex: 1 }}
              />

              <Box sx={{ minWidth: 35, fontSize: '12px' }}>
                {progress}%
              </Box>
            </Box>
          </div>
          :
          <>
            <div>{isLoadingGenerate ? t('table.loading') : t('building.form.selectMonth')}</div>
            <div>
              <DatePicker
                views={['year', 'month']}
                openTo="month"
                open={datePickerOpen}
                onOpen={() => setDatePickerOpen(true)}
                onClose={() => setDatePickerOpen(false)}
                disabled={isLoadingGenerate}
                value={moment(selectedDate, apiDateFormat()).toDate()}
                onChange={(newValue) => {
                  dispatch(
                    slice.setSelectedDate(
                      newValue ? moment(newValue).endOf('month').format(apiDateFormat()) : null
                    )
                  );

                  setDatePickerOpen(false);
                }}
                slotProps={{
                  field: {
                    readOnly: true,
                  },
                  textField: {
                    size: 'small',
                    onClick: () => {
                      if (!isLoadingGenerate) {
                        setDatePickerOpen(true);
                      }
                    },
                    sx: {
                      '& .MuiInputBase-root': {
                        height: 40,
                        cursor: 'pointer',
                      },
                      '& input': {
                        userSelect: 'none',
                        cursor: 'pointer',
                      },
                    },
                  },
                }}
              />
            </div>
          </>
        }
      </>}
      action={
        <LoadingButton color="inherit" variant="contained" loading={isLoadingGenerate} disabled={selectedDate == null}
          onClick={(e: any) => {
            e.stopPropagation();
            e.preventDefault();

            let dataParams = {
              ids: (checked && checked.length > 0) ? checked.join(',') : '',
              date: saveDate(selectedDate),
            }
            dispatch(slice.callGenerateApi(dataParams, (state: boolean, data: any, message: string) => {
              if(state){
                if(message && message != ''){
                  enqueueSnackbar(message, { variant: state ? 'success' : 'error' });
                }

                onCancel();
              } else {
                if(message && message != ''){
                  enqueueSnackbar(message, { variant: 'error' });
                }
              }
            }));
          }}
        >
          {t('buttons.generate')}
        </LoadingButton>
      }
    />
    
    <Block isLoading={isLoading} />
  </Drawer>
}
