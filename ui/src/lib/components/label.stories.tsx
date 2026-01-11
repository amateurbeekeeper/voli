import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { Input } from './input';

const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-2 w-[350px]">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="name@example.com" />
    </div>
  ),
};

export const WithRequired: Story = {
  render: () => (
    <div className="space-y-2 w-[350px]">
      <Label htmlFor="name">
        Name <span className="text-red-500">*</span>
      </Label>
      <Input id="name" placeholder="John Doe" required />
    </div>
  ),
};

export const MultipleLabels: Story = {
  render: () => (
    <div className="space-y-4 w-[350px]">
      <div className="space-y-2">
        <Label htmlFor="first-name">First Name</Label>
        <Input id="first-name" placeholder="John" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="last-name">Last Name</Label>
        <Input id="last-name" placeholder="Doe" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="john@example.com" />
      </div>
    </div>
  ),
};
