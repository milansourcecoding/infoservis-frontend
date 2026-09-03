import type { Meta, StoryObj } from '@storybook/react';

import UploadField from '../../components/upload/uploadDialog/UploadField.tsx';

const meta: Meta<typeof UploadField> = {
  title: 'Upload/Inline',
  component: UploadField,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof UploadField>;

export const Default: Story = {
  args: {
    path: 'https://httpbin.org/post',
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
    },
    multiple: true,
    maxFileSize: 10 * 1024 * 1024,
    onSuccess: (data, state) => {
      console.log('Upload:', data, state);
    },
  },
};