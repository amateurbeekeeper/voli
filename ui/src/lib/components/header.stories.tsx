import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './header';

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Header />,
};

export const WithNav: Story = {
  render: () => (
    <Header
      navItems={[
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ]}
    />
  ),
};

export const CustomLogo: Story = {
  render: () => (
    <Header logo={<span className="text-xl font-bold">My App</span>} />
  ),
};
