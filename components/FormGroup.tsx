// components/FormGroup.tsx
import React from 'react';

/**
 * FORM GROUP COMPONENT
 * 
 * Form field grouping with consistent vertical spacing.
 * 
 * Figma Spec:
 * - Vertical auto-layout
 * - Gap: space-2 (8px)
 * 
 * Rules:
 * - No arbitrary spacing
 * - Consistent gap between label and input
 * - Matches Tailwind spacing tokens
 */

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function FormGroup({ children, className = '' }: FormGroupProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {children}
    </div>
  );
}
