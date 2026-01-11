import type { Meta, StoryObj } from '@storybook/react';
import { Hero } from './hero';
import { Button } from './button';
import { Badge } from './badge';

const meta = {
  title: 'Components/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Build amazing things',
    description: 'Start building your next project with our powerful tools and resources.',
  },
};

export const WithActions: Story = {
  args: {
    title: 'Build amazing things',
    description: 'Start building your next project with our powerful tools and resources.',
    actions: (
      <>
        <Button>Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </>
    ),
  },
};

export const WithBadge: Story = {
  args: {
    title: 'Build amazing things',
    description: 'Start building your next project with our powerful tools and resources.',
    badge: <Badge>New</Badge>,
    actions: (
      <>
        <Button>Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </>
    ),
  },
};
