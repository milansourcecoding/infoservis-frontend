import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

import DropdownAutocomplete from 'src/components/autocomplete/DropdownAutocomplete.tsx';

// ----------------------------------------------------------------------

const MOCK_CITIES = [
  { id: 1, name: 'Niš' },
  { id: 2, name: 'Beograd' },
  { id: 3, name: 'Novi Sad' },
  { id: 4, name: 'Kragujevac' },
  { id: 5, name: 'Subotica' },
];

interface DemoArgs {
  error: boolean;
  label: string;
  multiple: boolean;
  freeSolo: boolean;
  disableClearable: boolean;
  initialValue: string;
}

const meta: Meta<DemoArgs> = {
  title: 'Components/SmartDropdown',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    error: { control: 'boolean' },
    label: { control: 'text' },
    multiple: { control: 'boolean' },
    freeSolo: { control: 'boolean' },
    disableClearable: { control: 'boolean' },
    initialValue: {
      control: 'select',
      options: ['', ...MOCK_CITIES.map((c) => c.name)],
      description: 'Koristi se samo kad multiple = false',
    },
  },
  args: {
    error: false,
    label: 'Grad',
    multiple: false,
    freeSolo: false,
    disableClearable: true,
    initialValue: '',
  },
};

export default meta;

type Story = StoryObj<DemoArgs>;

function DropdownAutocompleteDemo({
  error,
  label,
  multiple,
  freeSolo,
  disableClearable,
  initialValue,
}: DemoArgs) {
  const [value, setValue] = useState<any>(
    multiple ? [] : MOCK_CITIES.find((c) => c.name === initialValue) || null
  );

  useEffect(() => {
    setValue(
      multiple ? [] : MOCK_CITIES.find((c) => c.name === initialValue) || null
    );
  }, [initialValue, multiple]);

  return (
    <FormControl fullWidth error={error} sx={{ width: 320 }}>
      <DropdownAutocomplete
        freeSolo={freeSolo}
        multiple={multiple}
        disableClearable={disableClearable}
        labelField="name"
        label={label}
        options={MOCK_CITIES}
        value={value}
        onChange={(e: any, v: any) => {
          e.preventDefault();
          e.stopPropagation();
          setValue(v);
        }}
        onInputChange={() => {}}
        error={error}
      />
      <FormHelperText>{error ? 'Ovo polje je obavezno' : ''}</FormHelperText>
    </FormControl>
  );
}

export const Default: Story = {
  render: (args) => <DropdownAutocompleteDemo {...args} />,
};

export const WithValue: Story = {
  args: {
    initialValue: 'Niš',
  },
  render: (args) => <DropdownAutocompleteDemo {...args} />,
};

export const WithError: Story = {
  args: {
    error: true,
  },
  render: (args) => <DropdownAutocompleteDemo {...args} />,
};

export const Multiple: Story = {
  args: {
    multiple: true,
    disableClearable: false,
    label: 'Gradovi',
  },
  render: (args) => <DropdownAutocompleteDemo {...args} />,
};