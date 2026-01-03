import Link from 'next/link';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold">
                System of Proof
              </Link>
              <div className="flex gap-4">
                <Link href="/employee-directory" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Employees
                </Link>
                <Link href="/incidents" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Incidents
                </Link>
                <Link href="/safety/jha" className="hover:bg-blue-700 px-3 py-2 rounded">
                  JHA
                </Link>
                <Link href="/operations/work-windows" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Work Windows
                </Link>
                <Link href="/compliance/audit-vault" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Audit Vault
                </Link>
                <Link href="/audit-vault" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Ledger
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
