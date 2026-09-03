import type { Meta, StoryObj } from '@storybook/react';
import TextField from '@mui/material/TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/Input',
  component: TextField,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    label: 'Naziv',
    fullWidth: true,
    size: 'small',
    InputLabelProps: { shrink: true },
    placeholder: 'Unesite naziv',
  },
};

export const WithError: Story = {
  args: {
    label: 'Naziv',
    fullWidth: true,
    size: 'small',
    InputLabelProps: { shrink: true },
    error: true,
    helperText: 'Ovo polje je obavezno',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Naziv',
    fullWidth: true,
    size: 'small',
    InputLabelProps: { shrink: true },
    disabled: true,
    value: 'Ne može se menjati',
  },
};