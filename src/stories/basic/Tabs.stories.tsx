import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface DemoArgs {
  variant: 'standard' | 'scrollable' | 'fullWidth';
}

const meta: Meta<DemoArgs> = {
  title: 'Components/Tabs',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['standard', 'scrollable', 'fullWidth'],
    },
  },
  args: {
    variant: 'standard',
  },
};

export default meta;

type Story = StoryObj<DemoArgs>;

function TabsDemo({ variant }: DemoArgs) {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ width: 400 }}>
      <Tabs value={tab} variant={variant} onChange={(_, v) => setTab(v)}>
        <Tab label="Opšte" />
        <Tab label="Dokumenti" />
        <Tab label="Istorija" />
      </Tabs>
      <Box sx={{ p: 2 }}>
        {tab === 0 && 'Sadržaj tab-a: Opšte'}
        {tab === 1 && 'Sadržaj tab-a: Dokumenti'}
        {tab === 2 && 'Sadržaj tab-a: Istorija'}
      </Box>
    </Box>
  );
}

export const Default: Story = {
  render: (args) => <TabsDemo {...args} />,
};