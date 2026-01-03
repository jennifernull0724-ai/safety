# 🔐 CERTIFICATION ENTITY — CANONICAL SCHEMA (LOCKED)

**THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL CERTIFICATION DATA**

All Certification reads, writes, validations, and UI rendering MUST conform to this schema.

---

## ENTITY DEFINITION

```json
{
  "name": "Certification",
  "type": "object",
  "properties": {
    "employee_id": {
      "type": "string",
      "description": "Reference to employee (Employee.employee_id)",
      "required": true
    },
    "certification_type": {
      "type": "string",
      "description": "Type of certification (from locked preset list)",
      "required": true
    },
    "issuing_authority": {
      "type": "string",
      "description": "Organization that issued the certification"
    },
    "issue_date": {
      "type": "string",
      "format": "date",
      "description": "Date certification was issued (ISO 8601)"
    },
    "expiration_date": {
      "type": "string",
      "format": "date",
      "description": "Date certification expires (ISO 8601)"
    },
    "status": {
      "type": "string",
      "enum": [
        "valid",
        "expired",
        "revoked",
        "pending_verification"
      ],
      "default": "pending_verification",
      "description": "Current certification status"
    },
    "proof_file_url": {
      "type": "string",
      "description": "URL to proof document/image (CRITICAL for audit trail)"
    },
    "verification_notes": {
      "type": "string",
      "description": "Notes from verification process"
    }
  },
  "required": [
    "employee_id",
    "certification_type"
  ]
}
```

---

## HARD RULES (NON-NEGOTIABLE)

### 1. SCHEMA IMMUTABILITY
- ❌ **NO field additions** — This schema is FINAL
- ❌ **NO field removals** — All fields are locked
- ❌ **NO field renames** — Names are canonical
- ❌ **NO enum modifications** — Values are immutable
- ❌ **NO computed/inferred fields** — Only stored properties allowed

### 2. STATUS SEMANTICS (GLOBAL)
The following status values are FINAL and apply across ALL contexts:

| Status | Meaning | Color | Usage |
|--------|---------|-------|-------|
| `valid` | Active, not expired, usable | Emerald | Dashboard, QR Verification |
| `expired` | Past expiration_date | Amber | Dashboard, Alerts, Background Jobs |
| `revoked` | Administratively revoked | Red | Dashboard, QR Verification, Enforcement |
| `pending_verification` | Awaiting review/approval | Blue | Dashboard, Admin Review |

**❌ NO ALIASES ALLOWED**
- DO NOT use "approved" instead of "valid"
- DO NOT use "active" instead of "valid"
- DO NOT use "rejected" instead of "revoked"
- DO NOT use "cancelled" instead of "revoked"

### 3. CERTIFICATION TYPE PRESETS (🔒 LOCKED)
The following certification types are FINAL and MUST NOT be modified:

```typescript
const CERTIFICATION_TYPES = [
  'OSHA 10-Hour',
  'OSHA 30-Hour',
  'FRA Track Safety',
  'FRA Roadway Worker',
  'HAZMAT Certification',
  'First Aid/CPR',
  'Forklift Operator',
  'Crane Operator',
  'Electrical Safety',
  'Confined Space Entry',
  'Fall Protection',
  'Environmental Compliance',
  'Drug/Alcohol Testing',
  'Background Check',
  'Other'
];
```

**🔒 PRESETS — DO NOT MODIFY**

### 4. EMPLOYEE LINKAGE (CRITICAL)
- ✅ `employee_id` MUST reference an existing `Employee.employee_id`
- ✅ Backend MUST validate employee exists before creating certification
- ❌ Certification records MUST NOT exist without valid employee reference
- ❌ Orphaned certifications are NOT permitted

**Enforcement:**
- Foreign key constraint at database level
- API validation before insert
- Cascade behavior explicitly defined (NO cascade delete)

### 5. PROOF IMAGE / DOCUMENT RULE (CRITICAL FOR AUDIT)
**This is the most important rule for regulatory compliance.**

- `proof_file_url` is **OPTIONAL** but **STRONGLY ENCOURAGED**
- When present, it MUST be:
  - ✅ Persisted to permanent storage
  - ✅ Publicly retrievable (or signed-access retrievable)
  - ✅ Immutable once certification is verified
  - ✅ Backed by actual uploaded file (image, PDF, etc.)
  - ❌ NEVER fabricated or synthetic

**UI REQUIREMENTS:**
- `proof_file_url` MUST be surfaced in:
  - ✅ Employee Detail page → Certifications section
  - ✅ QR Verification page → Certification cards
  - ✅ Audit Vault / Evidence review
  - ✅ Add Certification form (upload required)

**DISPLAY RULES:**
- If `proof_file_url` exists → Show image/document preview
- If `proof_file_url` is NULL → Show explicit "No certification image on file"
- UI MUST NOT fabricate document previews or placeholders beyond text

### 6. DATE RULES (EXPLICIT)
- `issue_date` and `expiration_date` MUST be valid ISO 8601 dates if present
- Dates are STORED in UTC
- Dates are DISPLAYED in local time with clear timezone indication
- Expiration logic MUST NOT mutate this entity automatically
- Status changes are **explicit actions**, not inferred from date comparison

**Expiration Process:**
1. Background job checks `expiration_date < now()`
2. If expired AND status = "valid" → Update status to "expired"
3. Generate audit event for status change
4. Update employee compliance status if needed

**❌ CLIENT-SIDE DATE MUTATIONS ARE FORBIDDEN**

### 7. AUDIT RULE (ENFORCED)
All certification lifecycle events MUST generate immutable audit records:

- ✅ Certification created → Audit event + Evidence node
- ✅ Certification updated → Audit event + Evidence node
- ✅ Certification status changed → Audit event + Evidence node
- ✅ Certification revoked → Audit event + Evidence node
- ✅ Certification expired (auto) → Audit event + Evidence node

**❌ NO client-side audit event creation**
**❌ NO audit event mutation**
**❌ NO audit event deletion**

### 8. REQUIRED FIELDS (ENFORCED)
Backend MUST reject creates/updates missing:
- `employee_id` — Reference to employee
- `certification_type` — Type from locked preset list

**Optional but recommended:**
- `issuing_authority` — Who issued the cert
- `issue_date` — When it was issued
- `expiration_date` — When it expires
- `proof_file_url` — Proof document (critical for audit)

---

## SYSTEM CONSTRAINTS (ENFORCED)

### Certifications Are Evidence Objects
- ❌ Certifications are **NOT UI artifacts**
- ✅ Certifications are **evidence objects**
- ✅ Certifications are **part of the audit trail**
- ✅ Certifications are **immutable once verified**

### Auto-Expiration Behavior
- ❌ Certifications do **NOT auto-expire themselves**
- ✅ Background jobs detect expiration and update status
- ✅ Status transitions are **intentional and auditable**
- ✅ Expiration generates audit event

### Deletion Restrictions
- ❌ Deleting certifications should be **restricted or soft-blocked**
- ✅ Revocation is the correct action (status = "revoked")
- ✅ Historical certifications must remain for audit trail

### QR Verification Behavior
- ✅ QR Verification may **DISPLAY** proof images
- ❌ QR Verification may **NEVER MODIFY** certifications
- ✅ QR Verification is **read-only** for all certification data

---

## FAILURE CONDITIONS

**The following trigger IMMEDIATE FAILURE:**

1. ❌ Any field added to this schema
2. ❌ Any field removed from this schema
3. ❌ Any enum value modified
4. ❌ Status aliases used ("approved", "active", "rejected")
5. ❌ `proof_file_url` discarded or ignored in UI
6. ❌ Client-side audit event creation
7. ❌ Certification created without valid employee reference
8. ❌ Certification type not from locked preset list
9. ❌ Auto-expiration without audit event
10. ❌ Proof document fabricated or synthetic

---

## SYSTEM IMPACT (CONFIRMED)

This entity definition is now **authoritative** for:

✅ **Add Certification Workflow** — Form submission, proof upload  
✅ **Employee Detail Page** — Certifications list with proof images  
✅ **QR Verification Page** — Certification cards with proof display  
✅ **Audit Vault / Timeline** — Certification events  
✅ **Dashboard Stats** — Valid vs expired cert counts  
✅ **Compliance Decisioning** — Employee status calculation  
✅ **Background Jobs** — Expiration sweep, compliance scoring  
✅ **API Contracts** — GET/POST /api/certifications endpoints  
✅ **Database Schema** — Prisma Certification model  

---

## PRISMA MODEL ALIGNMENT

The Prisma schema MUST align exactly:

```prisma
model Certification {
  id                  String   @id @default(cuid())
  employee_id         String
  certification_type  String
  issuing_authority   String?
  issue_date          DateTime?
  expiration_date     DateTime?
  status              CertificationStatus @default(pending_verification)
  proof_file_url      String?
  verification_notes  String?
  
  // Relations
  employee            Employee @relation(fields: [employee_id], references: [employee_id], onDelete: Restrict)
  evidence_nodes      EvidenceNode[]
  
  created_at          DateTime @default(now())
  updated_at          DateTime @updatedAt
  
  @@index([employee_id])
  @@index([status])
  @@index([expiration_date])
}

enum CertificationStatus {
  valid
  expired
  revoked
  pending_verification
}
```

**CRITICAL NOTES:**
- `onDelete: Restrict` → Prevent employee deletion if certifications exist
- Indexes on `employee_id`, `status`, `expiration_date` for performance
- `employee_id` references `Employee.employee_id` (NOT Employee.id)

---

## API CONTRACT ENFORCEMENT

### GET /api/certifications
**Returns:**
```typescript
{
  id: string;
  employee_id: string;
  certification_type: string;
  issuing_authority?: string;
  issue_date?: string;
  expiration_date?: string;
  status: 'valid' | 'expired' | 'revoked' | 'pending_verification';
  proof_file_url?: string;
  verification_notes?: string;
  created_at: string;
}[]
```

### GET /api/employees/:employeeId/certifications
**Returns:** Same as above, filtered by employee

### POST /api/certifications
**Accepts:**
```typescript
{
  employee_id: string;           // REQUIRED, must exist
  certification_type: string;    // REQUIRED, must be from preset list
  issuing_authority?: string;
  issue_date?: string;           // ISO 8601 date
  expiration_date?: string;      // ISO 8601 date
  proof_file_url?: string;       // URL from prior upload
  verification_notes?: string;
  // status: auto-set to "pending_verification"
}
```

**Backend MUST:**
1. Validate `employee_id` references existing employee
2. Validate `certification_type` is from locked preset list
3. Set `status` to "pending_verification" by default
4. Generate audit event for creation
5. Link to evidence node

### POST /api/uploads/certification-proof
**Accepts:** `multipart/form-data` with file
**Returns:**
```typescript
{
  url: string;  // Permanent URL to uploaded proof document
}
```

**Backend MUST:**
1. Validate file type (image/pdf acceptable)
2. Store file permanently (S3, filesystem, etc.)
3. Return persistent URL
4. URL must be retrievable for audit purposes

---

## FRONTEND IMPLEMENTATION RULES

### Component Rendering
All UI components MUST:
1. Use exact status enum values (valid, expired, revoked, pending_verification)
2. Use exact certification_type from preset list
3. Display `proof_file_url` or explicit "No certification image on file"
4. Never fabricate certification data
5. Never modify certifications in read-only contexts (QR verification)

### Status Badge Mapping
```typescript
const certStatusConfig = {
  valid: {
    label: 'Valid',
    icon: CheckCircle2,
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  expired: {
    label: 'Expired',
    icon: AlertTriangle,
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  revoked: {
    label: 'Revoked',
    icon: Ban,
    className: 'bg-red-500/10 text-red-400 border-red-500/20'
  },
  pending_verification: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  }
};
```

### Proof Image Display
**Employee Detail Page:**
```tsx
{certification.proof_file_url ? (
  <img 
    src={certification.proof_file_url} 
    alt={`${certification.certification_type} proof`}
    className="w-full h-48 object-cover rounded-lg"
  />
) : (
  <div className="text-sm text-slate-500">
    No certification image on file
  </div>
)}
```

**QR Verification Page:**
```tsx
{certification.proof_file_url ? (
  <div className="mt-3">
    <img 
      src={certification.proof_file_url} 
      alt="Certification proof"
      className="w-full rounded-lg border border-slate-700"
    />
  </div>
) : (
  <p className="text-sm text-slate-500 mt-2">
    No certification image on file
  </p>
)}
```

### Add Certification Form
```tsx
// Certification type dropdown (locked presets)
<select name="certification_type" required>
  {CERTIFICATION_TYPES.map(type => (
    <option key={type} value={type}>{type}</option>
  ))}
</select>

// Proof document upload (MANDATORY in UI flow)
<input 
  type="file" 
  accept="image/*,application/pdf"
  onChange={handleProofUpload}
  required
/>
```

---

## BACKGROUND JOB INTEGRATION

### Certification Expiration Job
**Frequency:** Daily (cron: 0 2 * * *)

**Logic:**
```typescript
const expiredCerts = await prisma.certification.findMany({
  where: {
    expiration_date: { lt: new Date() },
    status: 'valid'
  }
});

for (const cert of expiredCerts) {
  await prisma.certification.update({
    where: { id: cert.id },
    data: { status: 'expired' }
  });
  
  // Generate audit event
  await prisma.immutableEventLedger.create({
    data: {
      event_type: 'certification_expired',
      description: `Certification ${cert.certification_type} expired`,
      severity: 'warning',
      actor: 'SYSTEM',
      payload: { certification_id: cert.id }
    }
  });
  
  // Re-evaluate employee status
  await recalculateEmployeeStatus(cert.employee_id);
}
```

### Compliance Scoring
Certifications feed into employee compliance status:
- All certs valid → Employee status = "compliant"
- Any cert expired → Employee status = "non_compliant"
- Any cert revoked → Employee status = "blocked"
- Missing required certs → Employee status = "non_compliant"

---

## ENFORCEMENT CHECKLIST

Before deploying any Certification-related code, verify:

- [ ] All field names match this schema exactly
- [ ] Status uses only: valid, expired, revoked, pending_verification
- [ ] Certification types are from locked preset list
- [ ] Required fields (employee_id, certification_type) are enforced
- [ ] Proof images are displayed in Employee Detail, QR Verification
- [ ] Proof upload is prominent in Add Certification form
- [ ] No additional fields introduced
- [ ] No enum aliases used
- [ ] Employee foreign key enforced
- [ ] Prisma model aligns with this schema
- [ ] API contracts match this definition
- [ ] Frontend components render from this schema
- [ ] Background jobs generate audit events
- [ ] QR verification is read-only

---

## REGULATOR COMPLIANCE

This schema is designed for:
- ✅ **FRA audits** — Proof that worker had valid certification at incident time
- ✅ **OSHA audits** — Safety training compliance verification
- ✅ **Legal discovery** — Immutable certification history
- ✅ **Insurance claims** — Evidence of certification status

**AUDIT DEFENSIBILITY:**
- Certification + Employee + VerificationEvent + ImmutableEventLedger = Complete audit trail
- Proof documents are preserved permanently
- Status transitions are audited
- Expiration is detected and recorded automatically
- No retroactive modification possible

---

## MIGRATION NOTES

**If prior implementations used different field names:**

### Legacy → Canonical Mapping
| Legacy Field | Canonical Field | Action |
|--------------|-----------------|--------|
| `cert_type` | `certification_type` | Rename in database/API |
| `cert_status` | `status` | Rename in database/API |
| `active` status | `valid` | Map on read, update backend |
| `inactive` status | `expired` | Map on read, update backend |
| `proof_url` | `proof_file_url` | Rename in database/API |
| `proof_image` | `proof_file_url` | Rename in database/API |

**⚠️ CRITICAL:** All legacy field support must be transient. The canonical schema is the only valid long-term contract.

---

## RELATIONSHIP TO OTHER ENTITIES

### Certification → Employee
- **Type:** Many-to-One
- **Foreign Key:** `employee_id` references `Employee.employee_id`
- **Delete Behavior:** Restrict (cannot delete employee with certifications)

### Certification → EvidenceNode
- **Type:** One-to-Many
- **Purpose:** Link certification to evidence chain
- **Usage:** Audit trail, regulator review

### Certification → ImmutableEventLedger
- **Type:** Indirect (via events)
- **Purpose:** Certification lifecycle events (created, expired, revoked)
- **Usage:** Audit trail, compliance reporting

---

**🔒 END OF CANONICAL CERTIFICATION ENTITY DEFINITION**

_Any code that violates this contract is non-compliant and must be corrected._
