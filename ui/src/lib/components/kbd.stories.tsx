import type { Meta, StoryObj } from '@storybook/react';
import { Kbd, KbdGroup } from './kbd';

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to open command menu
      </div>
      <div className="flex items-center gap-2">
        Press <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>P</Kbd>
        </KbdGroup> for settings
      </div>
      <div className="flex items-center gap-2">
        Press <Kbd>Ctrl</Kbd> + <Kbd>Alt</Kbd> + <Kbd>Del</Kbd>
      </div>
    </div>
  ),
};
