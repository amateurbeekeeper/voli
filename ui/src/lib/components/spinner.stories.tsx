import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Spinner />,
};

export const Large: Story = {
  render: () => <Spinner className="h-8 w-8" />,
};

export const Small: Story = {
  render: () => <Spinner className="h-3 w-3" />,
};
