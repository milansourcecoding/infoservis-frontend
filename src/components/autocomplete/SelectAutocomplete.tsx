/* eslint-disable react/jsx-boolean-value */
/* eslint-disable arrow-body-style */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/order */
/* eslint-disable prefer-const */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-template */
import { useState, useEffect, useMemo } from 'react';

// @mui
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { debounce } from '@mui/material/utils';

// Redux
import { useDispatch } from 'react-redux';
import { RootState, AppDispatch, useTypedSelector } from '../../utils/store.tsx';
import selectAutocompleteSlice, { ApiCallParams } from './selectAutocompleteSlice.tsx';

// ----------------------------------------------------------------------

interface CustomProps {
  error: boolean,
  freeSolo: boolean,
  multiple?: boolean,
  label: string,
  labelField?: string,
  path: string,
  params: ApiCallParams|null
  value: any,
  onChange: (e: any, value: any) => void,
  onInputChange: (e: any, value: any) => void,
}


export default function SelectAutocomplete({
  error = false,
  freeSolo = false,
  multiple = false,
  label = '',
  labelField = 'naziv',
  path = '',
  params = null,
  value = null,
  onChange,
  onInputChange,
}: CustomProps) {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { options } = useTypedSelector((state: RootState) => state.selectAutocompleteSlice);
  const dispatch = useDispatch<AppDispatch>();

  const fetch = useMemo(
    () =>
      debounce(async (v) => {
        let newParams: any = { ...params, search: v };
        await dispatch(selectAutocompleteSlice.calReadApi(path, newParams));
        setLoading(false)
      },
      400
    ),
    [],
  );


  useEffect(() => {
    if (!isOpen) {
      dispatch(selectAutocompleteSlice.setOptions([]));
    }
  }, [isOpen]);


  return (
    <Autocomplete
      freeSolo={freeSolo}
      multiple={multiple}
      disableCloseOnSelect={multiple ? true : false}
      size={'small'}

      open={isOpen}
      onOpen={async () => {
        setOpen(true);
        setLoading(true);
        await dispatch(selectAutocompleteSlice.calReadApi(path, params));
        setLoading(false);
      }}
      onClose={() => {
        setOpen(false);
        setLoading(false);
      }}
      loading={isLoading}

      options={options}
      isOptionEqualToValue={(o, v) => o?.[labelField] === v?.[labelField]}
      value={value}
      onChange={(e, v) => {
        onChange(e, v);
      }}
      onInputChange={async (e, v) => {
        if(e && e.type == 'change'){
          onInputChange(e, v);

          if(isOpen){
            dispatch(selectAutocompleteSlice.setOptions([]));
            setLoading(true)
            fetch(v);
          }
        }
      }}

      getOptionLabel={(o: any) => {
        if (typeof o === 'string') {
          return o;
        }

        if (o.inputValue) {
          return o.inputValue;
        }

        return o[labelField];
      }}

      renderInput={(p: any) => <TextField
        {...p}
        label={label}
        InputLabelProps={{
          ...p.InputProps,
          shrink: true,
          className: error ? 'Mui-error' : '',
        }}
        InputProps={{
          ...p.InputProps,
          className: error ? (p?.InputProps?.className || '') + ' Mui-error' : (p?.InputProps?.className || ''),
          endAdornment: (
            <>
              {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
              {p.InputProps.endAdornment}
            </>
          ),
        }}
      />}
    />
  );
}
