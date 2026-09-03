import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import dayjs, { Dayjs } from 'dayjs';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// ----------------------------------------------------------------------

const meta: Meta = {
  title: 'DatePickers/DateTimePickers',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Story />
      </LocalizationProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj;

// ----------------------------------------------------------------------
// Month picker (godina + mesec, bez dana)

function MonthPickerDemo() {
  const [value, setValue] = useState<Dayjs | null>(dayjs());

  return (
    <DatePicker
      label="Izaberite mesec"
      views={['year', 'month']}
      openTo="month"
      value={value}
      onChange={(newValue) => setValue(newValue)}
      format="MMMM YYYY"
      slotProps={{
        textField: {
          fullWidth: true,
          size: 'small',
        },
      }}
    />
  );
}

export const MonthPicker: Story = {
  render: () => <MonthPickerDemo />,
};

// ----------------------------------------------------------------------
// Samo vreme (bez datuma)

function TimePickerDemo() {
  const [value, setValue] = useState<Dayjs | null>(dayjs());

  return (
    <TimePicker
      label="Izaberite vreme"
      value={value}
      onChange={(newValue) => setValue(newValue)}
      ampm={false}
      slotProps={{
        textField: {
          fullWidth: true,
          size: 'small',
        },
      }}
    />
  );
}

export const TimePickerOnly: Story = {
  render: () => <TimePickerDemo />,
};

// ----------------------------------------------------------------------
// Datum + vreme zajedno

function DateAndTimePickerDemo() {
  const [value, setValue] = useState<Dayjs | null>(dayjs());

  return (
    <DateTimePicker
      label="Izaberite datum i vreme"
      value={value}
      onChange={(newValue) => setValue(newValue)}
      ampm={false}
      format="DD-MM-YYYY HH:mm"
      slotProps={{
        textField: {
          fullWidth: true,
          size: 'small',
        },
      }}
    />
  );
}

export const DateAndTime: Story = {
  render: () => <DateAndTimePickerDemo />,
};