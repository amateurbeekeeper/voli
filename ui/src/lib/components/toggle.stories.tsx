import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './toggle';
import { Bold } from 'lucide-react';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle italic">
      <Bold />
    </Toggle>
  ),
};

export const WithText: Story = {
  render: () => (
    <Toggle aria-label="Toggle italic">
      <Bold />
      Bold
    </Toggle>
  ),
};

export const Outline: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle italic">
      <Bold />
      Bold
    </Toggle>
  ),
};

export const Pressed: Story = {
  render: () => (
    <Toggle aria-label="Toggle italic" pressed>
      <Bold />
    </Toggle>
  ),
};
