import type { Meta, StoryObj } from '@storybook/react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  argTypes: {
    severity: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
    },
    variant: {
      control: 'select',
      options: ['standard', 'filled', 'outlined'],
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    severity: 'info',
    variant: 'standard',
    children: 'Ovo je informativna poruka.',
  },
};

export const AllSeverities: Story = {
  render: () => (
    <Stack spacing={1} sx={{ width: 360 }}>
      <Alert severity="success">Uspešno sačuvano.</Alert>
      <Alert severity="info">Napomena za korisnika.</Alert>
      <Alert severity="warning">Proverite unete podatke.</Alert>
      <Alert severity="error">Greška prilikom čuvanja.</Alert>
    </Stack>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <Alert severity="error" sx={{ width: 360 }}>
      <AlertTitle>Greška</AlertTitle>
      Nije moguće sačuvati podatke — proverite obavezna polja.
    </Alert>
  ),
};