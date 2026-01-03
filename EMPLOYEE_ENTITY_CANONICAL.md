# 🔐 EMPLOYEE ENTITY — CANONICAL SCHEMA (LOCKED)

**THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL EMPLOYEE DATA**

All Employee reads, writes, validations, and UI rendering MUST conform to this schema.

---

## ENTITY DEFINITION

```json
{
  "name": "Employee",
  "type": "object",
  "properties": {
    "full_name": {
      "type": "string",
      "description": "Employee's full name",
      "required": true
    },
    "employee_id": {
      "type": "string",
      "description": "Unique employee identifier",
      "required": true
    },
    "employer": {
      "type": "string",
      "description": "Company or contractor name",
      "required": true
    },
    "role": {
      "type": "string",
      "description": "Job title or role"
    },
    "industry": {
      "type": "string",
      "enum": [
        "railroad",
        "construction",
        "environmental",
        "general"
      ],
      "description": "Industry sector"
    },
    "status": {
      "type": "string",
      "enum": [
        "compliant",
        "non_compliant",
        "pending",
        "blocked"
      ],
      "default": "pending",
      "description": "Current compliance status"
    },
    "qr_code": {
      "type": "string",
      "description": "Unique QR code identifier (server-generated only)",
      "immutable": true
    },
    "photo_url": {
      "type": "string",
      "description": "Employee photo URL (optional, must be persistent)"
    },
    "email": {
      "type": "string",
      "description": "Contact email"
    },
    "phone": {
      "type": "string",
      "description": "Contact phone"
    }
  },
  "required": [
    "full_name",
    "employee_id",
    "employer"
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

### 2. STATUS SEMANTICS (GLOBAL)
The following status values are FINAL and apply across ALL contexts:

| Status | Meaning | Color | Usage |
|--------|---------|-------|-------|
| `compliant` | All certifications valid, no blocks | Emerald | Dashboard, QR Verification |
| `non_compliant` | Missing or expired certifications | Amber | Dashboard, Alerts |
| `pending` | Initial state, verification incomplete | Blue | Dashboard, Onboarding |
| `blocked` | Hard stop, cannot work | Red | Dashboard, QR Verification, Enforcement |

**❌ NO ALIASES ALLOWED**
- DO NOT use "active" instead of "compliant"
- DO NOT use "approved" instead of "compliant"
- DO NOT use "suspended" instead of "blocked"

### 3. INDUSTRY SEMANTICS (GLOBAL)
The following industry values are FINAL:

| Industry | Label | Examples |
|----------|-------|----------|
| `railroad` | Railroad | Track Maintenance, Signal, FRA roles |
| `construction` | Construction | General contractors, builders |
| `environmental` | Environmental | Remediation, compliance |
| `general` | General | All other industries |

### 4. QR CODE RULE (CRITICAL)
- ✅ `qr_code` MUST be globally unique
- ✅ `qr_code` MUST be generated **server-side only**
- ❌ `qr_code` MUST **NEVER** be editable client-side
- ❌ `qr_code` MUST **NEVER** be user-provided

**Enforcement:**
- Backend generates QR code on employee creation
- QR code is immutable after creation
- UI displays QR code read-only

### 5. REQUIRED FIELDS (ENFORCED)
Backend MUST reject creates/updates missing:
- `full_name` — Employee's full legal name
- `employee_id` — Unique identifier (company-provided)
- `employer` — Company or contractor name

### 6. IMAGE RULE (OPTIONAL BUT STRICT)
- `photo_url` is **OPTIONAL**
- If present, it MUST be a persistent, retrievable URL
- UI may show placeholders (user icon) when missing
- UI MUST NOT fabricate avatars beyond placeholders
- UI MUST NOT generate synthetic images

---

## SYSTEM CONSTRAINTS (ENFORCED)

### Employees Are NOT Users
- ❌ Employees do **NOT** authenticate
- ❌ Employees do **NOT** have passwords
- ❌ Employees do **NOT** have sessions
- ✅ Employees are **compliance subjects only**
- ✅ Employees are **verified via QR codes**

### Audit Requirements
- All employee status changes MUST generate audit events
- All employee verification attempts MUST generate ledger entries
- Employee deletions MUST be restricted or soft-blocked at backend
- No historical employee data may be mutated

### Relationships
- Employees → Certifications (one-to-many)
- Employees → VerificationEvents (one-to-many)
- Employees → Organizations (many-to-one)
- Employees → EvidenceNodes (one-to-many, via linkages)

---

## FAILURE CONDITIONS

**The following trigger IMMEDIATE FAILURE:**

1. ❌ Any field added to this schema
2. ❌ Any field removed from this schema
3. ❌ Any enum value modified
4. ❌ `qr_code` generated client-side
5. ❌ Status aliases used ("active", "approved", etc.)
6. ❌ Schema diverges across services (frontend vs backend)
7. ❌ Required fields not enforced
8. ❌ Photo URLs fabricated or synthetic

---

## SYSTEM IMPACT (CONFIRMED)

This entity definition is now **authoritative** for:

✅ **Dashboard Employee Table** — Row rendering, status badges  
✅ **StatsOverview** — Compliant/blocked calculations  
✅ **Recent Activity** — Employee name lookups  
✅ **Audit Timeline** — Employee event attribution  
✅ **QR Verification** — Public employee lookup  
✅ **Certification Linkage** — Employee-to-cert relationships  
✅ **API Contracts** — GET/POST /api/employees endpoints  
✅ **Database Schema** — Prisma Employee model  

---

## PRISMA MODEL ALIGNMENT

The Prisma schema MUST align exactly:

```prisma
model Employee {
  id          String   @id @default(cuid())
  full_name   String
  employee_id String   @unique
  employer    String
  role        String?
  industry    Industry @default(general)
  status      EmployeeStatus @default(pending)
  qr_code     String   @unique
  photo_url   String?
  email       String?
  phone       String?
  
  // Relations
  organization_id String?
  organization    Organization? @relation(fields: [organization_id], references: [id])
  certifications  Certification[]
  verifications   VerificationEvent[]
  
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}

enum Industry {
  railroad
  construction
  environmental
  general
}

enum EmployeeStatus {
  compliant
  non_compliant
  pending
  blocked
}
```

---

## API CONTRACT ENFORCEMENT

### GET /api/employees
**Returns:**
```typescript
{
  id: string;
  full_name: string;
  employee_id: string;
  employer: string;
  role?: string;
  industry: 'railroad' | 'construction' | 'environmental' | 'general';
  status: 'compliant' | 'non_compliant' | 'pending' | 'blocked';
  qr_code: string;
  photo_url?: string;
  email?: string;
  phone?: string;
}[]
```

### POST /api/employees
**Accepts:**
```typescript
{
  full_name: string;        // REQUIRED
  employee_id: string;      // REQUIRED
  employer: string;         // REQUIRED
  role?: string;
  industry?: 'railroad' | 'construction' | 'environmental' | 'general';
  photo_url?: string;
  email?: string;
  phone?: string;
  // status: auto-set to "pending"
  // qr_code: auto-generated server-side
}
```

**Backend MUST:**
1. Validate required fields
2. Auto-generate unique `qr_code`
3. Set `status` to "pending" by default
4. Reject if `employee_id` already exists
5. Generate audit event for creation

---

## FRONTEND IMPLEMENTATION RULES

### Component Rendering
All UI components MUST:
1. Use `full_name` for display (no firstName/lastName splitting)
2. Use exact status enum values (compliant, non_compliant, pending, blocked)
3. Use exact industry enum values (railroad, construction, environmental, general)
4. Display `photo_url` or placeholder only
5. Never fabricate employee data

### Status Badge Mapping
```typescript
const statusConfig = {
  compliant: {
    label: 'Compliant',
    icon: Shield,
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  non_compliant: {
    label: 'Non-Compliant',
    icon: AlertTriangle,
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  },
  blocked: {
    label: 'Blocked',
    icon: Ban,
    className: 'bg-red-500/10 text-red-400 border-red-500/20'
  }
};
```

### Industry Label Mapping
```typescript
const industryLabels = {
  railroad: 'Railroad',
  construction: 'Construction',
  environmental: 'Environmental',
  general: 'General'
};
```

---

## ENFORCEMENT CHECKLIST

Before deploying any Employee-related code, verify:

- [ ] All field names match this schema exactly
- [ ] Status uses only: compliant, non_compliant, pending, blocked
- [ ] Industry uses only: railroad, construction, environmental, general
- [ ] Required fields (full_name, employee_id, employer) are enforced
- [ ] QR codes are server-generated only
- [ ] Photo URLs are never fabricated
- [ ] No additional fields introduced
- [ ] No enum aliases used
- [ ] Prisma model aligns with this schema
- [ ] API contracts match this definition
- [ ] Frontend components render from this schema

---

## MIGRATION NOTES

**If prior implementations used different field names:**

### Legacy → Canonical Mapping
| Legacy Field | Canonical Field | Action |
|--------------|-----------------|--------|
| `firstName` + `lastName` | `full_name` | Concatenate on read, deprecate splits |
| `employeeId` | `employee_id` | Rename in database/API |
| `company` | `employer` | Rename in database/API |
| `active` status | `compliant` | Map on read, update backend |
| `suspended` status | `blocked` | Map on read, update backend |

**⚠️ CRITICAL:** All legacy field support must be transient. The canonical schema is the only valid long-term contract.

---

## REGULATOR COMPLIANCE

This schema is designed for:
- ✅ **FRA audits** — Railroad worker compliance tracking
- ✅ **OSHA audits** — Safety certification verification
- ✅ **Legal discovery** — Immutable employee verification history
- ✅ **Insurance claims** — Proof of certification at incident time

**NO FURTHER INTERPRETATION IS ALLOWED.**

---

**🔒 END OF CANONICAL EMPLOYEE ENTITY DEFINITION**

_Any code that violates this contract is non-compliant and must be corrected._
