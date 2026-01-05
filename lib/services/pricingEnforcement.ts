import { prisma } from '../prisma';

/**
 * PRICING ENFORCEMENT SERVICE
 * 
 * Enforces documented pricing rules:
 * - Tier 1: 1-100 employees → $200/mo base
 * - Tier 2: 101-500 → $500/mo
 * - Tier 3: 501-2000 → $1200/mo
 * - Tier 4: 2001-10000 → $2500/mo
 * - Tier 5: 10001+ → Custom pricing
 * 
 * - Annual renewals capped at 8% increase
 * - 2-year contracts: 5% discount
 * - 3+ year contracts: 10% discount
 */

interface PricingTier {
  min: number;
  max: number | null;
  basePrice: number;
}

const PRICING_TIERS: PricingTier[] = [
  { min: 1, max: 100, basePrice: 200 },
  { min: 101, max: 500, basePrice: 500 },
  { min: 501, max: 2000, basePrice: 1200 },
  { min: 2001, max: 10000, basePrice: 2500 },
  { min: 10001, max: null, basePrice: null }, // Custom pricing
];

const MAX_ANNUAL_INCREASE = 0.08; // 8% cap
const TWO_YEAR_DISCOUNT = 0.05; // 5%
const THREE_YEAR_DISCOUNT = 0.10; // 10%

/**
 * Get base monthly price for employee count
 */
export function getBasePriceForEmployeeCount(employeeCount: number): number | null {
  const tier = PRICING_TIERS.find(
    (t) => employeeCount >= t.min && (t.max === null || employeeCount <= t.max)
  );
  
  return tier?.basePrice || null; // null = custom pricing required
}

/**
 * Apply multi-year discount
 */
export function applyContractDiscount(basePrice: number, contractYears: number): number {
  if (contractYears >= 3) {
    return basePrice * (1 - THREE_YEAR_DISCOUNT);
  }
  if (contractYears >= 2) {
    return basePrice * (1 - TWO_YEAR_DISCOUNT);
  }
  return basePrice;
}

/**
 * Validate renewal price doesn't exceed 8% cap
 */
export function validateRenewalPrice(
  lastPrice: number,
  proposedPrice: number
): { valid: boolean; maxAllowedPrice: number; exceedsBy?: number } {
  const maxAllowedPrice = lastPrice * (1 + MAX_ANNUAL_INCREASE);
  const valid = proposedPrice <= maxAllowedPrice;
  
  return {
    valid,
    maxAllowedPrice,
    exceedsBy: valid ? undefined : proposedPrice - maxAllowedPrice,
  };
}

/**
 * Calculate correct price for organization
 */
export async function calculatePrice(
  organizationId: string,
  employeeCount: number,
  contractYears: number = 1,
  isRenewal: boolean = false
): Promise<{
  basePrice: number | null;
  discountedPrice: number | null;
  appliedDiscount: number;
  renewalValid: boolean;
  error?: string;
}> {
  const basePrice = getBasePriceForEmployeeCount(employeeCount);
  
  if (basePrice === null) {
    return {
      basePrice: null,
      discountedPrice: null,
      appliedDiscount: 0,
      renewalValid: false,
      error: 'Custom pricing required for 10,001+ employees',
    };
  }

  const discountedPrice = applyContractDiscount(basePrice, contractYears);
  const appliedDiscount = contractYears >= 3 ? THREE_YEAR_DISCOUNT : 
                          contractYears >= 2 ? TWO_YEAR_DISCOUNT : 0;

  // For renewals, check 8% cap
  let renewalValid = true;
  let error: string | undefined;

  if (isRenewal) {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { 
        lastRenewalPrice: true,
        employeeCountAtRenewal: true,
      },
    });

    if (org?.lastRenewalPrice) {
      const validation = validateRenewalPrice(org.lastRenewalPrice, discountedPrice);
      renewalValid = validation.valid;
      
      if (!validation.valid) {
        error = `Proposed price $${discountedPrice.toFixed(2)} exceeds 8% annual cap. Max allowed: $${validation.maxAllowedPrice.toFixed(2)}`;
      }
    }
  }

  return {
    basePrice,
    discountedPrice,
    appliedDiscount,
    renewalValid,
    error,
  };
}

/**
 * Lock in pricing at renewal
 */
export async function lockRenewalPricing(
  organizationId: string,
  employeeCount: number,
  finalPrice: number,
  contractYears: number
) {
  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      employeeCountAtRenewal: employeeCount,
      lastRenewalPrice: finalPrice,
      contractTermYears: contractYears,
      lockedDiscountRate: contractYears >= 3 ? THREE_YEAR_DISCOUNT : 
                          contractYears >= 2 ? TWO_YEAR_DISCOUNT : 0,
    },
  });

  await prisma.immutableEventLedger.create({
    data: {
      eventType: 'organization.pricing_locked',
      entityType: 'organization',
      entityId: organizationId,
      actorId: 'system',
      actorType: 'system',
      metadata: {
        employeeCount,
        finalPrice,
        contractYears,
        lockedAt: new Date().toISOString(),
      },
    },
  });
}

/**
 * Validate organization is in correct pricing tier
 */
export async function validateCurrentPricing(organizationId: string): Promise<{
  valid: boolean;
  currentEmployeeCount: number;
  expectedBasePrice: number | null;
  issues: string[];
}> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      employeeCountAtRenewal: true,
      lastRenewalPrice: true,
      contractTermYears: true,
      employees: {
        where: { isActive: true },
        select: { id: true },
      },
    },
  });

  if (!org) {
    throw new Error('Organization not found');
  }

  const currentEmployeeCount = org.employees.length;
  const expectedBasePrice = getBasePriceForEmployeeCount(currentEmployeeCount);
  const issues: string[] = [];

  // Check if employee count changed tiers
  if (org.employeeCountAtRenewal && expectedBasePrice) {
    const lockedTierPrice = getBasePriceForEmployeeCount(org.employeeCountAtRenewal);
    if (lockedTierPrice !== expectedBasePrice) {
      issues.push(
        `Employee count changed from ${org.employeeCountAtRenewal} to ${currentEmployeeCount}, ` +
        `crossing pricing tier boundary. Base price should change from $${lockedTierPrice} to $${expectedBasePrice}`
      );
    }
  }

  return {
    valid: issues.length === 0,
    currentEmployeeCount,
    expectedBasePrice,
    issues,
  };
}
