import type { Meta, StoryObj } from '@storybook/react';
import Button from '@mui/material/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'outlined', 'contained'],
    },
    color: {
      control: 'select',
      options: ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    variant: 'contained',
    color: 'inherit',
    size: 'medium',
    children: 'Text',
  },
};