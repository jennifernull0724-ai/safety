'use client';

import { Users, Mail, UserPlus, Trash2 } from 'lucide-react';

/**
 * USERS & INVITES PAGE
 * 
 * Purpose:
 * - Invite users
 * - Manage access
 * - View active users
 * 
 * Rules:
 * - Administrative only
 * - This is not a collaboration product
 * - Access control is administrative, not operational
 */

export default function UsersPage() {
  const users = [
    { id: 1, name: 'John Admin', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Safety', email: 'jane@example.com', role: 'Safety Manager', status: 'Active' },
    { id: 3, name: 'Bob Supervisor', email: 'bob@example.com', role: 'Supervisor', status: 'Active' },
  ];

  const pendingInvites = [
    { email: 'new@example.com', role: 'Employee', sent: '2 days ago' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Users & Access</h1>
        <p className="text-slate-400">
          Manage user access and invitations
        </p>
      </div>

      {/* Invite User */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Invite New User</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
          />
          <select className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white">
            <option>Select Role</option>
            <option>Admin</option>
            <option>Safety Manager</option>
            <option>Supervisor</option>
            <option>Employee</option>
          </select>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            Send Invite
          </button>
        </div>
      </div>

      {/* Active Users */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Active Users</h2>
          <span className="text-sm text-slate-400">{users.length} users</span>
        </div>
        <div className="divide-y divide-slate-700">
          {users.map(user => (
            <div key={user.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-slate-400">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-slate-700 rounded text-sm">{user.role}</span>
                <span className="text-sm text-green-400">{user.status}</span>
                <button className="p-2 hover:bg-slate-700 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Pending Invites</h2>
            <span className="text-sm text-slate-400">{pendingInvites.length} pending</span>
          </div>
          <div className="divide-y divide-slate-700">
            {pendingInvites.map((invite, i) => (
              <div key={i} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="font-medium">{invite.email}</div>
                    <div className="text-sm text-slate-400">Sent {invite.sent}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-slate-700 rounded text-sm">{invite.role}</span>
                  <button className="text-sm text-blue-400 hover:text-blue-300">
                    Resend
                  </button>
                  <button className="text-sm text-red-400 hover:text-red-300">
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
