import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';
import { Button } from './button';
import { useToast } from '../../hooks/use-toast';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToastDemo = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: 'Scheduled: Catch up',
            description: 'Friday, February 10, 2023 at 5:57 PM',
          });
        }}
      >
        Show Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.',
            variant: 'destructive',
          });
        }}
      >
        Show Destructive Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: 'Toast with action',
            description: 'This toast has an action button.',
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }}
      >
        Show Toast with Action
      </Button>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
      <ToastViewport />
    </ToastProvider>
  ),
};

export const Simple: Story = {
  render: () => (
    <ToastProvider>
      <Toast>
        <ToastTitle>Scheduled: Catch up</ToastTitle>
        <ToastDescription>Friday, February 10, 2023 at 5:57 PM</ToastDescription>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

export const Destructive: Story = {
  render: () => (
    <ToastProvider>
      <Toast variant="destructive">
        <ToastTitle>Error</ToastTitle>
        <ToastDescription>Something went wrong with your request.</ToastDescription>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};
