import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import dayjs, { Dayjs } from 'dayjs';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';

import DatePicker from 'src/components/datePicker/DatePicker.tsx';

// ----------------------------------------------------------------------

interface DemoArgs {
  label: string;
  disabled: boolean;
  hasMinDate: boolean;
  hasMaxDate: boolean;
}

const meta: Meta<DemoArgs> = {
  title: 'DatePickers/DatePicker',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    hasMinDate: { control: 'boolean' },
    hasMaxDate: { control: 'boolean' },
  },
  args: {
    label: 'Izaberite datum',
    disabled: false,
    hasMinDate: false,
    hasMaxDate: false,
  },
};

export default meta;

type Story = StoryObj<DemoArgs>;

function DatePickerDemo({ label, disabled, hasMinDate, hasMaxDate }: DemoArgs) {
  const [value, setValue] = useState<Dayjs | null>(null);

  return (
    <div style={{ width: 260 }}>
      <DatePicker
        label={label}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        disabled={disabled}
        minDate={hasMinDate ? dayjs() : undefined}
        maxDate={hasMaxDate ? dayjs().add(30, 'day') : undefined}
      />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <DatePickerDemo {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <DatePickerDemo {...args} />,
};

export const WithMinMaxDate: Story = {
  args: { hasMinDate: true, hasMaxDate: true, label: 'Datum rezervacije' },
  render: (args) => <DatePickerDemo {...args} />,
};

// ----------------------------------------------------------------------
// Primer sa opsegom (start / end date), kao u realnoj formi

function DateRangeDemo() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  return (
    <Grid container spacing={2} sx={{ width: 500 }}>
      <Grid item xs={12} md={6}>
        <DatePicker
          label="Datum početka"
          value={startDate}
          maxDate={endDate ?? undefined}
          onChange={(date) => {
            setStartDate(date ? date.format('YYYY-MM-DD') : null);
            setShowError(!date);
          }}
        />
        {showError && (
          <FormHelperText error>Ovo polje je obavezno</FormHelperText>
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        <DatePicker
          label="Datum završetka"
          value={endDate}
          minDate={startDate ?? undefined}
          onChange={(date) => setEndDate(date ? date.format('YYYY-MM-DD') : null)}
        />
      </Grid>
    </Grid>
  );
}

export const DateRange: Story = {
  render: () => <DateRangeDemo />,
};