import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './slider';

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Slider defaultValue={[50]} max={100} step={1} className="w-[200px]" />,
};

export const Range: Story = {
  render: () => (
    <Slider defaultValue={[20, 80]} max={100} step={1} className="w-[200px]" />
  ),
};
