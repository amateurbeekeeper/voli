import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
import { Button } from './button';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const OpportunityCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Environmental Cleanup</CardTitle>
        <CardDescription>Help clean up local parks</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Join us for a community park cleanup event. All supplies provided.
        </p>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">Environment</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">Community</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Apply Now</Button>
      </CardFooter>
    </Card>
  ),
};

