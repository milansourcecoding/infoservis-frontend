/* eslint-disable no-empty-pattern */
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
import { useState } from 'react';

// @mui
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

interface CustomProps {
  options: any,
  freeSolo: boolean,
  multiple: boolean,
  disableClearable: boolean,
  label: string,
  labelField?: string,
  value: any,
  error?: boolean,
  onChange: (e: any, value: any) => void,
  onInputChange: (e: any, value: any) => void,
}


export default function DropdownAutocomplete({
  options = null,
  freeSolo = false,
  multiple = false,
  disableClearable = false,
  label = '',
  labelField = 'value',
  value = null,
  error = false,
  onChange,
  onInputChange,
}: CustomProps) {
  const [isOpen, setOpen] = useState(false);


  return (
    <Autocomplete
      freeSolo={freeSolo}
      multiple={multiple}
      disableClearable={disableClearable}
      size={'small'}

      open={isOpen}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      loading={false}

      options={options}
      isOptionEqualToValue={(o, v) => o[labelField] === v[labelField]}
      value={value}
      onChange={(e, v) => {
        onChange(e, v);
      }}
      onInputChange={async (e, v) => {
        if(e && e.type == 'change'){
          onInputChange(e, v);
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
        InputLabelProps={{ shrink: true }}
        error={error}
      />}
    />
  );
}
