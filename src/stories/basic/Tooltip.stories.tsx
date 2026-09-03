import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    title: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const OnButton: Story = {
  args: {
    title: 'Sačuvaj izmene',
    placement: 'top',
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="contained">Sačuvaj</Button>
    </Tooltip>
  ),
};

export const OnIcon: Story = {
  args: {
    title: 'Dodatne informacije',
    placement: 'right',
  },
  render: (args) => (
    <Tooltip {...args}>
      <IconButton>
        <Icon icon={'mdi:calendar'} width={22} />
      </IconButton>
    </Tooltip>
  ),
};