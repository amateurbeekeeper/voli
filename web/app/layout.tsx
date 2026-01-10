import './global.css';
import '@voli/ui/styles.css';

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
      <body>{children}</body>
    </html>
  );
}
