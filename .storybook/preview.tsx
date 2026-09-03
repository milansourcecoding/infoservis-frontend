import type { Preview } from '@storybook/react';

import { Provider } from 'react-redux';

import '../src/locales/i18n';

import ThemeProvider from '../src/theme';
import { LocalizationProvider } from '../src/locales';
import { MotionLazy } from '../src/components/animate/motion-lazy';
import SnackbarProvider from '../src/components/snackbar/snackbar-provider';
import { SettingsProvider } from '../src/components/settings';

import { store } from '../src/utils/store.tsx';


const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story: any) => (
      <LocalizationProvider>
        <SettingsProvider
          defaultSettings={{
            themeMode: 'light',
            themeDirection: 'ltr',
            themeContrast: 'default',
            themeLayout: 'vertical',
            themeColorPresets: 'default',
            themeStretch: true,
          }}
        >
          <ThemeProvider>
            <MotionLazy>
              <SnackbarProvider>
                <Provider store={store}>
                  <Story />
                </Provider>
              </SnackbarProvider>
            </MotionLazy>
          </ThemeProvider>
        </SettingsProvider>
      </LocalizationProvider>
    ),
  ],
};

export default preview;
