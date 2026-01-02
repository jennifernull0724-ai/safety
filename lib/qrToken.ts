// lib/qrToken.ts
import crypto from 'crypto';
import prisma from './prisma';

/**
 * Generates a hashed QR token for a certification and stores it.
 * Returns the created VerificationToken record.
 */
export async function generateQrToken({ certificationId }: { certificationId: string }) {
  // Generate a random token and hash it
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  // Store the hashed token
  const verificationToken = await prisma.verificationToken.create({
    data: {
      certificationId,
      tokenHash,
      status: 'active',
    },
  });

  return { rawToken, verificationToken };
}
