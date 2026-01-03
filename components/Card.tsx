// components/Card.tsx
import React from 'react';

/**
 * CARD COMPONENT
 * 
 * Standard card container with consistent spacing.
 * 
 * Figma Spec:
 * - Padding: space-5 (20px)
 * - Gap: space-4 (16px)
 * - Background: bg-secondary
 * - Border: border-default
 * - Radius: rounded-lg (12px)
 * 
 * Rules:
 * - Vertical auto-layout
 * - No arbitrary spacing values
 * - Matches Tailwind spacing tokens exactly
 */

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <section className={`
      flex flex-col gap-4 p-5
      bg-bg-secondary
      border border-border-default
      rounded-lg
      ${className}
    `}>
      {children}
    </section>
  );
}
