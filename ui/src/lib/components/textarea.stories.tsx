import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';
import { Label } from './label';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="message-disabled">Your message</Label>
      <Textarea
        placeholder="Type your message here."
        id="message-disabled"
        disabled
      />
    </div>
  ),
};
