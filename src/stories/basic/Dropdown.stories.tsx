import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';

const OPTIONS = [
  { value: 'active', label: 'Aktivan' },
  { value: 'inactive', label: 'Neaktivan' },
  { value: 'pending', label: 'Na čekanju' },
];

interface DemoArgs {
  label: string;
  error: boolean;
  disabled: boolean;
  size: 'small' | 'medium';
}

const meta: Meta<DemoArgs> = {
  title: 'Components/Dropdown',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
  },
  args: {
    label: 'Status',
    error: false,
    disabled: false,
    size: 'small',
  },
};

export default meta;

type Story = StoryObj<DemoArgs>;

function SelectDemo({ label, error, disabled, size }: DemoArgs) {
  const [value, setValue] = useState('active');

  return (
    <FormControl fullWidth error={error} disabled={disabled} sx={{ width: 260 }}>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        label={label}
        size={size}
        value={value}
        notched
        onChange={(e) => setValue(e.target.value)}
      >
        {OPTIONS.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{error ? 'Ovo polje je obavezno' : ''}</FormHelperText>
    </FormControl>
  );
}

export const Default: Story = {
  render: (args) => <SelectDemo {...args} />,
};

export const WithError: Story = {
  args: { error: true },
  render: (args) => <SelectDemo {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <SelectDemo {...args} />,
};