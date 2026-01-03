# 🔐 AUDIT EVENT ENTITY — CANONICAL SCHEMA (LOCKED)

**THIS IS THE IMMUTABLE SYSTEM LEDGER**

All compliance-significant actions MUST generate an AuditEvent. This entity is append-only and immutable.

---

## ENTITY DEFINITION

```json
{
  "name": "AuditEvent",
  "type": "object",
  "properties": {
    "event_type": {
      "type": "string",
      "enum": [
        "certification_issued",
        "certification_expired",
        "employee_blocked",
        "qr_scanned",
        "audit_accessed",
        "incident_reported",
        "enforcement_action"
      ],
      "description": "Type of audit event",
      "required": true
    },
    "entity_type": {
      "type": "string",
      "description": "Type of entity affected (Employee, Certification, etc.)"
    },
    "entity_id": {
      "type": "string",
      "description": "ID of entity affected (nullable for system-wide events)"
    },
    "actor": {
      "type": "string",
      "description": "Who or what triggered the event (user ID, system, public_qr)"
    },
    "description": {
      "type": "string",
      "description": "Human-readable description for auditors",
      "required": true
    },
    "metadata": {
      "type": "object",
      "description": "Additional evidentiary context (immutable references only)"
    },
    "severity": {
      "type": "string",
      "enum": [
        "info",
        "warning",
        "critical"
      ],
      "default": "info",
      "description": "Event severity level"
    }
  },
  "required": [
    "event_type",
    "description"
  ]
}
```

---

## HARD RULES (NON-NEGOTIABLE)

### 1. ABSOLUTE IMMUTABILITY
**This is the system ledger. It must be tamper-proof.**

- ✅ AuditEvents are **APPEND-ONLY**
- ❌ **NO updates** — Once created, records CANNOT be modified
- ❌ **NO deletes** — Records CANNOT be removed (soft or hard)
- ❌ **NO backfills** — Historical events cannot be fabricated retroactively
- ✅ Only valid operation: CREATE (insert)

**Why this matters:**
- Legal discovery requires untampered audit trail
- Regulator audits require proof of sequence
- Incident reconstruction depends on accurate timeline
- Any mutation undermines evidentiary integrity
- Tampering can result in criminal charges (Sarbanes-Oxley, GDPR)

### 2. SINGLE SOURCE OF TRUTH
- ❌ **NO alternate audit tables** — This is the only audit log
- ❌ **NO UI-only audit logs** — All events must be server-generated
- ❌ **NO inferred/reconstructed history** — Events must be created at time of action
- ✅ All compliance-significant actions flow through this table

### 3. EVENT TYPE ENUM (🔒 LOCKED)
The following event types are FINAL:

| Event Type | Meaning | Context |
|------------|---------|---------|
| `certification_issued` | New certification created | Manual upload, system verification |
| `certification_expired` | Certification past expiration | Background job detection |
| `employee_blocked` | Employee status → blocked | Enforcement action, revoked cert |
| `qr_scanned` | QR code verification event | Public scan, gate access |
| `audit_accessed` | Regulator/auditor accessed data | Compliance review, legal discovery |
| `incident_reported` | Safety incident recorded | Accident, near-miss, violation |
| `enforcement_action` | Enforcement decision made | Block, unblock, revoke |

**❌ NO ADDITIONAL VALUES ALLOWED**
**❌ NO ALIASES** (e.g. "cert_created", "scan", "access")
**❌ NO RENAMING**

### 4. SEVERITY ENUM (🔒 LOCKED)
The following severity values are FINAL:

| Severity | Meaning | Color | Usage |
|----------|---------|-------|-------|
| `info` | Normal operational event | Slate | QR scans, cert issued |
| `warning` | Attention required | Amber | Cert expiring soon, non-compliant |
| `critical` | Urgent action required | Red | Employee blocked, incident reported |

**Default:** `info` for all events unless specified

### 5. ENTITY REFERENCE RULE (CRITICAL)
**Every audit event should reference the affected entity.**

**entity_type:**
- `"Employee"` — Event affects an employee
- `"Certification"` — Event affects a certification
- `"VerificationLog"` — Event affects a verification
- `"Organization"` — Event affects an organization
- `null` — System-wide event (no specific entity)

**entity_id:**
- MUST be the ID (CUID, UUID) of the affected record
- MAY be null ONLY for system-wide events (e.g. "System started")
- MUST NOT be a mutable reference (use ID, not name)

**Examples:**
```typescript
// Certification expired
{
  event_type: 'certification_expired',
  entity_type: 'Certification',
  entity_id: 'cert_abc123',
  actor: 'system',
  description: 'OSHA 30-Hour certification expired for John Doe'
}

// Employee blocked
{
  event_type: 'employee_blocked',
  entity_type: 'Employee',
  entity_id: 'emp_xyz789',
  actor: 'admin_user_456',
  description: 'Employee blocked due to failed drug test'
}

// QR scan
{
  event_type: 'qr_scanned',
  entity_type: 'Employee',
  entity_id: 'emp_def456',
  actor: 'public_qr',
  description: 'QR code scanned at Construction Site A'
}
```

### 6. ACTOR RULE (CRITICAL)
**Actor must identify who/what triggered the event.**

**Valid actor values:**
- `"system"` — Automated system action (background jobs)
- `"admin"` — Admin user (generic)
- `"user:<user_id>"` — Specific authenticated user
- `"public_qr"` — Public QR scan (unauthenticated)
- `"regulator:<org>"` — External auditor/regulator
- `"api:<client_id>"` — API client

**❌ Actor MUST NOT be inferred client-side**
**✅ Actor MUST be determined server-side based on session/context**

### 7. DESCRIPTION RULE (HUMAN-READABLE)
**Description must be understandable without UI context.**

**Good descriptions:**
- ✅ "OSHA 30-Hour certification issued for John Doe (EMP123) by admin user Alice"
- ✅ "Employee Jane Smith (EMP456) blocked due to expired FRA Track Safety certification"
- ✅ "QR code scanned for employee Bob Jones (EMP789) at Warehouse 3 - Result: Verified"

**Bad descriptions:**
- ❌ "Cert updated" — Too vague
- ❌ "Status changed" — Missing context
- ❌ "Action performed" — Not specific enough

**Template examples:**
```typescript
// Certification issued
`${certification_type} certification issued for ${employee_name} (${employee_id}) by ${actor}`

// Employee blocked
`Employee ${employee_name} (${employee_id}) blocked due to ${reason}`

// QR scanned
`QR code scanned for employee ${employee_name} (${employee_id}) at ${location} - Result: ${result}`
```

### 8. METADATA RULE (EVIDENTIARY CONTEXT)
**Metadata is optional but valuable for forensic analysis.**

**What SHOULD be in metadata:**
```typescript
{
  ip_address: '192.168.1.1',           // Source IP
  user_agent: 'Mozilla/5.0...',        // Browser/client
  previous_value: 'compliant',         // State before change
  new_value: 'blocked',                // State after change
  certification_type: 'OSHA 30-Hour',  // Specific cert affected
  location: 'Construction Site A',     // Where action occurred
  reason: 'Failed drug test',          // Why action was taken
  verification_log_id: 'vlog_123'      // Related verification
}
```

**What MUST NOT be in metadata:**
- ❌ Mutable references (foreign keys to live entities)
- ❌ Sensitive PII beyond audit necessity
- ❌ Client-side computed values
- ❌ UI state or session data

### 9. CREATION RULE (SERVER-SIDE ONLY)
**All AuditEvents MUST be created server-side.**

**Valid creation contexts:**
- ✅ API route handlers (Next.js API routes)
- ✅ Background jobs (cron tasks)
- ✅ Prisma middleware (on model create/update)
- ✅ Enforcement logic (blocking decisions)

**Invalid creation contexts:**
- ❌ Client-side React components
- ❌ Frontend event handlers
- ❌ Browser DevTools console
- ❌ Direct database inserts by users

### 10. REQUIRED FIELDS (ENFORCED)
Backend MUST reject creates missing:
- `event_type` — Type from locked enum
- `description` — Human-readable description

**Optional but recommended:**
- `entity_type` — Type of affected entity
- `entity_id` — ID of affected entity
- `actor` — Who triggered event
- `metadata` — Additional context
- `severity` — Event severity (defaults to "info")

---

## SYSTEM CONSTRAINTS (ENFORCED)

### AuditEvents Are Not Business Logic
- ❌ AuditEvents do **NOT change state**
- ✅ AuditEvents **RECORD that state changed**
- ✅ AuditEvents are **side effects of state changes**
- ✅ AuditEvents are **evidence, not actions**

### Migration Safety
- ✅ AuditEvents **MUST survive data migrations intact**
- ❌ AuditEvents **CANNOT be deleted during migrations**
- ❌ AuditEvents **CANNOT be "cleaned up" or archived**
- ✅ Old events remain readable even if schema evolves

### Export Requirements
- ✅ AuditEvents **MUST be exportable for regulators**
- ✅ Export format: JSON, CSV, or structured PDF
- ✅ Export MUST include all fields (no filtering)
- ✅ Export MUST preserve chronological order

### Tamper Resistance
- ✅ AuditEvents are **time-ordered** (created_at)
- ✅ AuditEvents are **immutable** (no updated_at field)
- ❌ AuditEvents **CANNOT be reordered** retroactively
- ✅ Gaps in sequence indicate tampering attempts

---

## FAILURE CONDITIONS

**The following trigger IMMEDIATE FAILURE:**

1. ❌ AuditEvent records are editable (updates allowed)
2. ❌ AuditEvent records are deletable
3. ❌ Event type or severity enums modified
4. ❌ Client-side creation of AuditEvents
5. ❌ Backfilling historical events
6. ❌ Audit history deletion or rewriting
7. ❌ Description is missing or too vague
8. ❌ Actor is client-side inferred
9. ❌ Metadata contains mutable references
10. ❌ Events created without triggering action

---

## SYSTEM IMPACT (CONFIRMED)

This entity definition is now **authoritative** for:

✅ **Audit Vault Page** — Read-only ledger display  
✅ **Dashboard Audit Timeline** — Recent audit events  
✅ **Regulator Evidence Exports** — Legal discovery, compliance audits  
✅ **Incident Reconstruction** — Post-incident timeline analysis  
✅ **Enforcement Traceability** — Proof of blocking decisions  
✅ **Dispute Resolution** — Evidence of system actions  
✅ **API Contracts** — GET /api/audit-events endpoint  
✅ **Database Schema** — Prisma ImmutableEventLedger model  

---

## PRISMA MODEL ALIGNMENT

The Prisma schema MUST align exactly:

```prisma
model ImmutableEventLedger {
  id          String   @id @default(cuid())
  event_type  AuditEventType
  entity_type String?
  entity_id   String?
  actor       String?
  description String
  metadata    Json?
  severity    AuditSeverity @default(info)
  
  created_at  DateTime @default(now())
  // NO updated_at — records are immutable
  
  @@index([event_type])
  @@index([entity_type, entity_id])
  @@index([actor])
  @@index([severity])
  @@index([created_at])
}

enum AuditEventType {
  certification_issued
  certification_expired
  employee_blocked
  qr_scanned
  audit_accessed
  incident_reported
  enforcement_action
}

enum AuditSeverity {
  info
  warning
  critical
}
```

**CRITICAL NOTES:**
- ✅ NO `updated_at` field — Records are immutable
- ✅ Indexes on `event_type`, `entity_type/entity_id`, `actor`, `severity`, `created_at` for performance
- ✅ `metadata` is JSON — Flexible structure for context
- ✅ Model name: `ImmutableEventLedger` (emphasizes immutability)

---

## API CONTRACT ENFORCEMENT

### GET /api/audit-events
**Query Parameters:**
```typescript
{
  limit?: number;              // Max results (default 100)
  event_type?: AuditEventType; // Filter by type
  severity?: AuditSeverity;    // Filter by severity
  entity_type?: string;        // Filter by entity
  entity_id?: string;          // Filter by specific entity
  actor?: string;              // Filter by actor
  start_date?: string;         // Filter by date range
  end_date?: string;
}
```

**Returns:**
```typescript
{
  id: string;
  event_type: 'certification_issued' | 'certification_expired' | 'employee_blocked' | 'qr_scanned' | 'audit_accessed' | 'incident_reported' | 'enforcement_action';
  entity_type?: string;
  entity_id?: string;
  actor?: string;
  description: string;
  metadata?: object;
  severity: 'info' | 'warning' | 'critical';
  created_at: string;
}[]
```

### POST /api/audit-events
**⚠️ RESTRICTED TO SERVER-SIDE ONLY**

Backend internal function (not exposed as public API):
```typescript
async function createAuditEvent(data: {
  event_type: AuditEventType;
  entity_type?: string;
  entity_id?: string;
  actor?: string;
  description: string;
  metadata?: object;
  severity?: AuditSeverity;
}) {
  return prisma.immutableEventLedger.create({
    data: {
      ...data,
      severity: data.severity || 'info'
    }
  });
}
```

**Usage in API routes:**
```typescript
// After creating certification
await createAuditEvent({
  event_type: 'certification_issued',
  entity_type: 'Certification',
  entity_id: cert.id,
  actor: session.user.id,
  description: `${cert.certification_type} issued for ${employee.full_name}`,
  metadata: {
    employee_id: employee.employee_id,
    issuing_authority: cert.issuing_authority
  },
  severity: 'info'
});
```

---

## FRONTEND IMPLEMENTATION RULES

### Component Rendering
All UI components MUST:
1. Use exact event_type enum values
2. Use exact severity enum values
3. Display events as read-only (no edit/delete)
4. Never attempt to create audit events client-side
5. Format timestamps consistently

### Event Type Icon Mapping
```typescript
const eventTypeConfig = {
  certification_issued: {
    icon: FileCheck,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500',
    label: 'Certification Issued'
  },
  certification_expired: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500',
    label: 'Certification Expired'
  },
  employee_blocked: {
    icon: Ban,
    color: 'text-red-400',
    bg: 'bg-red-500',
    label: 'Employee Blocked'
  },
  qr_scanned: {
    icon: QrCode,
    color: 'text-blue-400',
    bg: 'bg-blue-500',
    label: 'QR Scanned'
  },
  audit_accessed: {
    icon: Eye,
    color: 'text-slate-400',
    bg: 'bg-slate-500',
    label: 'Audit Accessed'
  },
  incident_reported: {
    icon: FileWarning,
    color: 'text-red-400',
    bg: 'bg-red-500',
    label: 'Incident Reported'
  },
  enforcement_action: {
    icon: Gavel,
    color: 'text-violet-400',
    bg: 'bg-violet-500',
    label: 'Enforcement Action'
  }
};
```

### Severity Badge Mapping
```typescript
const severityConfig = {
  info: {
    className: 'border-slate-700/50',
    label: 'Info',
    color: 'text-slate-400'
  },
  warning: {
    className: 'border-amber-500/30',
    label: 'Warning',
    color: 'text-amber-400'
  },
  critical: {
    className: 'border-red-500/30',
    label: 'Critical',
    color: 'text-red-400'
  }
};
```

### Audit Vault Component
**Display audit events with filters:**
```tsx
<AuditTimeline 
  events={auditEvents}  // Array of AuditEvent entities
/>
```

Component MUST:
- Render events from props only (no fetching)
- Display event_type with icon
- Display severity with border emphasis
- Format description
- Show actor and timestamp
- Allow expanding metadata
- Never modify events

### Dashboard Audit Timeline Component
```tsx
{events.map((event, i) => (
  <div key={event.id}>
    <EventIcon className={config.color} />
    <p className="text-white">{event.description}</p>
    {event.actor && <p className="text-slate-400">by {event.actor}</p>}
    <span className="text-slate-500">
      {format(new Date(event.created_at), 'MMM d, h:mm a')}
    </span>
  </div>
))}
```

---

## BACKGROUND JOB INTEGRATION

### Certification Expiration Job
```typescript
const expiredCerts = await prisma.certification.findMany({
  where: {
    expiration_date: { lt: new Date() },
    status: 'valid'
  }
});

for (const cert of expiredCerts) {
  // Update certification status
  await prisma.certification.update({
    where: { id: cert.id },
    data: { status: 'expired' }
  });
  
  // Create audit event
  await createAuditEvent({
    event_type: 'certification_expired',
    entity_type: 'Certification',
    entity_id: cert.id,
    actor: 'system',
    description: `${cert.certification_type} expired for employee ${employee.full_name}`,
    metadata: {
      employee_id: cert.employee_id,
      expiration_date: cert.expiration_date.toISOString()
    },
    severity: 'warning'
  });
}
```

### Employee Blocking (Enforcement Action)
```typescript
// Block employee due to revoked certification
await prisma.employee.update({
  where: { employee_id: 'EMP123' },
  data: { status: 'blocked' }
});

// Create audit events
await createAuditEvent({
  event_type: 'employee_blocked',
  entity_type: 'Employee',
  entity_id: employee.id,
  actor: session.user.id,
  description: `Employee ${employee.full_name} blocked due to revoked ${cert.certification_type} certification`,
  metadata: {
    employee_id: employee.employee_id,
    reason: 'Revoked certification',
    certification_id: cert.id
  },
  severity: 'critical'
});

await createAuditEvent({
  event_type: 'enforcement_action',
  entity_type: 'Employee',
  entity_id: employee.id,
  actor: session.user.id,
  description: `Enforcement action: Employee ${employee.full_name} prohibited from work`,
  metadata: {
    action_type: 'block',
    justification: 'Safety certification revoked'
  },
  severity: 'critical'
});
```

### QR Scan Event
```typescript
// After QR verification
await createAuditEvent({
  event_type: 'qr_scanned',
  entity_type: 'Employee',
  entity_id: employee.id,
  actor: 'public_qr',
  description: `QR code scanned for employee ${employee.full_name} at ${location} - Result: ${result}`,
  metadata: {
    employee_id: employee.employee_id,
    qr_code: qrCode,
    location: location,
    result: result,
    ip_address: request.ip
  },
  severity: result === 'verified' ? 'info' : 'warning'
});
```

---

## ENFORCEMENT CHECKLIST

Before deploying any AuditEvent-related code, verify:

- [ ] Records are append-only (no updates, no deletes)
- [ ] All field names match this schema exactly
- [ ] event_type uses only locked enum values
- [ ] severity uses only locked enum values
- [ ] Required fields (event_type, description) are enforced
- [ ] entity_type and entity_id properly reference affected entities
- [ ] Actor is determined server-side, not client-side
- [ ] Description is human-readable and sufficient for auditors
- [ ] Metadata contains no mutable references
- [ ] No additional fields introduced
- [ ] No enum aliases used
- [ ] Prisma model has NO updated_at field
- [ ] API endpoint is read-only (GET only)
- [ ] Server-side creation function exists
- [ ] All state changes trigger audit events
- [ ] Frontend components display events read-only

---

## REGULATOR COMPLIANCE

This schema is designed for:
- ✅ **FRA audits** — Compliance event timeline
- ✅ **OSHA audits** — Safety incident audit trail
- ✅ **Legal discovery** — Immutable evidence of system actions
- ✅ **SOC 2 audits** — Access control and change tracking
- ✅ **GDPR compliance** — Data access and modification logs

**AUDIT DEFENSIBILITY:**
- AuditEvent + ImmutableEventLedger = Complete system audit trail
- Every compliance action is recorded
- Timeline cannot be altered
- Actor accountability preserved
- Metadata provides forensic context

**REGULATORY QUESTIONS THIS ANSWERS:**
1. "What happened to this employee's certification?"
   → Check audit events for certification_issued, certification_expired
2. "Who blocked this employee and why?"
   → Check audit events for employee_blocked with actor and metadata
3. "Was this employee authorized to work on [date]?"
   → Check qr_scanned events around that date
4. "Who accessed this audit data?"
   → Check audit_accessed events with actor
5. "Has this audit trail been tampered with?"
   → No updated_at field = immutable, gaps indicate tampering

---

## MIGRATION NOTES

**If prior implementations used different table names:**

### Legacy → Canonical Mapping
| Legacy Table | Canonical Table | Action |
|--------------|-----------------|--------|
| `audit_log` | `ImmutableEventLedger` | Rename + preserve data |
| `event_log` | `ImmutableEventLedger` | Rename + preserve data |
| `activity_log` | `ImmutableEventLedger` | Rename + preserve data |

**⚠️ CRITICAL:** 
- All historical audit data MUST be migrated intact
- No data loss during migration
- Preserve chronological order
- Maintain all timestamps

---

## RELATIONSHIP TO OTHER ENTITIES

### AuditEvent → Employee
- **Type:** Indirect (via entity_type + entity_id)
- **Purpose:** Track employee lifecycle events
- **Usage:** Employee blocked, QR scanned

### AuditEvent → Certification
- **Type:** Indirect (via entity_type + entity_id)
- **Purpose:** Track certification lifecycle
- **Usage:** Cert issued, expired, revoked

### AuditEvent → VerificationLog
- **Type:** Complementary
- **Purpose:** AuditEvent records that verification happened, VerificationLog records details
- **Usage:** QR scans generate both

### AuditEvent → EvidenceNode
- **Type:** Optional linkage
- **Purpose:** Link audit events to evidence chain
- **Usage:** Legal discovery, regulator review

---

## EXPORT FORMATS

### JSON Export
```json
[
  {
    "id": "evt_abc123",
    "event_type": "certification_issued",
    "entity_type": "Certification",
    "entity_id": "cert_xyz789",
    "actor": "user:admin_456",
    "description": "OSHA 30-Hour certification issued for John Doe (EMP123) by admin Alice",
    "metadata": {
      "employee_id": "EMP123",
      "issuing_authority": "OSHA Training Institute"
    },
    "severity": "info",
    "created_at": "2026-01-03T14:30:00Z"
  }
]
```

### CSV Export
```csv
id,event_type,entity_type,entity_id,actor,description,severity,created_at
evt_abc123,certification_issued,Certification,cert_xyz789,user:admin_456,"OSHA 30-Hour certification issued for John Doe (EMP123) by admin Alice",info,2026-01-03T14:30:00Z
```

### Regulator Report (PDF)
Should include:
- Company header
- Date range
- Event count by type
- Event count by severity
- Full event listing (chronological)
- Signature/attestation block

---

**🔒 END OF CANONICAL AUDIT EVENT ENTITY DEFINITION**

_Any code that violates this contract is non-compliant and must be corrected._

_Audit events are legal evidence. Treat them as court documents._
