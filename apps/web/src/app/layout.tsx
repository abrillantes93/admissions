
import { Inter } from 'next/font/google';
import './styles/globals.css';
import ClientLayout from './components/ClientLayout' // <-- Import your client layout

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'My App',
  description: 'An example Next.js app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap everything in the client layout */}
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
