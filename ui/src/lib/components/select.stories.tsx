import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Label } from './label';

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[200px] space-y-2">
      <Label htmlFor="email">Email</Label>
      <Select>
        <SelectTrigger id="email">
          <SelectValue placeholder="Select an email" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="m@example.com">m@example.com</SelectItem>
          <SelectItem value="m@google.com">m@google.com</SelectItem>
          <SelectItem value="m@support.com">m@support.com</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
