import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from './toaster';
import { Button } from './button';
import { toast } from 'sonner';

const meta = {
  title: 'Components/Toaster',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToasterDemo = () => {
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
    </div>
  );
};

export const Default: Story = {
  render: () => <ToasterDemo />,
};
