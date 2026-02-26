import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Lock, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const { login } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username);
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-border-subtle overflow-hidden"
      >
        <div className="bg-[#1A1A1A] p-10 text-white text-center">
          <div className="w-12 h-12 bg-emerald-500 rounded flex items-center justify-center mx-auto mb-6">
            <Package className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">STOCKFLOW</h1>
          <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] mt-2 font-mono">Enterprise v2.4.0</p>
        </div>

        <div className="p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted px-1">Identity</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-border-subtle rounded text-sm focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted px-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
                <input
                  type="password"
                  value="password"
                  readOnly
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-border-subtle rounded text-sm opacity-50 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 mt-2"
            >
              Authenticate
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border-subtle">
            <p className="text-[9px] text-center text-ink-muted uppercase tracking-widest mb-4 font-bold">System Access Profiles</p>
            <div className="grid grid-cols-3 gap-2">
              {['owner', 'store', 'dispatch'].map(u => (
                <button
                  key={u}
                  onClick={() => setUsername(u)}
                  className="py-2 px-1 bg-gray-50 border border-border-subtle rounded text-[9px] font-bold uppercase hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all"
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-border-subtle text-center">
          <p className="text-[8px] text-ink-muted uppercase tracking-tighter">Secure Terminal • Authorized Access Only</p>
        </div>
      </motion.div>
    </div>
  );
};
