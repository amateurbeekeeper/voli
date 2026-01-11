import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4 w-[350px]">
      <p className="text-sm">Above</p>
      <Separator />
      <p className="text-sm">Below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-20">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="border rounded-lg p-6 w-[350px] space-y-4">
      <h3 className="font-semibold">Section Title</h3>
      <Separator />
      <p className="text-sm text-gray-600">
        This is content separated by a divider.
      </p>
    </div>
  ),
};
