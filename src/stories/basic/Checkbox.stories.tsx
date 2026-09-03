import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    disabled: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    size: 'small',
  },
  render: (args) => (
    <FormControlLabel control={<Checkbox {...args} />} label="Prihvatam uslove" />
  ),
};

export const Checked: Story = {
  args: {
    size: 'small',
    defaultChecked: true,
  },
  render: (args) => (
    <FormControlLabel control={<Checkbox {...args} />} label="Prihvatam uslove" />
  ),
};

function IndeterminateCheckboxDemo() {
  const items = [1, 2, 3];
  const [checked, setChecked] = useState<number[]>([1]);

  return (
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
          indeterminate={checked.length > 0 && checked.length < items.length}
          onChange={(e) => setChecked(e.target.checked ? items : [])}
        />
      }
      label={
        checked.length === items.length && items.length > 0
          ? 'Poništi sve'
          : 'Izaberi sve'
      }
    />
  );
}

export const Indeterminate: Story = {
  render: () => <IndeterminateCheckboxDemo />,
};

export const Disabled: Story = {
  args: {
    size: 'small',
    disabled: true,
  },
  render: (args) => (
    <FormControlLabel control={<Checkbox {...args} />} label="Nedostupno" />
  ),
};