// components/PageContainer.tsx
import React from 'react';

/**
 * PAGE CONTAINER COMPONENT
 * 
 * Standard page layout wrapper with consistent spacing.
 * 
 * Props:
 * - title: Page title
 * - description: Optional page description
 * - actions: Optional action buttons (top-right)
 * - children: Page content
 * 
 * Layout:
 * - Vertical auto-layout
 * - Padding: space-10 (40px)
 * - Gap: space-8 (32px)
 * 
 * Figma Spec: Section 1.2 - PageContainer
 */

interface PageContainerProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ 
  title, 
  description, 
  actions, 
  children, 
  className = '' 
}: PageContainerProps) {
  return (
    <div className={`p-10 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-8 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-2">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex-shrink-0">{actions}</div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );
}
