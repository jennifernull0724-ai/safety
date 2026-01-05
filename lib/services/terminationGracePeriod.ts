import { prisma } from '../prisma';
import { addDays } from 'date-fns';

/**
 * TERMINATION GRACE PERIOD SERVICE
 * 
 * Enforces 30-day read-only access after subscription cancellation.
 * During grace period:
 * - All data remains accessible (read-only)
 * - No new data can be created
 * - QR codes continue to work
 * - After 30 days, data is permanently deleted
 */

const GRACE_PERIOD_DAYS = 30;

/**
 * Initiate grace period when subscription is canceled
 */
export async function startGracePeriod(organizationId: string) {
  const gracePeriodEndsAt = addDays(new Date(), GRACE_PERIOD_DAYS);

  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      isReadOnlyMode: true,
      gracePeriodEndsAt,
    },
  });

  // Log the grace period start
  await prisma.immutableEventLedger.create({
    data: {
      eventType: 'organization.grace_period_started',
      entityType: 'organization',
      entityId: organizationId,
      actorId: 'system',
      actorType: 'system',
      metadata: {
        gracePeriodEndsAt: gracePeriodEndsAt.toISOString(),
      },
    },
  });

  return gracePeriodEndsAt;
}

/**
 * Check if organization is in read-only mode
 */
export async function isReadOnlyMode(organizationId: string): Promise<boolean> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { isReadOnlyMode: true },
  });

  return org?.isReadOnlyMode ?? false;
}

/**
 * Reactivate organization when subscription is restored
 */
export async function endGracePeriod(organizationId: string) {
  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      isReadOnlyMode: false,
      gracePeriodEndsAt: null,
    },
  });

  await prisma.immutableEventLedger.create({
    data: {
      eventType: 'organization.grace_period_ended',
      entityType: 'organization',
      entityId: organizationId,
      actorId: 'system',
      actorType: 'system',
      metadata: {
        reason: 'subscription_restored',
      },
    },
  });
}

/**
 * Permanently delete organization data after grace period expires
 */
export async function executeTermination(organizationId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      gracePeriodEndsAt: true,
      isReadOnlyMode: true,
    },
  });

  if (!org?.gracePeriodEndsAt || !org.isReadOnlyMode) {
    throw new Error('Organization is not in grace period');
  }

  if (org.gracePeriodEndsAt > new Date()) {
    throw new Error('Grace period has not expired yet');
  }

  // Log termination event BEFORE deletion (immutable)
  await prisma.immutableEventLedger.create({
    data: {
      eventType: 'organization.terminated',
      entityType: 'organization',
      entityId: organizationId,
      actorId: 'system',
      actorType: 'system',
      metadata: {
        gracePeriodEndsAt: org.gracePeriodEndsAt.toISOString(),
        terminatedAt: new Date().toISOString(),
      },
    },
  });

  // CASCADE deletes will handle all related data
  await prisma.organization.delete({
    where: { id: organizationId },
  });
}
