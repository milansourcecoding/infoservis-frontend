import type { Meta, StoryObj } from '@storybook/react';

import Button from '@mui/material/Button';

import Form from '../../components/upload/uploadDialog/form.tsx';
import uploadDialogSlice from '../../components/upload/uploadDialog/slice.tsx';

import { store } from '../../utils/store.tsx';

const meta: Meta<typeof Form> = {
  title: 'Upload/Dialog',
  component: Form,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
  args: {
    path: 'https://httpbin.org/post',
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
    multiple: false,
    numOfFiles: null,
    maxFileSize: 5 * 1024 * 1024,
    onSuccess: (data, state) => {
      console.log('Upload Dialog:', data, state);
    },
  },
  render: (args) => (
    <>
      <Button
        variant="contained"
        onClick={() => {
          store.dispatch(
            uploadDialogSlice.setShow({
              show: true,
            })
          );
        }}
      >
        Upload Dialog
      </Button>

      <Form {...args} />
    </>
  ),
};