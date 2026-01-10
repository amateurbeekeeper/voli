import { describe, it, expect } from 'vitest';
import { render, screen } from '../app/test-utils';
import { Button } from '@voli/ui';

describe('Example Component Test', () => {
  it('renders a button', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
});

