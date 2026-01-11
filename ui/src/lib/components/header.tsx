import * as React from 'react';
import { Button } from './button';
import { cn } from '../utils';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  navItems?: Array<{ label: string; href: string; onClick?: () => void }>;
  cta?: React.ReactNode;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, logo, navItems, cta, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          className
        )}
        {...props}
      >
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            {logo || (
              <a href="/" className="mr-6 flex items-center space-x-2">
                <span className="text-xl font-bold">Voli</span>
              </a>
            )}
          </div>
          {navItems && navItems.length > 0 && (
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={item.onClick}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
          <div className="flex flex-1 items-center justify-end space-x-4">
            {cta || (
              <>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button size="sm">Get Started</Button>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }
);
Header.displayName = 'Header';

export { Header };
