import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  ShoppingCart, 
  Users, 
  Settings, 
  History, 
  AlertTriangle, 
  BarChart3, 
  TrendingUp,
  LogOut,
  ArrowLeftRight,
  ClipboardList
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { cn } from '../utils';

export const Sidebar: React.FC = () => {
  const { currentUser, activeRole, logout, switchView } = useApp();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: [UserRole.OWNER, UserRole.STORE_MANAGER, UserRole.DISPATCH_MANAGER] },
    { name: 'Stock Control', path: '/inventory', icon: Package, roles: [UserRole.OWNER, UserRole.STORE_MANAGER, UserRole.DISPATCH_MANAGER] },
    { name: 'Product Catalog', path: '/products', icon: ClipboardList, roles: [UserRole.OWNER, UserRole.STORE_MANAGER, UserRole.DISPATCH_MANAGER] },
    { name: 'Sales Analytics', path: '/sales-dashboard', icon: BarChart3, roles: [UserRole.OWNER, UserRole.DISPATCH_MANAGER] },
    { name: 'Terminal POS', path: '/sales', icon: ShoppingCart, roles: [UserRole.OWNER, UserRole.DISPATCH_MANAGER] },
    { name: 'Logistics', path: '/transfers', icon: ArrowLeftRight, roles: [UserRole.OWNER, UserRole.STORE_MANAGER, UserRole.DISPATCH_MANAGER] },
    { name: 'Suppliers', path: '/suppliers', icon: Truck, roles: [UserRole.OWNER, UserRole.STORE_MANAGER] },
    { name: 'Intelligence', path: '/analytics', icon: TrendingUp, roles: [UserRole.OWNER, UserRole.STORE_MANAGER, UserRole.DISPATCH_MANAGER] },
    { name: 'Audit Log', path: '/audit', icon: History, roles: [UserRole.OWNER] },
    { name: 'Users', path: '/users', icon: Users, roles: [UserRole.OWNER] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: [UserRole.OWNER] },
  ];

  const filteredNavItems = navItems.filter(item => activeRole && item.roles.includes(activeRole));

  return (
    <div className="w-72 h-screen bg-white text-ink-main flex flex-col border-r border-indigo-50 shadow-2xl shadow-indigo-500/5">
      <div className="p-8">
        <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3 text-brand-primary">
          <div className="w-10 h-10 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 rotate-3">
            <Package className="w-6 h-6 text-white" />
          </div>
          STOCKFLOW
        </h1>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <p className="text-[10px] text-ink-muted font-black uppercase tracking-[0.2em]">Enterprise Cloud</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group",
              isActive 
                ? "bg-indigo-50 text-brand-primary shadow-sm" 
                : "text-ink-muted hover:text-brand-primary hover:bg-indigo-50/50"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform group-hover:scale-110",
              "text-brand-primary/60 group-hover:text-brand-primary"
            )} />
            {item.name}
          </NavLink>
        ))}
      </nav>

     

      <div className="p-6 border-t border-indigo-50">
        <div className="flex items-center gap-4 px-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-brand-primary font-black text-lg border-2 border-indigo-100 shadow-sm">
            {currentUser?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black truncate text-ink-main">{currentUser?.name}</p>
            <p className="text-[10px] text-ink-muted truncate font-bold uppercase tracking-tighter">{activeRole?.replace('_', ' ')}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-rose-500 bg-rose-50 hover:bg-rose-100 transition-all border border-rose-100"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};
