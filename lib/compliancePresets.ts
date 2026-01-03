/**
 * COMPLIANCE PRESET DEFINITIONS
 * All employee certification requirements organized by category
 * These presets are instantiated on employee creation
 */

export type PresetCategory = 
  | 'BASE'
  | 'RAILROAD_SAFETY'
  | 'RAILROAD_CREDENTIALS'
  | 'CONSTRUCTION_SAFETY'
  | 'CONSTRUCTION_CREDENTIALS'
  | 'ENVIRONMENTAL_SAFETY'
  | 'ENVIRONMENTAL_CREDENTIALS'
  | 'COMPANY_LEVEL';

export interface CertificationPreset {
  category: PresetCategory;
  name: string;
  issuingAuthority?: string;
  requiresExpiration: boolean;
  isLocked: boolean;
}

/**
 * BASE CERTIFICATIONS — REQUIRED FOR ALL EMPLOYEES
 */
export const BASE_PRESETS: CertificationPreset[] = [
  {
    category: 'BASE',
    name: 'Government Issued ID',
    requiresExpiration: false,
    isLocked: true,
  },
  {
    category: 'BASE',
    name: 'Safety Orientation / New Hire Training',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'BASE',
    name: 'General Safety Training',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'BASE',
    name: 'PPE Training',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'BASE',
    name: 'Drug & Alcohol Policy Acknowledgement',
    requiresExpiration: false,
    isLocked: true,
  },
  {
    category: 'BASE',
    name: 'Medical Clearance',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'BASE',
    name: 'Emergency Contact Verification',
    requiresExpiration: false,
    isLocked: true,
  },
  {
    category: 'BASE',
    name: 'Code of Conduct Acknowledgement',
    requiresExpiration: false,
    isLocked: true,
  },
  {
    category: 'BASE',
    name: 'Site Rules & Expectations',
    requiresExpiration: false,
    isLocked: true,
  },
  {
    category: 'BASE',
    name: 'Other – Base Certification',
    requiresExpiration: false,
    isLocked: true,
  },
];

/**
 * RAILROAD SAFETY & ACCESS CERTIFICATIONS
 */
export const RAILROAD_SAFETY_PRESETS: CertificationPreset[] = [
  {
    category: 'RAILROAD_SAFETY',
    name: 'Railroad Safety & Access',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'RAILROAD_SAFETY',
    name: 'eRailSafe',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'RAILROAD_SAFETY',
    name: 'Railroad Contractor Orientation',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'RAILROAD_SAFETY',
    name: 'Track Safety Training',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'RAILROAD_SAFETY',
    name: 'On-Track Protection Training',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'RAILROAD_SAFETY',
    name: 'Roadway Worker Protection (RWP)',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'RAILROAD_SAFETY',
    name: 'RWIC Qualification',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'RAILROAD_SAFETY',
    name: 'Job Briefing Certification',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'RAILROAD_SAFETY',
    name: 'Railroad-Specific PPE Training',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'RAILROAD_SAFETY',
    name: 'Other – Railroad Safety',
    requiresExpiration: false,
    isLocked: true,
  },
];

/**
 * RAILROAD PERMISSIONS & CREDENTIALS
 */
export const RAILROAD_CREDENTIAL_PRESETS: CertificationPreset[] = [
  {
    category: 'RAILROAD_CREDENTIALS',
    name: 'Railroad Badge / Access Credential',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'RAILROAD_CREDENTIALS',
    name: 'Railroad Background Check',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'RAILROAD_CREDENTIALS',
    name: 'Railroad Medical Certification',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'RAILROAD_CREDENTIALS',
    name: 'Railroad Drug & Alcohol Compliance',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'RAILROAD_CREDENTIALS',
    name: 'Railroad-Issued ID Verification',
    requiresExpiration: false,
    isLocked: true,
  },
  {
    category: 'RAILROAD_CREDENTIALS',
    name: 'Other – Railroad Credentials',
    requiresExpiration: false,
    isLocked: true,
  },
];

/**
 * CONSTRUCTION SAFETY CERTIFICATIONS
 */
export const CONSTRUCTION_SAFETY_PRESETS: CertificationPreset[] = [
  {
    category: 'CONSTRUCTION_SAFETY',
    name: 'OSHA 10',
    issuingAuthority: 'OSHA',
    requiresExpiration: false,
    isLocked: true,
  },
  {
    category: 'CONSTRUCTION_SAFETY',
    name: 'OSHA 30',
    issuingAuthority: 'OSHA',
    requiresExpiration: false,
    isLocked: true,
  },
  {
    category: 'CONSTRUCTION_SAFETY',
    name: 'Fall Protection',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'CONSTRUCTION_SAFETY',
    name: 'Confined Space',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'CONSTRUCTION_SAFETY',
    name: 'Excavation & Trenching',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'CONSTRUCTION_SAFETY',
    name: 'Scaffold Safety',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'CONSTRUCTION_SAFETY',
    name: 'LOTO',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'CONSTRUCTION_SAFETY',
    name: 'Hot Work',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'CONSTRUCTION_SAFETY',
    name: 'Other – Construction Safety',
    requiresExpiration: false,
    isLocked: true,
  },
];

/**
 * CONSTRUCTION QUALIFICATIONS
 */
export const CONSTRUCTION_CREDENTIAL_PRESETS: CertificationPreset[] = [
  {
    category: 'CONSTRUCTION_CREDENTIALS',
    name: 'Equipment Operator',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'CONSTRUCTION_CREDENTIALS',
    name: 'Crane Operator',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'CONSTRUCTION_CREDENTIALS',
    name: 'Forklift',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'CONSTRUCTION_CREDENTIALS',
    name: 'Aerial Lift',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'CONSTRUCTION_CREDENTIALS',
    name: 'Welding',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'CONSTRUCTION_CREDENTIALS',
    name: 'Heavy Equipment Authorization',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'CONSTRUCTION_CREDENTIALS',
    name: 'Other – Construction Credentials',
    requiresExpiration: false,
    isLocked: true,
  },
];

/**
 * ENVIRONMENTAL SAFETY CERTIFICATIONS
 */
export const ENVIRONMENTAL_SAFETY_PRESETS: CertificationPreset[] = [
  {
    category: 'ENVIRONMENTAL_SAFETY',
    name: 'HAZWOPER 40-Hour',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'ENVIRONMENTAL_SAFETY',
    name: 'HAZWOPER Refresher',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'ENVIRONMENTAL_SAFETY',
    name: 'Spill Response',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'ENVIRONMENTAL_SAFETY',
    name: 'Hazardous Materials Handling',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'ENVIRONMENTAL_SAFETY',
    name: 'Waste Characterization',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'ENVIRONMENTAL_SAFETY',
    name: 'Decontamination',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'ENVIRONMENTAL_SAFETY',
    name: 'Environmental PPE',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'ENVIRONMENTAL_SAFETY',
    name: 'Other – Environmental Safety',
    requiresExpiration: false,
    isLocked: true,
  },
];

/**
 * ENVIRONMENTAL CREDENTIALS
 */
export const ENVIRONMENTAL_CREDENTIAL_PRESETS: CertificationPreset[] = [
  {
    category: 'ENVIRONMENTAL_CREDENTIALS',
    name: 'Environmental Sampling',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'ENVIRONMENTAL_CREDENTIALS',
    name: 'Environmental Monitoring',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'ENVIRONMENTAL_CREDENTIALS',
    name: 'Environmental Reporting',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'ENVIRONMENTAL_CREDENTIALS',
    name: 'Regulatory Awareness',
    requiresExpiration: true,
    isLocked: true,
  },
  {
    category: 'ENVIRONMENTAL_CREDENTIALS',
    name: 'Other – Environmental Credentials',
    requiresExpiration: false,
    isLocked: true,
  },
];

/**
 * ALL EMPLOYEE PRESETS (BASE + OPTIONAL CATEGORIES)
 */
export const ALL_EMPLOYEE_PRESETS: CertificationPreset[] = [
  ...BASE_PRESETS,
  ...RAILROAD_SAFETY_PRESETS,
  ...RAILROAD_CREDENTIAL_PRESETS,
  ...CONSTRUCTION_SAFETY_PRESETS,
  ...CONSTRUCTION_CREDENTIAL_PRESETS,
  ...ENVIRONMENTAL_SAFETY_PRESETS,
  ...ENVIRONMENTAL_CREDENTIAL_PRESETS,
];

/**
 * Get all required certifications for an employee based on their role/industry
 * For now, we create ALL presets - in future this can be filtered by employee type
 */
export function getRequiredCertifications(): CertificationPreset[] {
  return ALL_EMPLOYEE_PRESETS;
}

/**
 * Derive certification status based on dates and proof
 */
export function deriveCertificationStatus(cert: {
  issueDate: Date | null;
  expirationDate: Date | null;
  isNonExpiring: boolean;
  mediaFiles?: { id: string }[];
}): 'PASS' | 'FAIL' | 'INCOMPLETE' {
  const hasProof = cert.mediaFiles && cert.mediaFiles.length > 0;
  
  // No proof uploaded = INCOMPLETE
  if (!hasProof) {
    return 'INCOMPLETE';
  }

  // Has proof but no issue date = INCOMPLETE
  if (!cert.issueDate) {
    return 'INCOMPLETE';
  }

  // Non-expiring with proof and issue date = PASS
  if (cert.isNonExpiring) {
    return 'PASS';
  }

  // Requires expiration but none set = INCOMPLETE
  if (!cert.expirationDate) {
    return 'INCOMPLETE';
  }

  // Check if expired
  const now = new Date();
  if (cert.expirationDate < now) {
    return 'FAIL';
  }

  // All good
  return 'PASS';
}

/**
 * Get failure reason for a certification
 */
export function getFailureReason(cert: {
  issueDate: Date | null;
  expirationDate: Date | null;
  isNonExpiring: boolean;
  mediaFiles?: { id: string }[];
}): string | null {
  const hasProof = cert.mediaFiles && cert.mediaFiles.length > 0;
  
  if (!hasProof) {
    return 'No proof uploaded';
  }

  if (!cert.issueDate) {
    return 'Missing issue date';
  }

  if (!cert.isNonExpiring && !cert.expirationDate) {
    return 'Missing expiration date';
  }

  const now = new Date();
  if (cert.expirationDate && cert.expirationDate < now) {
    return 'Certification expired';
  }

  return null;
}
