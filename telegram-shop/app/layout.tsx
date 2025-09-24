import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Telegram Shop',
  description: 'Checkout experience for Telegram shop demo'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
