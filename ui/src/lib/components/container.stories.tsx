import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './container';

const meta = {
  title: 'Components/Container',
  component: Container,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Container content',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small container content',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium container content',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large container content',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Extra large container content',
  },
};

export const Full: Story = {
  args: {
    size: 'full',
    children: 'Full width container content',
  },
};
