# Component Library Documentation

## Overview

This component library implements the **FIGMA-READY COMPONENT SPECS** for the System of Proof platform. All components are:

- ✅ **Fully typed** (TypeScript)
- ✅ **Semantic** (status colors immutable, non-themeable)
- ✅ **Evidence-first** (no mutations, immutable history)
- ✅ **Audit-defensible** (all actions tracked)
- ✅ **1:1 Figma mapping** (matches design specs exactly)

---

## Components

### 1. StatusBadge

**File:** `components/StatusBadge.tsx`

**Purpose:** Display certification/enforcement status with semantic colors.

**Props:**
```typescript
{
  status: 'PASS' | 'FAIL' | 'INCOMPLETE' | 'valid' | 'expiring' | 'expired' | 'revoked' | 'blocked';
  timestamp?: Date | string;
  className?: string;
}
```

**Semantic Colors (IMMUTABLE):**
- `PASS` / `valid` → `#16A34A` (green)
- `expiring` / `INCOMPLETE` → `#F59E0B` (amber)
- `expired` / `FAIL` → `#DC2626` (red)
- `revoked` → `#7C2D12` (dark red)
- `blocked` → `#991B1B` (dark red)

**Usage:**
```tsx
import { StatusBadge } from '@/components';

<StatusBadge status="PASS" timestamp={new Date()} />
<StatusBadge status="expired" />
```

**Rules:**
- ❌ Colors cannot be overridden (semantic)
- ✅ Tooltip shows "Evaluated at {timestamp}"
- ✅ Used for: Certifications, Enforcement Actions, QR status

---

### 2. EvidenceLink

**File:** `components/EvidenceLink.tsx`

**Purpose:** Clickable link that opens read-only evidence drawer.

**Props:**
```typescript
{
  evidenceNodeId: string;
  label: string;
  className?: string;
}
```

**Usage:**
```tsx
import { EvidenceLink } from '@/components';

<EvidenceLink 
  evidenceNodeId="abc-123-def-456"
  label="QR Scan"
/>
```

**Behavior:**
- Opens `EvidenceDrawer` on click
- Shows evidence node + ledger entries
- Read-only (no edit/delete)

---

### 3. EvidenceDrawer

**File:** `components/EvidenceDrawer.tsx`

**Purpose:** Side drawer showing evidence node details.

**Props:**
```typescript
{
  evidenceNodeId: string;
  onClose: () => void;
}
```

**Usage:**
```tsx
import { EvidenceDrawer } from '@/components';

const [isOpen, setIsOpen] = useState(false);

<EvidenceDrawer
  evidenceNodeId="abc-123"
  onClose={() => setIsOpen(false)}
/>
```

**Features:**
- Displays evidence metadata (entityType, entityId, actorType, timestamp)
- Shows chronological ledger entries
- No edit/delete controls
- Slide-in from right

---

### 4. QRCodeCard

**File:** `components/QRCodeCard.tsx`

**Purpose:** Display QR code with status badge and legal notice.

**Props:**
```typescript
{
  certificationId: string;
  status: StatusType;
  qrToken: string;
  className?: string;
}
```

**Usage:**
```tsx
import { QRCodeCard } from '@/components';

<QRCodeCard
  certificationId="cert-123"
  status="valid"
  qrToken="raw-token-string"
/>
```

**Rules:**
- ✅ Always show QR, even if revoked/expired
- ✅ QR scans are legal evidence
- ✅ Legal notice is non-optional
- ❌ Cannot hide QR for blocked certs

---

### 5. EvidenceTimeline

**File:** `components/EvidenceTimeline.tsx`

**Purpose:** Chronological vertical timeline of evidence nodes.

**Props:**
```typescript
{
  evidenceNodeIds: string[];
  className?: string;
}
```

**Usage:**
```tsx
import { EvidenceTimeline } from '@/components';

<EvidenceTimeline
  evidenceNodeIds={['id1', 'id2', 'id3']}
/>
```

**Features:**
- Sorts chronologically (newest first)
- Icon per evidence type
- Clickable evidence links
- Used in: Employee profiles, Audit vault, Incident timelines

**Entity Type Icons:**
- `Certification` → 📜
- `VerificationEvent` → ✅
- `JHAAcknowledgment` → 📋
- `WorkWindow` → ⏰
- `Incident` → ⚠️
- `EnforcementAction` → 🚫
- `AuditCase` → 🔍
- `FieldLog` → 📝

---

### 6. AICallout

**File:** `components/AICallout.tsx`

**Purpose:** Display AI-generated insights with advisory label.

**Props:**
```typescript
{
  insightType: string;
  confidenceScore: number; // 0-100
  advisoryText: string;
  className?: string;
}
```

**Usage:**
```tsx
import { AICallout } from '@/components';

<AICallout
  insightType="near_miss_cluster"
  confidenceScore={78}
  advisoryText="3 near-misses detected in MP 120-122 corridor over 7 days"
/>
```

**Insight Types:**
- `near_miss_cluster` → ⚠️ Near-Miss Pattern
- `fatigue_risk` → 😴 Fatigue Risk
- `audit_gap` → 📋 Audit Gap
- `qr_anomaly` → 🔍 QR Anomaly

**Rules:**
- ✅ MUST include "AI ADVISORY (NON-AUTHORITATIVE)" label
- ❌ Cannot be used as sole justification for enforcement
- ✅ Legal disclaimer required
- ✅ Confidence score displayed

---

### 7. PageContainer

**File:** `components/PageContainer.tsx`

**Purpose:** Standard page layout wrapper with consistent spacing.

**Props:**
```typescript
{
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
```

**Usage:**
```tsx
import { PageContainer } from '@/components';

<PageContainer
  title="Employee Directory"
  description="Manage field personnel certifications"
  actions={<button>Create Employee</button>}
>
  <EmployeeTable />
</PageContainer>
```

**Layout:**
- Padding: `space-10` (40px)
- Gap: `space-8` (32px)
- Vertical auto-layout

---

### 8. MobileNav

**File:** `components/MobileNav.tsx`

**Purpose:** Bottom navigation bar for mobile field users.

**Usage:**
```tsx
import { MobileNav } from '@/components';

<MobileNav />
```

**Navigation Items:**
- [ Crew ] → `/mobile/crew`
- [ QR Scan ] → `/mobile/qr-scan`
- [ Log ] → `/mobile/log`
- [ Incident ] → `/mobile/incident`

**Rules:**
- Fixed to bottom
- Touch-optimized (48px min height)
- Active state highlighted
- Mobile-only (hidden on desktop)

---

## Usage Patterns

### Employee Profile with Evidence Timeline

```tsx
import { PageContainer, StatusBadge, EvidenceTimeline } from '@/components';

export default function EmployeeProfile({ employee }) {
  return (
    <PageContainer title={employee.name}>
      <div className="space-y-6">
        {/* Certifications */}
        <section>
          <h2>Certifications</h2>
          {employee.certifications.map(cert => (
            <div key={cert.id}>
              <span>{cert.type}</span>
              <StatusBadge status={cert.status} />
            </div>
          ))}
        </section>

        {/* Evidence History */}
        <section>
          <h2>Evidence Timeline</h2>
          <EvidenceTimeline evidenceNodeIds={employee.evidenceNodeIds} />
        </section>
      </div>
    </PageContainer>
  );
}
```

### QR Code Display

```tsx
import { QRCodeCard } from '@/components';

export default function CertificationQR({ certification }) {
  return (
    <QRCodeCard
      certificationId={certification.id}
      status={certification.status}
      qrToken={certification.qrToken}
    />
  );
}
```

### AI Insights Dashboard

```tsx
import { AICallout } from '@/components';

export default function SafetyDashboard({ insights }) {
  return (
    <div className="space-y-4">
      {insights.map(insight => (
        <AICallout
          key={insight.id}
          insightType={insight.type}
          confidenceScore={insight.confidence}
          advisoryText={insight.text}
        />
      ))}
    </div>
  );
}
```

---

## Acceptance Criteria

### ✅ Component Library Complete When:

- [x] All 8 components implemented
- [x] TypeScript types for all props
- [x] Semantic colors immutable
- [x] 1:1 Figma mapping verified
- [x] Mobile components responsive
- [x] Evidence components read-only
- [x] AI components labeled "advisory"
- [x] Documentation complete

---

## Installation

### Required Dependencies

```bash
npm install qrcode.react
```

### Import in Your App

```tsx
import { 
  StatusBadge, 
  EvidenceLink, 
  QRCodeCard, 
  EvidenceTimeline,
  AICallout,
  PageContainer,
  MobileNav 
} from '@/components';
```

---

## Design System Compliance

All components follow the **FIGMA AUTO-LAYOUT TOKENS & SPACING RULES**:

- **Base unit:** 4px
- **Spacing scale:** `space-1` (4px) → `space-16` (64px)
- **No arbitrary values**
- **Semantic colors only**
- **Auto-layout required**

---

## Testing

```bash
# Start dev server
npm run dev

# Test components
http://localhost:3000/components-demo
```

---

**This component library is build-ready for a serious team.**
