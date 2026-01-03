import crypto from 'crypto';
import { prisma } from '../prisma';

const QR_TOKEN_SECRET = process.env.QR_TOKEN_SECRET || 'default-qr-secret';
const QR_TOKEN_TTL_SECONDS = parseInt(process.env.QR_TOKEN_TTL_SECONDS || '300');

export interface QRTokenPayload {
  certificationId: string;
  employeeId: string;
  certType: string;
  issuedAt: number;
  expiresAt: number;
}

// Generate a secure QR token for a certification
export function generateQRToken(certificationId: string, employeeId?: string, certType?: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: QRTokenPayload = {
    certificationId,
    employeeId: employeeId || '',
    certType: certType || '',
    issuedAt: now,
    expiresAt: now + QR_TOKEN_TTL_SECONDS,
  };

  const payloadString = JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', QR_TOKEN_SECRET)
    .update(payloadString)
    .digest('hex');

  const token = Buffer.from(`${payloadString}|${signature}`).toString('base64url');
  return token;
}

// Validate and decode a QR token
export function validateQRToken(token: string): { valid: boolean; payload?: QRTokenPayload; error?: string } {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const [payloadString, signature] = decoded.split('|');

    if (!payloadString || !signature) {
      return { valid: false, error: 'Invalid token format' };
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', QR_TOKEN_SECRET)
      .update(payloadString)
      .digest('hex');

    if (signature !== expectedSignature) {
      return { valid: false, error: 'Invalid signature' };
    }

    const payload: QRTokenPayload = JSON.parse(payloadString);

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.expiresAt < now) {
      return { valid: false, error: 'Token expired', payload };
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: 'Token parsing failed' };
  }
}

// Verify a certification via QR token
export async function verifyCertificationByToken(token: string): Promise<{
  valid: boolean;
  certification?: unknown;
  employee?: unknown;
  error?: string;
}> {
  const tokenResult = validateQRToken(token);

  if (!tokenResult.valid || !tokenResult.payload) {
    return { valid: false, error: tokenResult.error };
  }

  const certification = await prisma.certification.findUnique({
    where: { id: tokenResult.payload.certificationId },
    include: { employee: true },
  });

  if (!certification) {
    return { valid: false, error: 'Certification not found' };
  }

  // CRITICAL: Create immutable scan record (P0 requirement)
  // Every QR scan MUST create evidence trail
  try {
    // 1. Find verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { certificationId: certification.id },
    });

    if (verificationToken) {
      // 2. Create immutable scan record
      await prisma.verificationEvent.create({
        data: {
          verificationTokenId: verificationToken.id,
          verificationResult: certification.status,
        },
      });

      // 3. Write evidence node
      const evidenceNode = await prisma.evidenceNode.create({
        data: {
          entityType: 'Certification',
          entityId: certification.id,
          actorType: 'system',
          actorId: 'qr-scanner',
        },
      });

      // 4. Append ledger entry
      await prisma.immutableEventLedger.create({
        data: {
          evidenceNodeId: evidenceNode.id,
          eventType: 'QR_SCAN',
          payload: {
            certificationId: certification.id,
            statusAtScan: certification.status,
            scannedAt: new Date().toISOString(),
          },
        },
      });
    }
  } catch (error) {
    // If evidence write fails, scan fails (fail closed)
    console.error('[QR] Evidence write failed:', error);
    return { valid: false, error: 'Failed to record scan evidence' };
  }

  if (certification.status !== 'VALID') {
    return { valid: false, error: `Certification is ${certification.status}`, certification };
  }

  if (certification.expirationDate && certification.expirationDate < new Date()) {
    return { valid: false, error: 'Certification expired', certification };
  }

  return {
    valid: true,
    certification,
    employee: certification.employee,
  };
}

// Generate QR code URL (for frontend to render)
export function getQRCodeURL(token: string, baseUrl: string = process.env.APP_URL || ''): string {
  const verificationUrl = `${baseUrl}/verify/${token}`;
  // Return URL that can be used with QR code libraries
  return verificationUrl;
}

// Store verification token in database
export async function storeVerificationToken(
  token: string,
  certificationId: string,
  expiresAt: Date
): Promise<void> {
  await prisma.verificationToken.create({
    data: {
      token,
      certificationId,
      expiresAt,
    },
  });
}

// Log verification event
export async function logVerificationEvent(
  tokenId: string,
  verifiedBy: string,
  location?: { lat: number; lng: number }
): Promise<void> {
  await prisma.verificationEvent.create({
    data: {
      verificationTokenId: tokenId,
      verifiedAt: new Date(),
      verifiedBy,
      geoLat: location?.lat,
      geoLong: location?.lng,
    },
  });
}
