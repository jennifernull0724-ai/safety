import type { Metadata } from 'next';
import './styles/globals.css';
import { AuthProvider } from './providers';

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
      <body className="bg-slate-950 text-white antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
