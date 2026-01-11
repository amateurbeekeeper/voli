import type { Meta, StoryObj } from '@storybook/react';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './empty';
import { Button } from './button';
import { Inbox } from 'lucide-react';

const meta = {
  title: 'Components/Empty',
  component: Empty,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Empty className="w-[400px]">
      <EmptyHeader>
        <EmptyMedia>
          <Inbox className="h-12 w-12" />
        </EmptyMedia>
        <EmptyTitle>No messages</EmptyTitle>
        <EmptyDescription>
          You don&apos;t have any messages yet. Start a conversation to get started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Send message</Button>
      </EmptyContent>
    </Empty>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Empty className="w-[400px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox className="h-6 w-6" />
        </EmptyMedia>
        <EmptyTitle>No items found</EmptyTitle>
        <EmptyDescription>
          Try adjusting your search or filter to find what you&apos;re looking for.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">Clear filters</Button>
      </EmptyContent>
    </Empty>
  ),
};
