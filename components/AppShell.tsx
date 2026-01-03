// components/AppShell.tsx
'use client';

import React from 'react';
import { TopBar } from './TopBar';
import { LeftNav } from './LeftNav';

/**
 * APPLICATION SHELL
 * 
 * Universal layout for all authenticated roles.
 * 
 * Structure:
 * ┌─────────────────────────────────────────┐
 * │ TopBar (Org | Role | Alerts | User)     │
 * ├──────────┬──────────────────────────────┤
 * │ LeftNav  │ Main Content Area            │
 * │ (Role)   │ (Evidence-Driven)            │
 * └──────────┴──────────────────────────────┘
 * 
 * Rules:
 * - Shell persists across all authenticated pages
 * - Navigation changes per user role
 * - Content area is evidence-first, immutable
 */

interface AppShellProps {
  children: React.ReactNode;
  orgName: string;
  userRole: 'ADMIN' | 'SAFETY_MANAGER' | 'DISPATCH' | 'SUPERVISOR' | 'EXECUTIVE' | 'REGULATOR';
  userName: string;
  alertCount?: number;
  evidenceStatus?: 'PASS' | 'FAIL' | 'INCOMPLETE';
}

export function AppShell({
  children,
  orgName,
  userRole,
  userName,
  alertCount,
  evidenceStatus,
}: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        orgName={orgName}
        userRole={userRole}
        userName={userName}
        alertCount={alertCount}
        evidenceStatus={evidenceStatus}
      />
      
      <div className="flex flex-1">
        <LeftNav role={userRole} />
        
        <main className="flex-1 bg-bg-primary">
          {children}
        </main>
      </div>
    </div>
  );
}
