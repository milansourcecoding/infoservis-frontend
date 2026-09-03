import type { Meta, StoryObj } from '@storybook/react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'error', 'info', 'warning'],
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
    },
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

type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    label: 'Aktivan',
    color: 'default',
    variant: 'filled',
    size: 'small',
  },
};

export const Statuses: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <Chip label="Aktivan" color="success" size="small" />
      <Chip label="Na čekanju" color="warning" size="small" />
      <Chip label="Neaktivan" color="default" size="small" />
      <Chip label="Otkazan" color="error" size="small" />
    </Stack>
  ),
};

export const Deletable: Story = {
  args: {
    label: 'Filter: Niš',
    color: 'primary',
    variant: 'outlined',
    size: 'small',
    onDelete: () => {},
  },
};