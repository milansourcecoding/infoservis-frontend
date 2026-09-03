import type { Meta, StoryObj } from '@storybook/react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
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

type Story = StoryObj<typeof Radio>;

export const Single: Story = {
  args: {
    size: 'small',
  },
  render: (args) => (
    <FormControlLabel control={<Radio {...args} />} label="Opcija 1" />
  ),
};

export const Group: Story = {
  render: () => (
    <FormControl>
      <FormLabel>Način plaćanja</FormLabel>
      <RadioGroup defaultValue="cash" name="payment-method">
        <FormControlLabel value="cash" control={<Radio size="small" />} label="Gotovina" />
        <FormControlLabel value="card" control={<Radio size="small" />} label="Kartica" />
        <FormControlLabel value="transfer" control={<Radio size="small" />} label="Transfer" />
      </RadioGroup>
    </FormControl>
  ),
};

export const Disabled: Story = {
  args: {
    size: 'small',
    disabled: true,
  },
  render: (args) => (
    <FormControlLabel control={<Radio {...args} />} label="Nedostupno" />
  ),
};