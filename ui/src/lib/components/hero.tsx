import * as React from 'react';
import { Button } from './button';
import { cn } from '../utils';

export interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  ({ className, title, description, actions, badge, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          'relative overflow-hidden py-24 sm:py-32',
          className
        )}
        {...props}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {badge && <div className="mb-8 flex justify-center">{badge}</div>}
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              {title}
            </h1>
            {description && (
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {description}
              </p>
            )}
            {actions && (
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {actions}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
);
Hero.displayName = 'Hero';

export { Hero };
