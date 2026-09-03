import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-interactions',
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: false,
      },
    },
  },

  docs: {
    autodocs: 'tag',
  },

  staticDirs: ['../public'],

  webpackFinal: async (config) => {
    config.module?.rules?.push({
      test: /yupSchema\.d\.ts$/,
      loader: 'ignore-loader',
    });

    return config;
  },
};

export default config;