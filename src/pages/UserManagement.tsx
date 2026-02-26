import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  User, 
  Shield, 
  Mail, 
  MoreVertical,
  Edit2,
  Trash2,
  Lock,
  CheckCircle2,
  UserCheck,
  UserMinus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

import { cn } from '../utils';

export const UserManagement: React.FC = () => {
  const { users, addUser, deleteUser, activeRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: UserRole.DISPATCH_MANAGER,
    password: ''
  });

  if (activeRole !== UserRole.OWNER) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center p-12">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-rose-50 text-rose-600 rounded-[32px] flex items-center justify-center mb-8 shadow-xl shadow-rose-500/10"
        >
          <Shield className="w-12 h-12" />
        </motion.div>
        <h2 className="text-3xl font-black text-ink-main tracking-tighter">Access Restricted</h2>
        <p className="text-ink-muted text-sm mt-3 max-w-md font-medium">Only the system owner has permission to manage users and modify roles.</p>
        <button className="mt-8 btn-vibrant-secondary">Return to Safety</button>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(newUser);
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', role: UserRole.DISPATCH_MANAGER, password: '' });
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-ink-main">Team</h1>
          <p className="text-ink-muted text-sm mt-1 font-medium">Control system access and assign administrative roles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-vibrant-primary"
        >
          <Plus className="w-4 h-4" /> Create New User
        </button>
      </div>

      <div className="card-vibrant overflow-hidden p-0 border-none shadow-indigo-500/10">
        <div className="p-8 bg-indigo-50/30 flex items-center justify-between border-b border-indigo-50">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted group-focus-within:text-brand-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-white border-2 border-indigo-50 rounded-2xl text-sm font-bold focus:border-brand-primary transition-all outline-none shadow-sm"
            />
          </div>
          <span className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em] bg-white px-4 py-2 rounded-xl border border-indigo-50 shadow-sm">{users.length} Total Accounts</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="data-table-header">User Identity</th>
                <th className="data-table-header">Role</th>
                <th className="data-table-header">Access Status</th>
                <th className="data-table-header">Last Active</th>
                <th className="data-table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-indigo-50/30 transition-colors">
                  <td className="data-table-cell">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform shadow-sm">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-ink-main">{user.name}</p>
                        <p className="text-[11px] text-ink-muted font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="data-table-cell">
                    <span className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm",
                      user.role === UserRole.OWNER 
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                        : user.role === UserRole.STORE_MANAGER
                        ? 'bg-pink-50 text-pink-600 border-pink-100'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    )}>
                      <Shield className="w-3 h-3" />
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="data-table-cell">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                    </div>
                  </td>
                  <td className="data-table-cell">
                    <span className="text-[10px] text-ink-muted font-black uppercase tracking-widest">Today, 10:45 AM</span>
                  </td>
                  <td className="data-table-cell text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm border border-indigo-50 text-ink-muted hover:text-brand-primary hover:border-brand-primary transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {user.role !== UserRole.OWNER && (
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm border border-indigo-50 text-ink-muted hover:text-rose-500 hover:border-rose-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border-none"
            >
              <div className="bg-brand-primary p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <h2 className="text-3xl font-black tracking-tighter relative z-10">Create Account</h2>
                <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em] mt-2 relative z-10">System Access Control</p>
              </div>
              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">System Role</label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                    className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none appearance-none"
                    required
                  >
                    <option value={UserRole.DISPATCH_MANAGER}>Dispatch Manager</option>
                    <option value={UserRole.STORE_MANAGER}>Store Manager</option>
                    <option value={UserRole.OWNER}>System Owner</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">Initial Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                    <input 
                      type="password" 
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full pl-12 pr-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 bg-indigo-50 text-brand-primary rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-8 py-4 bg-brand-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
