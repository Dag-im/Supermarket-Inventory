import {
  AlertTriangle,
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  Clock,
  Package,
  Plus,
  ShoppingCart,
  TrendingDown,
} from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { cn } from '../utils';

const MOCK_CHART_DATA = [
  { name: 'Mon', sales: 4000, profit: 2400 },
  { name: 'Tue', sales: 3000, profit: 1398 },
  { name: 'Wed', sales: 2000, profit: 9800 },
  { name: 'Thu', sales: 2780, profit: 3908 },
  { name: 'Fri', sales: 1890, profit: 4800 },
  { name: 'Sat', sales: 2390, profit: 3800 },
  { name: 'Sun', sales: 3490, profit: 4300 },
];

export const Dashboard: React.FC = () => {
  const { activeRole, products, batches, sales, auditLogs } = useApp();

  const totalStockValue = batches.reduce(
    (acc, b) => acc + b.quantity * b.costPerUnit,
    0
  );
  const todaySales = sales.length;
  const lowStockCount = products.filter((p) => {
    const storeQty = batches
      .filter((b) => b.productId === p.id && b.location === 'STORE')
      .reduce((a, b) => a + b.quantity, 0);
    const dispatchQty = batches
      .filter((b) => b.productId === p.id && b.location === 'DISPATCH')
      .reduce((a, b) => a + b.quantity, 0);
    return storeQty < p.minStockStore || dispatchQty < p.minStockDispatch;
  }).length;

  const expiringCount = batches.filter(
    (b) =>
      b.expiryDate &&
      new Date(b.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ).length;

  const stats = [
    {
      name: 'Stock Value',
      value: `${totalStockValue.toLocaleString()} ETB`,
      icon: Package,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      trend: '+12%',
      up: true,
    },
    {
      name: "Today's Sales",
      value: todaySales.toString(),
      icon: ShoppingCart,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      trend: '+5%',
      up: true,
    },
    {
      name: 'Low Stock',
      value: lowStockCount.toString(),
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      trend: '-2',
      up: false,
    },
    {
      name: 'Expiring',
      value: expiringCount.toString(),
      icon: Clock,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      trend: '+1',
      up: false,
    },
  ];

  return (
    <div className="space-y-8 max-w-400 mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-ink-main">
            Overview
          </h1>
          <p className="text-ink-muted text-sm mt-1 font-medium">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn-vibrant-secondary">
            <TrendingDown className="w-4 h-4" /> Export
          </button>
          <button className="btn-vibrant-primary">
            <Plus className="w-4 h-4" /> New Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.name}
            className="card-vibrant group"
          >
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  stat.bg,
                  'p-4 rounded-2xl group-hover:scale-110 transition-transform'
                )}
              >
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest',
                  stat.up
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                )}
              >
                {stat.trend}
                {stat.up ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-muted">
                {stat.name}
              </p>
              <p className="text-3xl font-black mt-1 tracking-tighter">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-vibrant">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black tracking-tight">
                Inventory Performance
              </h2>
              <p className="text-xs text-ink-muted font-medium">
                Revenue vs Profit distribution
              </p>
            </div>
            <div className="flex gap-2 bg-indigo-50/50 p-1 rounded-xl">
              <button className="px-4 py-1.5 text-[10px] font-black uppercase bg-white rounded-lg shadow-sm text-brand-primary">
                7D
              </button>
              <button className="px-4 py-1.5 text-[10px] font-black uppercase text-ink-muted hover:text-brand-primary transition-colors">
                30D
              </button>
            </div>
          </div>
          <div className="h-87.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#6366F110"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748B', fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748B', fontWeight: 700 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1B4B',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366F1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#EC4899"
                  strokeWidth={4}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-vibrant bg-brand-primary text-brand-accent border-none shadow-indigo-500/40">
          <h2 className="text-sm font-black uppercase tracking-widest mb-8 text-brand-primary">
            System Audit Feed
          </h2>
          <div className="space-y-6">
            {auditLogs.slice(0, 6).map((log, i) => (
              <div key={log.id} className="flex gap-4 group cursor-pointer">
                <div className="relative">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 shadow-lg shadow-pink-500/50 group-hover:scale-150 transition-transform" />
                  {i !== 5 && (
                    <div className="absolute top-5 left-0.75 w-0.5 h-full bg-white/10" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-secondary/90 leading-snug group-hover:text-brand-secondary/30 transition-colors">
                    {log.details}
                  </p>
                  <p className="text-[10px] text-white/40 mt-1 font-black uppercase tracking-widest">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10">
            Full Audit Trail
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-vibrant overflow-hidden p-0">
          <div className="p-6 border-b border-indigo-50 bg-indigo-50/30 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-primary">
              Critical Alerts
            </h2>
            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="divide-y divide-indigo-50">
            {products.slice(0, 4).map((product) => {
              const storeQty = batches
                .filter(
                  (b) => b.productId === product.id && b.location === 'STORE'
                )
                .reduce((a, b) => a + b.quantity, 0);
              const dispatchQty = batches
                .filter(
                  (b) => b.productId === product.id && b.location === 'DISPATCH'
                )
                .reduce((a, b) => a + b.quantity, 0);
              const isLow =
                storeQty < product.minStockStore ||
                dispatchQty < product.minStockDispatch;

              if (!isLow) return null;

              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-6 hover:bg-indigo-50/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-black">{product.name}</p>
                      <p className="text-[10px] text-ink-muted font-bold uppercase tracking-widest">
                        SKU: {product.sku}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-rose-600">
                      {storeQty + dispatchQty}
                    </p>
                    <p className="text-[9px] text-ink-muted font-black uppercase tracking-tighter">
                      Units Left
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              name: 'Launch POS',
              desc: 'Process Sales',
              icon: ShoppingCart,
              color: 'bg-indigo-500',
              shadow: 'shadow-indigo-500/30',
            },
            {
              name: 'Internal Transfer',
              desc: 'Move Stock',
              icon: ArrowLeftRight,
              color: 'bg-pink-500',
              shadow: 'shadow-pink-500/30',
            },
            {
              name: 'Receive Goods',
              desc: 'Add Inventory',
              icon: Package,
              color: 'bg-amber-500',
              shadow: 'shadow-amber-500/30',
            },
            {
              name: 'Adjustments',
              desc: 'Record Damages',
              icon: AlertTriangle,
              color: 'bg-emerald-500',
              shadow: 'shadow-emerald-500/30',
            },
          ].map((action) => (
            <button
              key={action.name}
              className="card-vibrant p-6 text-left group hover:scale-[1.02] active:scale-95 transition-all"
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg transition-transform group-hover:rotate-6',
                  action.color,
                  action.shadow
                )}
              >
                <action.icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-black">{action.name}</p>
              <p className="text-[10px] text-ink-muted font-bold uppercase tracking-tight mt-1">
                {action.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
