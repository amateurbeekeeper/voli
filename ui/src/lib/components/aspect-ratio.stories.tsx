import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './aspect-ratio';

const meta = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AspectRatio ratio={16 / 9} className="bg-muted w-[400px] rounded-md overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        alt="Photo"
        className="h-full w-full object-cover"
      />
    </AspectRatio>
  ),
};

export const Square: Story = {
  render: () => (
    <AspectRatio ratio={1} className="bg-muted w-[300px] rounded-md overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        alt="Photo"
        className="h-full w-full object-cover"
      />
    </AspectRatio>
  ),
};

export const Video: Story = {
  render: () => (
    <AspectRatio ratio={16 / 9} className="bg-muted w-[500px] rounded-md overflow-hidden">
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </AspectRatio>
  ),
};
