// Import web app styles (contains Tailwind + CSS variables)
import './global.css';
import { AppHeader } from './components/header';
import { StoreProvider } from '@/store/StoreProvider';

export const metadata = {
  title: 'Voli - Volunteer Platform',
  description: 'Connect with meaningful volunteer opportunities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <StoreProvider>
          <AppHeader />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
