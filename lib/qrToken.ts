// lib/qrToken.ts
import crypto from 'crypto';
import { prisma } from './prisma';

/**
 * Generates a hashed QR token for an employee and stores it.
 * Returns the created VerificationToken record.
 * QR tokens are generated ONCE per employee and never regenerated.
 */
export async function generateEmployeeQrToken({ employeeId }: { employeeId: string }) {
  // Generate a random token and hash it
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  // Store the hashed token
  const verificationToken = await prisma.verificationToken.create({
    data: {
      employeeId,
      tokenHash,
      status: 'active',
    },
  });

  return { rawToken, verificationToken };
}

/**
 * Verify a QR token and return the associated employee with certifications
 */
export async function verifyEmployeeQrToken(rawToken: string) {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { tokenHash },
    include: {
      scans: {
        orderBy: { scannedAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!verificationToken || verificationToken.status !== 'active') {
    return null;
  }

  return verificationToken;
}
