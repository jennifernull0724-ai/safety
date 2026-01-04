// components/index.ts
/**
 * COMPONENT LIBRARY EXPORTS
 * 
 * Figma-ready components matching the System of Proof design system.
 * 
 * All components are:
 * - Fully typed (TypeScript)
 * - Semantic (status colors immutable)
 * - Evidence-first (no mutations)
 * - Audit-defensible (immutable history)
 * - Tailwind-compliant (no arbitrary values)
 * 
 * See: FIGMA-READY COMPONENT SPECS for full documentation
 */

export { StatusBadge } from './StatusBadge';
export type { StatusType } from './StatusBadge';

export { PublicLayout } from './PublicLayout';
export { LoginLayout } from './LoginLayout';

export { EvidenceLink } from './EvidenceLink';
export { EvidenceDrawer } from './EvidenceDrawer';
export { EvidenceTimeline } from './EvidenceTimeline';

export { QRCodeCard } from './QRCodeCard';

export { AICallout } from './AICallout';

export { PageContainer } from './PageContainer';
export { Card } from './Card';
export { FormGroup } from './FormGroup';
export { MobileNav } from './MobileNav';

export { TopBar } from './TopBar';
export { LeftNav } from './LeftNav';
export { AppShell } from './AppShell';
