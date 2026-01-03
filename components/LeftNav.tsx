// components/LeftNav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * LEFT NAVIGATION (ROLE-BASED)
 * 
 * Persistent sidebar navigation with role-specific menu items.
 * 
 * Rules:
 * - Navigation items change per user role
 * - Active route highlighted
 * - Evidence-first navigation (no mutations in nav)
 */

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

interface LeftNavProps {
  role: 'ADMIN' | 'SAFETY_MANAGER' | 'DISPATCH' | 'SUPERVISOR' | 'EXECUTIVE' | 'REGULATOR';
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  ADMIN: [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Employee Directory', href: '/admin/employees', icon: '👥' },
    { label: 'Audit Defense Vault', href: '/admin/audit-vault', icon: '🔒' },
    { label: 'Compliance Presets', href: '/admin/compliance', icon: '📋' },
  ],
  SAFETY_MANAGER: [
    { label: 'Dashboard', href: '/safety', icon: '📊' },
    { label: 'JHAs', href: '/safety/jha', icon: '📋' },
    { label: 'Near-Miss Feed', href: '/safety/near-miss', icon: '⚠️' },
    { label: 'Incidents', href: '/safety/incidents', icon: '🚨' },
  ],
  DISPATCH: [
    { label: 'Dashboard', href: '/dispatch', icon: '📊' },
    { label: 'Work Windows', href: '/dispatch/work-windows', icon: '🕐' },
    { label: 'Crew Status', href: '/dispatch/crews', icon: '👥' },
  ],
  SUPERVISOR: [
    { label: 'Crew View', href: '/supervisor', icon: '👥' },
    { label: 'Field Logs', href: '/supervisor/logs', icon: '📝' },
    { label: 'Incident Trigger', href: '/supervisor/incident', icon: '🚨' },
  ],
  EXECUTIVE: [
    { label: 'Risk Overview', href: '/executive', icon: '📊' },
    { label: 'Legal Defense', href: '/executive/legal', icon: '⚖️' },
    { label: 'Audit Readiness', href: '/executive/audit', icon: '✓' },
  ],
  REGULATOR: [
    { label: 'Session Scope', href: '/regulator/scope', icon: '🔍' },
    { label: 'Evidence View', href: '/regulator/evidence', icon: '📁' },
    { label: 'Access Log', href: '/regulator/log', icon: '📜' },
  ],
};

export function LeftNav({ role }: LeftNavProps) {
  const pathname = usePathname();
  const items = NAV_ITEMS[role] || [];

  return (
    <nav className="flex flex-col gap-2 p-4 bg-bg-secondary border-r border-border-default min-h-screen w-64">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-3 p-3 rounded-md
              ${isActive 
                ? 'bg-status-valid text-white' 
                : 'text-text-primary hover:bg-bg-primary'
              }
            `}
          >
            {item.icon && <span>{item.icon}</span>}
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
