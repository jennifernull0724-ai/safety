import { prisma } from '@/lib/prisma';
import { validateCurrentPricing } from '@/lib/services/pricingEnforcement';

/**
 * PRICING TIER VALIDATION JOB
 * 
 * Runs monthly to ensure organizations are in correct pricing tiers
 * based on current employee count.
 * 
 * Flags organizations that have exceeded their tier boundaries.
 * 
 * Schedule: 1st of every month at 4:00 AM
 */

export async function runPricingTierValidation() {
  console.log('[Pricing Validation] Starting tier validation...');

  // Get all active organizations
  const organizations = await prisma.organization.findMany({
    where: {
      subscriptionStatus: { in: ['active', 'trialing'] }
    },
    select: { id: true, name: true }
  });

  const violations: Array<{
    orgId: string;
    orgName: string;
    issues: string[];
  }> = [];

  for (const org of organizations) {
    try {
      const validation = await validateCurrentPricing(org.id);
      
      if (!validation.valid) {
        violations.push({
          orgId: org.id,
          orgName: org.name,
          issues: validation.issues,
        });

        // Log violation to immutable ledger
        await prisma.immutableEventLedger.create({
          data: {
            eventType: 'pricing.tier_violation',
            entityType: 'organization',
            entityId: org.id,
            actorId: 'system',
            actorType: 'system',
            metadata: {
              currentEmployeeCount: validation.currentEmployeeCount,
              expectedBasePrice: validation.expectedBasePrice,
              issues: validation.issues,
            },
          },
        });
      }
    } catch (error) {
      console.error(`[Pricing Validation] Error validating ${org.id}:`, error);
      continue;
    }
  }

  if (violations.length > 0) {
    console.log(`[Pricing Validation] Found ${violations.length} tier violations`);
    
    // TODO: Send notifications to admin/billing team
    // For example:
    // - Email alerts
    // - Slack notifications
    // - Dashboard alerts
    
    for (const violation of violations) {
      console.log(`[Pricing Violation] ${violation.orgName}:`, violation.issues);
    }
  } else {
    console.log('[Pricing Validation] All organizations in correct tiers');
  }

  console.log('[Pricing Validation] Completed');
}
