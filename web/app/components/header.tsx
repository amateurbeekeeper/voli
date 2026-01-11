'use client';

import { Header, Button, Avatar, AvatarFallback, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@voli/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, CreditCard } from 'lucide-react';

export function AppHeader() {
  const router = useRouter();
  const isAuthenticated = false; // TODO: Replace with actual auth check

  return (
    <Header
      logo={
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">V</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Voli</span>
        </Link>
      }
      navItems={[
        { 
          label: 'Opportunities', 
          href: '/opportunities',
          onClick: (e) => {
            e.preventDefault();
            router.push('/opportunities');
          }
        },
        { 
          label: 'Dashboard', 
          href: '/dashboard',
          onClick: (e) => {
            e.preventDefault();
            router.push('/dashboard');
          }
        },
        { 
          label: 'Pricing', 
          href: '/pricing',
          onClick: (e) => {
            e.preventDefault();
            router.push('/pricing');
          }
        },
      ]}
      cta={
        isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing" className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </>
        )
      }
    />
  );
}
