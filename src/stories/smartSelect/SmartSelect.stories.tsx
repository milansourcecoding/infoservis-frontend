import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useDispatch } from 'react-redux';

import SelectAutocomplete from 'src/components/autocomplete/SelectAutocomplete.tsx';
import selectAutocompleteSlice from 'src/components/autocomplete/selectAutocompleteSlice.tsx';
import { AppDispatch } from 'src/utils/store.tsx';

// ----------------------------------------------------------------------

const meta: Meta<typeof SelectAutocomplete> = {
  title: 'Components/SmartSelect',
  component: SelectAutocomplete,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Ova komponenta gađa pravi API (`axios.get`) pri otvaranju. Bez backend-a, otvaranje dropdown-a će vratiti prazan spisak zbog neuspelog network poziva. "SeededWithMockData" story ručno postavlja opcije u store pre renderovanja, radi lakšeg vizuelnog pregleda.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SelectAutocomplete>;

export const Default: Story = {
  args: {
    label: 'Pretraga',
    path: 'https://api.infosistem.sourcecoding.rs/building',
    params: {
      page: 1,
      per_page: 20,
      search: null,
      is_active: 1,
      sortColumn: null,
      sortDir: null,
    },
    value: null,
    freeSolo: false,
    multiple: false,
    error: false,
    onChange: () => {},
    onInputChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: true,
  },
};