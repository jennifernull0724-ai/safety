// components/MobileNav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * MOBILE NAVIGATION COMPONENT
 * 
 * Bottom navigation bar for mobile field users.
 * 
 * Navigation:
 * [ Crew ] [ QR Scan ] [ Log ] [ Incident ]
 * 
 * Rules:
 * - Fixed to bottom
 * - 4 primary actions
 * - Active state highlighted
 * - Touch-optimized (48px min height)
 * 
 * Figma Spec: Section 4.1 - Mobile Navigation
 */

const NAV_ITEMS = [
  {
    href: '/mobile/crew',
    label: 'Crew',
    icon: '👥',
  },
  {
    href: '/mobile/qr-scan',
    label: 'QR Scan',
    icon: '📷',
  },
  {
    href: '/mobile/log',
    label: 'Log',
    icon: '📝',
  },
  {
    href: '/mobile/incident',
    label: 'Incident',
    icon: '⚠️',
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 z-50 md:hidden">
      <div className="flex items-stretch">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex-1 flex flex-col items-center justify-center
                py-3 px-2
                min-h-[48px]
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 border-t-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
