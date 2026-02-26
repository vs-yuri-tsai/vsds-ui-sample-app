import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as React from 'react';

import { Button } from './Button';

describe('Button', () => {
  it('renders with default variant and size', () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Submit</Button>);

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Submit</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = jest.fn();

    render(
      <Button disabled onClick={onClick}>
        Click me
      </Button>
    );
    await userEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Click</Button>);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
