import { prisma } from '@/lib/prisma';
import { executeTermination } from '@/lib/services/terminationGracePeriod';

/**
 * GRACE PERIOD TERMINATION JOB
 * 
 * Runs daily to check for expired grace periods and permanently delete data.
 * Should be scheduled via cron.
 * 
 * Schedule: Daily at 3:00 AM
 */

export async function runGracePeriodTermination() {
  const now = new Date();
  
  console.log('[Grace Period] Checking for expired grace periods...');

  // Find organizations with expired grace periods
  const expiredOrgs = await prisma.organization.findMany({
    where: {
      isReadOnlyMode: true,
      gracePeriodEndsAt: {
        lte: now,
      },
    },
    select: {
      id: true,
      name: true,
      gracePeriodEndsAt: true,
    },
  });

  console.log(`[Grace Period] Found ${expiredOrgs.length} expired grace periods`);

  for (const org of expiredOrgs) {
    try {
      console.log(`[Grace Period] Terminating organization: ${org.name} (ID: ${org.id})`);
      
      // This will:
      // 1. Log termination event to immutable ledger
      // 2. Permanently delete organization and cascade all data
      await executeTermination(org.id);
      
      console.log(`[Grace Period] Successfully terminated: ${org.id}`);
    } catch (error) {
      console.error(`[Grace Period] Failed to terminate ${org.id}:`, error);
      
      // Continue processing other organizations even if one fails
      continue;
    }
  }

  console.log('[Grace Period] Termination job completed');
}
