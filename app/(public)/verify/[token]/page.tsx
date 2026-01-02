import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function PublicQRVerificationPage({ params }: { params: { token: string } }) {
  // Server-only: fetch certification by QR token (no data rendered, placeholder)
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { tokenHash: params.token },
    include: { certification: true },
  });
  if (!verificationToken) return notFound();
  return null; // UI not rendered yet per checklist
}
