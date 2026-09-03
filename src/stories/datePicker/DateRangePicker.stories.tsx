import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import moment from 'moment';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import RangePicker from 'src/components/dateRangePicker/DateRangePicker.tsx';

// ----------------------------------------------------------------------

interface DemoArgs {
  placeholder: string;
  fromDate: string;
  toDate: string;
}

const meta: Meta<DemoArgs> = {
  title: 'DatePickers/DateRangePicker',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placeholder: { control: 'text' },
    fromDate: { control: 'date' },
    toDate: { control: 'date' },
  },
  args: {
    placeholder: 'Izaberite period',
    fromDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
    toDate: moment().endOf('isoWeek').format('YYYY-MM-DD'),
  },
};

export default meta;

type Story = StoryObj<DemoArgs>;

function DateRangePickerDemo({ placeholder, fromDate, toDate }: DemoArgs) {
  const [applied, setApplied] = useState<string>('Nije još primenjeno');

  return (
    <Box sx={{ minWidth: 300 }}>
      <RangePicker
        placeholder={placeholder}
        fromDate={fromDate}
        toDate={toDate}
        onApply={(ranges: any) => {
          const { startDate, endDate } = ranges[0];
          setApplied(
            `${moment(startDate).format('DD.MM.YYYY')} - ${moment(endDate).format('DD.MM.YYYY')}`
          );
        }}
      />

      <Typography variant="body2" sx={{ mt: 2 }}>
        Primenjen period: <strong>{applied}</strong>
      </Typography>
    </Box>
  );
}

export const Default: Story = {
  render: (args) => <DateRangePickerDemo {...args} />,
};

export const CurrentMonth: Story = {
  args: {
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().endOf('month').format('YYYY-MM-DD'),
  },
  render: (args) => <DateRangePickerDemo {...args} />,
};

// ----------------------------------------------------------------------
// Mobilni prikaz (koristi DefinedRange komponentu umesto DateRangePicker)

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: (args) => <DateRangePickerDemo {...args} />,
};