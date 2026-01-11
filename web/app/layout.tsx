// Import UI library styles first (contains Tailwind directives and CSS variables)
import '../../ui/src/styles.css';
// Import web app specific styles (minimal, UI library handles Tailwind)
import './global.css';
import { AppHeader } from './components/header';

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
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
