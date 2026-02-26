import React from 'react';
import { useApp } from '../context/AppContext';
import { History, Search, Filter, User as UserIcon, Clock, ShieldCheck } from 'lucide-react';

import { cn } from '../utils';

export const AuditLogPage: React.FC = () => {
  const { auditLogs, users } = useApp();

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'System';

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-ink-main">Ledger</h1>
          <p className="text-ink-muted text-sm mt-1 font-medium">Immutable record of all system operations and security events.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted group-focus-within:text-brand-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search logs..."
              className="pl-12 pr-6 py-3 bg-white border-2 border-indigo-50 rounded-2xl text-sm font-bold w-80 focus:border-brand-primary transition-all outline-none shadow-sm"
            />
          </div>
          <button className="btn-vibrant-secondary">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="card-vibrant overflow-hidden p-0 border-none shadow-indigo-500/10">
        <div className="p-8 bg-indigo-50/30 flex items-center justify-between border-b border-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-indigo-50">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary">System Events</h2>
          </div>
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-indigo-50 shadow-sm">Latest 50 entries</span>
        </div>
        <div className="divide-y divide-indigo-50">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-8 flex items-center justify-between hover:bg-indigo-50/30 transition-colors group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                  <History className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-black text-base tracking-tight text-ink-main">{log.details}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-50/50 flex items-center justify-center">
                        <UserIcon className="w-3 h-3 text-brand-primary" />
                      </div>
                      <span className="text-[10px] text-ink-muted font-black uppercase tracking-widest">{getUserName(log.userId)}</span>
                    </div>
                    <div className="w-1 h-1 bg-indigo-200 rounded-full" />
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-50/50 flex items-center justify-center">
                        <Clock className="w-3 h-3 text-brand-primary" />
                      </div>
                      <span className="text-[10px] text-ink-muted font-black uppercase tracking-widest">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="badge-vibrant bg-indigo-50 text-indigo-600 border-indigo-100">
                  {log.action}
                </span>
                <p className="text-[10px] text-ink-muted/40 mt-2 font-black font-mono">ID: {log.id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>
          ))}
          {auditLogs.length === 0 && (
            <div className="p-32 text-center opacity-40">
              <div className="w-24 h-24 bg-indigo-50 rounded-[40px] flex items-center justify-center mx-auto mb-8">
                <History className="w-12 h-12 text-brand-primary" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-ink-muted">No activity recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
