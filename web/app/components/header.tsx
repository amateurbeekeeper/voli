'use client';

import { Header, Button } from '@voli/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const router = useRouter();

  return (
    <Header
      logo={
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">Voli</span>
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
          label: 'About', 
          href: '/about',
          onClick: (e) => {
            e.preventDefault();
            router.push('/about');
          }
        },
        { 
          label: 'Components', 
          href: '/components',
          onClick: (e) => {
            e.preventDefault();
            router.push('/components');
          }
        },
      ]}
      cta={
        <>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </>
      }
    />
  );
}
