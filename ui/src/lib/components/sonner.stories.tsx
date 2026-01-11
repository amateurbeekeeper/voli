import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from './sonner';
import { Button } from './button';
import { toast } from 'sonner';

const meta = {
  title: 'Components/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster theme="light" />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

const SonnerDemo = () => {
  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        onClick={() => toast('Event has been created')}
      >
        Show Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success('Successfully saved!')}
      >
        Show Success Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error('Something went wrong')}
      >
        Show Error Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('New update available')}
      >
        Show Info Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning('Please check your input')}
      >
        Show Warning Toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
              loading: 'Loading...',
              success: 'Data loaded!',
              error: 'Error loading data',
            }
          )
        }
      >
        Show Promise Toast
      </Button>
    </div>
  );
};

export const Default: Story = {
  render: () => <SonnerDemo />,
};
