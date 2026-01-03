import type { Metadata } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'System of Proof',
  description: 'Employee-Anchored • QR-Verified • Audit-Defensible',
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
