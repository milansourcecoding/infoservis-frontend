import React from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type DatePickerProps = {
  label?: string;
  value?: string | Date | Dayjs | null;
  onChange?: (date: Dayjs | null) => void;
  disabled?: boolean;
  minDate?: string | Date | Dayjs;
  maxDate?: string | Date | Dayjs;
};

const DatePicker = ({
  label = 'Select date',
  value,
  onChange,
  disabled = false,
  minDate,
  maxDate,
}: DatePickerProps) => {
  const parsedValue = value ? dayjs(value) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        label={label}
        value={parsedValue}
        onChange={(newValue) => {
          if (onChange) {
            onChange(newValue);
          }
        }}
        disabled={disabled}
        minDate={minDate ? dayjs(minDate) : undefined}
        maxDate={maxDate ? dayjs(maxDate) : undefined}
        format="DD-MM-YYYY"
        slotProps={{
          textField: {
            fullWidth: true,
            size: 'small',
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;