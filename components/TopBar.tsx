// components/TopBar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { StatusBadge } from './StatusBadge';

/**
 * TOP BAR (APPLICATION SHELL)
 * 
 * Persistent header for all authenticated roles.
 * 
 * Layout:
 * Org Name | Active Role | Alerts | Evidence Status | User
 * 
 * Rules:
 * - Always visible when authenticated
 * - Shows current user context (org, role)
 * - Evidence status visible at all times
 * - No mutations, display only
 */

interface TopBarProps {
  orgName: string;
  userRole: 'ADMIN' | 'SAFETY_MANAGER' | 'DISPATCH' | 'SUPERVISOR' | 'EXECUTIVE' | 'REGULATOR';
  userName: string;
  alertCount?: number;
  evidenceStatus?: 'PASS' | 'FAIL' | 'INCOMPLETE';
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  SAFETY_MANAGER: 'Safety Manager',
  DISPATCH: 'Dispatch',
  SUPERVISOR: 'Supervisor',
  EXECUTIVE: 'Executive',
  REGULATOR: 'Regulator',
};

export function TopBar({ 
  orgName, 
  userRole, 
  userName, 
  alertCount = 0,
  evidenceStatus = 'PASS'
}: TopBarProps) {
  return (
    <header className="flex items-center justify-between gap-6 p-4 bg-bg-primary border-b border-border-default">
      {/* Left: Org Name + Role */}
      <div className="flex items-center gap-4">
        <Link href="/" className="text-text-primary font-bold">
          {orgName}
        </Link>
        <span className="text-text-secondary text-sm">
          {ROLE_LABELS[userRole]}
        </span>
      </div>

      {/* Center: Alerts + Evidence Status */}
      <div className="flex items-center gap-6">
        {alertCount > 0 && (
          <Link 
            href="/alerts" 
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary"
          >
            <span className="text-sm">🔔 {alertCount} Alerts</span>
          </Link>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Evidence:</span>
          <StatusBadge status={evidenceStatus} timestamp={new Date()} />
        </div>
      </div>

      {/* Right: User */}
      <div className="flex items-center gap-3">
        <span className="text-text-primary text-sm">{userName}</span>
        <Link 
          href="/logout" 
          className="text-text-secondary text-sm hover:text-text-primary"
        >
          Logout
        </Link>
      </div>
    </header>
  );
}
