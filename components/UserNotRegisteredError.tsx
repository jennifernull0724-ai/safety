import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * USER NOT REGISTERED ERROR PAGE (PRESENTATION-ONLY)
 * 
 * HARD RULES:
 * - NO authentication logic
 * - NO authorization checks
 * - NO API calls
 * - NO redirects
 * - NO Base44
 * 
 * This component ONLY renders a message.
 * It represents a HARD ACCESS STOP.
 * It is NOT an error page, NOT a retry loop, NOT a login screen.
 */

export default function UserNotRegisteredError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen
                    bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg
                      border border-slate-100">
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16
                       mb-6 rounded-full bg-orange-100"
            aria-hidden="true"
          >
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Access Restricted
          </h1>

          <p className="text-slate-600 mb-8">
            You are not registered to use this application.
            Please contact the application administrator to request access.
          </p>

          <div className="p-4 bg-slate-50 rounded-md text-sm text-slate-600">
            <p className="font-medium mb-2">
              If you believe this is an error:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Verify you are logged in with the correct account</li>
              <li>Contact the application administrator</li>
              <li>Log out and sign in again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
