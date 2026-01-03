# 🔐 VERIFICATION LOG ENTITY — CANONICAL SCHEMA (LOCKED)

**THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL VERIFICATION EVENT DATA**

All verification events MUST be written as VerificationLog records. This entity is append-only and immutable.

---

## ENTITY DEFINITION

```json
{
  "name": "VerificationLog",
  "type": "object",
  "properties": {
    "employee_id": {
      "type": "string",
      "description": "Reference to employee verified (Employee.employee_id)",
      "required": true
    },
    "verification_type": {
      "type": "string",
      "enum": [
        "qr_scan",
        "certification_check",
        "jha_acknowledgment",
        "incident_trigger",
        "audit_access"
      ],
      "description": "Type of verification event",
      "required": true
    },
    "scanned_by": {
      "type": "string",
      "description": "Who performed the scan (system, user ID, or 'public')"
    },
    "location": {
      "type": "string",
      "description": "Where verification occurred (GPS, site name, etc.)"
    },
    "result": {
      "type": "string",
      "enum": [
        "verified",
        "failed",
        "blocked",
        "expired"
      ],
      "description": "Verification result",
      "required": true
    },
    "snapshot": {
      "type": "object",
      "description": "Immutable snapshot of employee status at time of scan (CRITICAL for audit)",
      "immutable": true
    },
    "notes": {
      "type": "string",
      "description": "Additional notes or context"
    }
  },
  "required": [
    "employee_id",
    "verification_type",
    "result"
  ]
}
```

---

## HARD RULES (NON-NEGOTIABLE)

### 1. ABSOLUTE IMMUTABILITY
**This is the most critical rule for audit defensibility.**

- ✅ VerificationLog records are **APPEND-ONLY**
- ❌ **NO updates** — Once created, records CANNOT be modified
- ❌ **NO deletes** — Records CANNOT be removed (soft or hard)
- ❌ **NO status mutation** — Result cannot change after creation
- ✅ Only correction method: Create new verification event

**Why this matters:**
- Regulator audits require immutable verification history
- Legal discovery requires proof of employee status at specific moments
- Insurance claims depend on time-accurate authorization records
- Any mutation undermines evidentiary integrity

### 2. SCHEMA IMMUTABILITY
- ❌ **NO field additions** — This schema is FINAL
- ❌ **NO field removals** — All fields are locked
- ❌ **NO field renames** — Names are canonical
- ❌ **NO enum modifications** — Values are immutable

### 3. VERIFICATION TYPE ENUM (🔒 LOCKED)
The following verification types are FINAL:

| Type | Meaning | Context |
|------|---------|---------|
| `qr_scan` | QR code scanned | Public verification, site entry |
| `certification_check` | Manual cert verification | Admin review, compliance audit |
| `jha_acknowledgment` | Job Hazard Analysis acknowledged | Pre-work safety briefing |
| `incident_trigger` | Verification triggered by incident | Post-incident compliance check |
| `audit_access` | Regulator/auditor access | External audit, discovery request |

**❌ NO ADDITIONAL VALUES ALLOWED**
**❌ NO ALIASES** (e.g. "scan", "check", "ack")
**❌ NO RENAMING**

### 4. RESULT ENUM (🔒 LOCKED)
The following result values are FINAL and GLOBAL:

| Result | Meaning | Color | Usage |
|--------|---------|-------|-------|
| `verified` | Passed verification | Emerald | Dashboard, QR Success |
| `failed` | Verification failed | Red | Dashboard, QR Block |
| `blocked` | Employee blocked | Red | Dashboard, QR Block, Enforcement |
| `expired` | Certifications expired | Amber | Dashboard, QR Warning |

**❌ NO ALIASES ALLOWED**
- DO NOT use "approved" instead of "verified"
- DO NOT use "denied" instead of "failed"
- DO NOT use "suspended" instead of "blocked"

### 5. SNAPSHOT RULE (CRITICAL FOR AUDIT)
**The snapshot field is the most important field in this entity.**

**Purpose:**
- Proves what was true at the exact moment of verification
- Cannot be recomputed later (would use current state, not historical)
- Is admissible evidence in legal/regulatory proceedings

**What MUST be in snapshot:**
```typescript
{
  employee_status: 'compliant' | 'non_compliant' | 'pending' | 'blocked',
  certifications: [
    {
      certification_type: string,
      status: 'valid' | 'expired' | 'revoked' | 'pending_verification',
      expiration_date: string
    }
  ],
  timestamp: string,  // ISO 8601 verification time
  blocking_reason?: string  // If result = blocked/failed
}
```

**What MUST NOT happen:**
- ❌ Snapshot MUST NOT be recomputed later
- ❌ Snapshot MUST NOT reference live entities (foreign keys)
- ❌ Snapshot MUST NOT be updated when employee status changes
- ❌ Snapshot MUST NOT be "fixed" retroactively

**Example snapshot:**
```json
{
  "employee_status": "compliant",
  "certifications": [
    {
      "certification_type": "OSHA 30-Hour",
      "status": "valid",
      "expiration_date": "2026-12-31"
    },
    {
      "certification_type": "FRA Track Safety",
      "status": "valid",
      "expiration_date": "2026-06-15"
    }
  ],
  "timestamp": "2026-01-03T14:30:00Z",
  "qr_code": "abc123xyz"
}
```

### 6. EMPLOYEE LINKAGE (CRITICAL)
- ✅ `employee_id` MUST reference an existing `Employee.employee_id`
- ✅ Backend MUST validate employee exists before creating log
- ❌ Verification logs MUST NOT exist without valid employee reference
- ❌ Orphaned logs are NOT permitted

**Enforcement:**
- Foreign key constraint at database level
- API validation before insert
- Cascade behavior: Restrict (cannot delete employee with verification history)

### 7. SCAN CONTEXT (OPTIONAL BUT ENCOURAGED)
**scanned_by:**
- `"system"` — Automated verification (background job, expiration check)
- `"user:<user_id>"` — Authenticated user performing manual check
- `"public"` — Public QR scan (unauthenticated)
- `"regulator:<org>"` — External auditor access

**location:**
- GPS coordinates: `"40.7128,-74.0060"`
- Site name: `"Construction Site A"`
- Facility: `"Warehouse 3"`
- `null` if not available

### 8. AUDIT INTEGRATION (ENFORCED)
Every VerificationLog creation MUST trigger a SERVER-SIDE audit event:

```typescript
await prisma.verificationLog.create({
  data: {
    employee_id: 'EMP123',
    verification_type: 'qr_scan',
    result: 'verified',
    snapshot: { /* ... */ }
  }
});

// MUST be followed by:
await prisma.immutableEventLedger.create({
  data: {
    event_type: 'qr_scanned',
    description: `Employee ${employee.full_name} verified via QR scan`,
    severity: 'info',
    actor: scanned_by || 'public',
    payload: { verification_log_id: log.id }
  }
});
```

**❌ Client-side audit event creation is FORBIDDEN**

### 9. REQUIRED FIELDS (ENFORCED)
Backend MUST reject creates missing:
- `employee_id` — Reference to employee
- `verification_type` — Type from locked enum
- `result` — Result from locked enum

**Optional but recommended:**
- `snapshot` — Critical for audit defense (SHOULD always be present)
- `scanned_by` — Who performed verification
- `location` — Where verification occurred
- `notes` — Additional context

---

## SYSTEM CONSTRAINTS (ENFORCED)

### VerificationLogs Are Events, Not State
- ❌ Logs are **NOT state** — They do NOT change `Employee.status`
- ✅ Logs are **EVENTS** — They prove what was true at a moment
- ✅ Logs are **EVIDENCE** — They are admissible in legal proceedings
- ✅ Logs are **IMMUTABLE** — They cannot be altered

**Employee status updates:**
- Logs do NOT update employee status
- Background jobs MAY update employee status based on log patterns
- But logs themselves are purely historical records

### Snapshot Integrity
- Snapshot represents state AT TIME OF VERIFICATION
- Snapshot MUST NOT be recomputed (would use current state)
- Snapshot is FROZEN evidence of authorization
- Snapshot is what regulators/courts will see

### Deletion Restrictions
- ❌ VerificationLogs CANNOT be deleted
- ❌ Soft-deletion is NOT permitted
- ✅ Logs persist forever for audit trail
- ✅ GDPR "right to be forgotten" may require anonymization, not deletion

### QR Verification Behavior
- ✅ QR Verification creates new VerificationLog
- ✅ QR Verification reads employee current state
- ✅ QR Verification captures snapshot of current state
- ❌ QR Verification does NOT modify employee status

---

## FAILURE CONDITIONS

**The following trigger IMMEDIATE FAILURE:**

1. ❌ VerificationLog records are editable (updates allowed)
2. ❌ VerificationLog records are deletable
3. ❌ Snapshot is missing when verification occurs
4. ❌ Snapshot is recomputed after creation
5. ❌ Snapshot references live entities (mutable foreign keys)
6. ❌ Enum values modified (verification_type or result)
7. ❌ Verification history inferred instead of logged
8. ❌ Client-side audit event creation
9. ❌ Log created without valid employee reference
10. ❌ Result aliases used ("approved", "denied", etc.)

---

## SYSTEM IMPACT (CONFIRMED)

This entity definition is now **authoritative** for:

✅ **QR Verification Scans** — Public + internal verification  
✅ **Dashboard Recent Activity** — Latest verification events  
✅ **Employee Detail** — Verification history timeline  
✅ **Compliance Dispute Resolution** — Proof of authorization  
✅ **Regulator Evidence Replay** — Time-accurate verification records  
✅ **Audit Trail** — Immutable verification history  
✅ **Legal Discovery** — Evidence of employee status at specific moments  
✅ **API Contracts** — POST /api/employees/:id/verifications  
✅ **Database Schema** — Prisma VerificationLog model  

---

## PRISMA MODEL ALIGNMENT

The Prisma schema MUST align exactly:

```prisma
model VerificationLog {
  id                String   @id @default(cuid())
  employee_id       String
  verification_type VerificationType
  scanned_by        String?
  location          String?
  result            VerificationResult
  snapshot          Json     // Immutable snapshot of employee state
  notes             String?
  
  // Relations
  employee          Employee @relation(fields: [employee_id], references: [employee_id], onDelete: Restrict)
  
  created_at        DateTime @default(now())
  // NO updated_at — records are immutable
  
  @@index([employee_id])
  @@index([verification_type])
  @@index([result])
  @@index([created_at])
}

enum VerificationType {
  qr_scan
  certification_check
  jha_acknowledgment
  incident_trigger
  audit_access
}

enum VerificationResult {
  verified
  failed
  blocked
  expired
}
```

**CRITICAL NOTES:**
- ✅ NO `updated_at` field — Records are immutable
- ✅ `onDelete: Restrict` — Cannot delete employee with verification history
- ✅ Indexes on `employee_id`, `verification_type`, `result`, `created_at` for performance
- ✅ `snapshot` is JSON — Flexible structure for future-proofing
- ✅ `employee_id` references `Employee.employee_id` (NOT Employee.id)

---

## API CONTRACT ENFORCEMENT

### GET /api/employees/:employeeId/verifications
**Returns:**
```typescript
{
  id: string;
  employee_id: string;
  verification_type: 'qr_scan' | 'certification_check' | 'jha_acknowledgment' | 'incident_trigger' | 'audit_access';
  scanned_by?: string;
  location?: string;
  result: 'verified' | 'failed' | 'blocked' | 'expired';
  snapshot: {
    employee_status: string;
    certifications: Array<{
      certification_type: string;
      status: string;
      expiration_date: string;
    }>;
    timestamp: string;
    blocking_reason?: string;
  };
  notes?: string;
  created_at: string;
}[]
```

### POST /api/employees/:employeeId/verifications
**Accepts:**
```typescript
{
  verification_type: 'qr_scan' | 'certification_check' | 'jha_acknowledgment' | 'incident_trigger' | 'audit_access';
  scanned_by?: string;
  location?: string;
  notes?: string;
  // result: auto-computed from employee state
  // snapshot: auto-generated from current employee state
}
```

**Backend MUST:**
1. Validate `employee_id` references existing employee
2. Fetch current employee state (status, certifications)
3. Compute `result` based on employee state:
   - Employee status = "compliant" → result = "verified"
   - Employee status = "blocked" → result = "blocked"
   - Employee status = "non_compliant" → result = "failed"
   - Any cert expired → result = "expired"
4. Generate `snapshot` from current employee state
5. Create VerificationLog record (immutable)
6. Generate audit event
7. Return verification log

### POST /api/qr/verify (Public QR Scan)
**Accepts:**
```typescript
{
  code: string;  // QR code value
}
```

**Backend MUST:**
1. Lookup employee by `qr_code`
2. Fetch current employee state
3. Compute result from employee state
4. Generate snapshot
5. Create VerificationLog with `scanned_by: "public"`
6. Generate audit event
7. Return employee data + verification result

---

## FRONTEND IMPLEMENTATION RULES

### Component Rendering
All UI components MUST:
1. Use exact verification_type enum values
2. Use exact result enum values
3. Display snapshot data as read-only evidence
4. Never modify verification logs
5. Never recompute snapshot from current state

### Verification Type Icon Mapping
```typescript
const eventConfig = {
  qr_scan: { 
    icon: QrCode, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10',
    label: 'QR Scan'
  },
  certification_check: { 
    icon: FileCheck, 
    color: 'text-violet-400', 
    bg: 'bg-violet-500/10',
    label: 'Certification Check'
  },
  jha_acknowledgment: { 
    icon: CheckCircle2, 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500/10',
    label: 'JHA Acknowledgment'
  },
  incident_trigger: { 
    icon: AlertTriangle, 
    color: 'text-amber-400', 
    bg: 'bg-amber-500/10',
    label: 'Incident Trigger'
  },
  audit_access: { 
    icon: Eye, 
    color: 'text-slate-400', 
    bg: 'bg-slate-500/10',
    label: 'Audit Access'
  }
};
```

### Result Badge Mapping
```typescript
const resultConfig = {
  verified: { 
    label: 'Verified', 
    color: 'text-emerald-400',
    icon: CheckCircle2
  },
  failed: { 
    label: 'Failed', 
    color: 'text-red-400',
    icon: XCircle
  },
  blocked: { 
    label: 'Blocked', 
    color: 'text-red-400',
    icon: Ban
  },
  expired: { 
    label: 'Expired', 
    color: 'text-amber-400',
    icon: AlertTriangle
  }
};
```

### Recent Activity Component
**Dashboard Recent Activity:**
```tsx
<RecentActivity 
  logs={verificationLogs}  // Array of VerificationLog entities
  employees={employees}    // For name lookup only
/>
```

Component MUST:
- Render logs from props only (no fetching)
- Display verification_type with icon
- Display result with color
- Format timestamp
- Show location if available
- Never modify logs

### Employee Detail Verification History
```tsx
{verificationLogs.map(log => (
  <div key={log.id}>
    <span>{eventConfig[log.verification_type].label}</span>
    <span className={resultConfig[log.result].color}>
      {resultConfig[log.result].label}
    </span>
    <span>{format(new Date(log.created_at), 'MMM d, h:mm a')}</span>
    {log.location && <span>{log.location}</span>}
  </div>
))}
```

---

## BACKGROUND JOB INTEGRATION

### Certification Expiration Auto-Verification
When background job marks certification as expired:

```typescript
// After updating certification status to 'expired'
await prisma.verificationLog.create({
  data: {
    employee_id: cert.employee_id,
    verification_type: 'certification_check',
    scanned_by: 'system',
    result: 'expired',
    snapshot: {
      employee_status: employee.status,
      certifications: employee.certifications.map(c => ({
        certification_type: c.certification_type,
        status: c.status,
        expiration_date: c.expiration_date
      })),
      timestamp: new Date().toISOString(),
      blocking_reason: `${cert.certification_type} expired`
    },
    notes: `Automated expiration check detected expired certification`
  }
});
```

### Audit Access Logging
When regulator/auditor accesses employee record:

```typescript
await prisma.verificationLog.create({
  data: {
    employee_id: employee.employee_id,
    verification_type: 'audit_access',
    scanned_by: `regulator:${auditorOrg}`,
    result: 'verified',  // Access granted, not a compliance check
    snapshot: {
      employee_status: employee.status,
      certifications: employee.certifications.map(c => ({
        certification_type: c.certification_type,
        status: c.status,
        expiration_date: c.expiration_date
      })),
      timestamp: new Date().toISOString(),
      access_reason: 'FRA compliance audit'
    },
    notes: `Audit access by ${auditorName}`
  }
});
```

---

## ENFORCEMENT CHECKLIST

Before deploying any VerificationLog-related code, verify:

- [ ] Records are append-only (no updates, no deletes)
- [ ] All field names match this schema exactly
- [ ] verification_type uses only: qr_scan, certification_check, jha_acknowledgment, incident_trigger, audit_access
- [ ] result uses only: verified, failed, blocked, expired
- [ ] Required fields (employee_id, verification_type, result) are enforced
- [ ] Snapshot is generated at time of verification
- [ ] Snapshot is never recomputed
- [ ] Snapshot contains employee state + certifications
- [ ] No additional fields introduced
- [ ] No enum aliases used
- [ ] Employee foreign key enforced
- [ ] Prisma model has NO updated_at field
- [ ] API contracts match this definition
- [ ] Frontend components render from this schema
- [ ] Server-side audit events generated for all verifications
- [ ] Dashboard Recent Activity uses this entity

---

## REGULATOR COMPLIANCE

This schema is designed for:
- ✅ **FRA audits** — Proof of employee authorization at specific times
- ✅ **OSHA audits** — Verification history for incident investigations
- ✅ **Legal discovery** — Immutable verification records
- ✅ **Insurance claims** — Evidence of compliance at incident time
- ✅ **Dispute resolution** — Time-accurate verification proof

**AUDIT DEFENSIBILITY:**
- Verification + Snapshot = Complete proof of authorization
- Cannot be altered retroactively
- Cannot be deleted
- Timestamp proves when verification occurred
- Snapshot proves what was true at that moment
- Chain of custody maintained via immutability

**REGULATORY QUESTIONS THIS ANSWERS:**
1. "Was this employee authorized to work on January 3, 2026 at 2:30 PM?"
   → Check VerificationLog with snapshot
2. "What certifications did this employee have when the incident occurred?"
   → Check snapshot in verification log nearest to incident time
3. "Who verified this employee was compliant?"
   → Check scanned_by field
4. "Where was this employee verified?"
   → Check location field
5. "Has this verification record been altered?"
   → No updated_at field = immutable

---

## MIGRATION NOTES

**If prior implementations used different field names:**

### Legacy → Canonical Mapping
| Legacy Field | Canonical Field | Action |
|--------------|-----------------|--------|
| `scan_type` | `verification_type` | Rename in database/API |
| `status` | `result` | Rename in database/API |
| `approved` result | `verified` | Map on read, update backend |
| `denied` result | `failed` | Map on read, update backend |
| `scan_data` | `snapshot` | Rename in database/API |
| `timestamp` | `created_at` | Rename in database/API |

**⚠️ CRITICAL:** All legacy field support must be transient. The canonical schema is the only valid long-term contract.

---

## RELATIONSHIP TO OTHER ENTITIES

### VerificationLog → Employee
- **Type:** Many-to-One
- **Foreign Key:** `employee_id` references `Employee.employee_id`
- **Delete Behavior:** Restrict (cannot delete employee with verification history)

### VerificationLog → ImmutableEventLedger
- **Type:** One-to-One (via audit event creation)
- **Purpose:** Each verification generates audit event
- **Usage:** Complete audit trail

### VerificationLog → EvidenceNode
- **Type:** Optional linkage
- **Purpose:** Link verification to evidence chain for legal proceedings
- **Usage:** Discovery, regulator review

---

## SNAPSHOT EXAMPLES

### Successful QR Scan
```json
{
  "employee_status": "compliant",
  "qr_code": "abc123xyz",
  "certifications": [
    {
      "certification_type": "OSHA 30-Hour",
      "status": "valid",
      "expiration_date": "2026-12-31"
    },
    {
      "certification_type": "FRA Track Safety",
      "status": "valid",
      "expiration_date": "2026-08-15"
    }
  ],
  "timestamp": "2026-01-03T14:30:00Z"
}
```

### Blocked Employee Scan
```json
{
  "employee_status": "blocked",
  "qr_code": "xyz789abc",
  "certifications": [
    {
      "certification_type": "OSHA 30-Hour",
      "status": "revoked",
      "expiration_date": "2026-12-31",
      "revocation_reason": "Failed drug test"
    }
  ],
  "timestamp": "2026-01-03T15:45:00Z",
  "blocking_reason": "Employee blocked due to revoked certification"
}
```

### Expired Certification Scan
```json
{
  "employee_status": "non_compliant",
  "qr_code": "def456ghi",
  "certifications": [
    {
      "certification_type": "First Aid/CPR",
      "status": "expired",
      "expiration_date": "2025-12-01"
    },
    {
      "certification_type": "OSHA 10-Hour",
      "status": "valid",
      "expiration_date": "2026-11-30"
    }
  ],
  "timestamp": "2026-01-03T16:00:00Z",
  "blocking_reason": "First Aid/CPR certification expired"
}
```

---

**🔒 END OF CANONICAL VERIFICATION LOG ENTITY DEFINITION**

_Any code that violates this contract is non-compliant and must be corrected._

_Verification logs are immutable evidence. Treat them as legal documents._
