// components/AICallout.tsx
import React from 'react';

/**
 * AI CALLOUT COMPONENT
 * 
 * Displays AI-generated insights with advisory label.
 * 
 * Props:
 * - insightType: Type of AI insight (e.g., "near_miss_cluster", "fatigue_risk")
 * - confidenceScore: 0-100 confidence percentage
 * - advisoryText: Human-readable insight text
 * 
 * Rules:
 * - MUST include "AI Advisory" label (non-negotiable)
 * - Cannot be used as sole justification for enforcement
 * - Advisory only, never authoritative
 * - Explainable and reviewable
 * 
 * Figma Spec: Section 1.2 - AICallout
 */

interface AICalloutProps {
  insightType: string;
  confidenceScore: number;
  advisoryText: string;
  className?: string;
}

const INSIGHT_TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  near_miss_cluster: {
    icon: '⚠️',
    label: 'Near-Miss Pattern',
    color: 'bg-amber-50 border-amber-300',
  },
  fatigue_risk: {
    icon: '😴',
    label: 'Fatigue Risk',
    color: 'bg-orange-50 border-orange-300',
  },
  audit_gap: {
    icon: '📋',
    label: 'Audit Gap',
    color: 'bg-blue-50 border-blue-300',
  },
  qr_anomaly: {
    icon: '🔍',
    label: 'QR Anomaly',
    color: 'bg-red-50 border-red-300',
  },
  default: {
    icon: '🤖',
    label: 'AI Insight',
    color: 'bg-gray-50 border-gray-300',
  },
};

export function AICallout({ 
  insightType, 
  confidenceScore, 
  advisoryText, 
  className = '' 
}: AICalloutProps) {
  const config = INSIGHT_TYPE_CONFIG[insightType] || INSIGHT_TYPE_CONFIG.default;
  const confidenceLevel = 
    confidenceScore >= 80 ? 'High' :
    confidenceScore >= 50 ? 'Medium' : 'Low';

  return (
    <div className={`
      border-l-4 rounded-r
      p-4
      ${config.color}
      ${className}
    `}>
      {/* Header with AI Advisory Label (REQUIRED) */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <div className="font-semibold text-gray-900">{config.label}</div>
            <div className="text-xs text-gray-600 font-medium">
              🤖 AI ADVISORY (NON-AUTHORITATIVE)
            </div>
          </div>
        </div>
        
        {/* Confidence Score */}
        <div className="text-right">
          <div className="text-xs text-gray-500">Confidence</div>
          <div className="font-semibold text-gray-900">
            {confidenceScore}% ({confidenceLevel})
          </div>
        </div>
      </div>

      {/* Advisory Text */}
      <p className="text-sm text-gray-800 mt-3">
        {advisoryText}
      </p>

      {/* Legal Disclaimer (REQUIRED) */}
      <div className="mt-3 pt-3 border-t border-gray-300">
        <p className="text-xs text-gray-600">
          ⚠️ <strong>Advisory Only:</strong> This AI-generated insight cannot be used as sole 
          justification for enforcement actions. Human review and evidence-based verification required.
        </p>
      </div>
    </div>
  );
}
