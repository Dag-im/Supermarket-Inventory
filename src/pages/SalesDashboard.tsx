import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';

import { cn } from '../utils';

const MOCK_HOURLY_SALES = [
  { time: '08:00', sales: 1200 },
  { time: '10:00', sales: 2400 },
  { time: '12:00', sales: 4800 },
  { time: '14:00', sales: 3600 },
  { time: '16:00', sales: 5200 },
  { time: '18:00', sales: 4100 },
  { time: '20:00', sales: 2800 },
];

const TOP_PRODUCTS = [
  { name: 'Coffee Beans', qty: 45, revenue: 29250 },
  { name: 'Organic Honey', qty: 32, revenue: 14400 },
  { name: 'Paper Towels', qty: 28, revenue: 3360 },
  { name: 'Milk Carton', qty: 25, revenue: 1250 },
  { name: 'Bread Loaf', qty: 20, revenue: 800 },
];

export const SalesDashboard: React.FC = () => {
  const { sales, products } = useApp();

  const totalRevenue = sales.reduce((acc, s) => acc + s.revenue, 0);
  const totalProfit = sales.reduce((acc, s) => acc + s.profit, 0);
  const totalTransactions = sales.length;
  const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const stats = [
    { name: 'Gross Revenue', value: `${totalRevenue.toLocaleString()} ETB`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+15.2%', up: true },
    { name: 'Net Profit', value: `${totalProfit.toLocaleString()} ETB`, icon: TrendingUp, color: 'text-pink-600', bg: 'bg-pink-50', trend: '+10.5%', up: true },
    { name: 'Transactions', value: totalTransactions.toString(), icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+8.1%', up: true },
    { name: 'Avg. Ticket', value: `${avgOrderValue.toFixed(0)} ETB`, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '-2.4%', up: false },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-ink-main">Sales</h1>
          <p className="text-ink-muted text-sm mt-1 font-medium">Real-time transaction monitoring and revenue analytics.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-indigo-50/50 border-2 border-indigo-100 rounded-2xl p-1 shadow-sm">
            <button className="px-6 py-2 text-[10px] font-black uppercase bg-white text-brand-primary rounded-xl shadow-sm transition-all">Today</button>
            <button className="px-6 py-2 text-[10px] font-black uppercase text-ink-muted hover:text-brand-primary transition-all">7D</button>
            <button className="px-6 py-2 text-[10px] font-black uppercase text-ink-muted hover:text-brand-primary transition-all">30D</button>
          </div>
          <button className="btn-vibrant-primary">
            <TrendingUp className="w-4 h-4" /> Export Report
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
            className="card-vibrant p-6 group hover:border-indigo-100 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className={cn(stat.bg, "p-4 rounded-2xl border border-indigo-50 group-hover:scale-110 transition-transform shadow-sm")}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black",
                stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              )}>
                {stat.trend}
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-muted">{stat.name}</p>
              <p className="text-2xl font-black mt-1 tracking-tighter text-ink-main">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-vibrant p-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary">Hourly Velocity</h2>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
              <span className="text-[10px] font-black uppercase tracking-widest text-ink-muted">Revenue (ETB)</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_HOURLY_SALES}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#10b98110" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748B', fontWeight: 900 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748B', fontWeight: 900 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none', 
                    borderRadius: '24px', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '16px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-vibrant p-8">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary mb-8">Top SKUs</h2>
          <div className="space-y-4">
            {TOP_PRODUCTS.map((product, i) => (
              <div key={product.name} className="flex items-center justify-between p-4 bg-indigo-50/30 rounded-2xl border-2 border-transparent hover:border-indigo-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white border-2 border-indigo-50 rounded-xl flex items-center justify-center text-xs font-black text-brand-primary group-hover:scale-110 transition-transform shadow-sm">
                    0{i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-black text-ink-main">{product.name}</p>
                    <p className="text-[10px] text-ink-muted font-black uppercase tracking-widest mt-0.5">{product.qty} units</p>
                  </div>
                </div>
                <p className="text-sm font-black text-emerald-600">{product.revenue.toLocaleString()} ETB</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-white border-2 border-indigo-50 hover:border-brand-primary hover:text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm">
            Full Inventory Report
          </button>
        </div>
      </div>

      <div className="card-vibrant overflow-hidden p-0 border-none shadow-indigo-500/10">
        <div className="p-8 bg-indigo-50/30 flex items-center justify-between border-b border-indigo-50">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary">Recent Transactions</h2>
            <p className="text-[10px] text-ink-muted font-black uppercase tracking-widest mt-1">Live ledger of processed sales</p>
          </div>
          <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30 animate-pulse">Live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="data-table-header">ID</th>
                <th className="data-table-header">Product</th>
                <th className="data-table-header">Location</th>
                <th className="data-table-header">Amount</th>
                <th className="data-table-header">Time</th>
                <th className="data-table-header text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-ink-muted uppercase tracking-[0.3em] font-black text-xs">No transactions recorded</td>
                </tr>
              ) : (
                sales.slice(0, 10).map((sale) => (
                  <tr key={sale.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="data-table-cell">
                      <p className="text-[10px] font-black font-mono text-ink-muted">#TXN-{sale.id.slice(0, 8).toUpperCase()}</p>
                    </td>
                    <td className="data-table-cell">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                          <Package className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-black text-ink-main">{products.find(p => p.id === sale.productId)?.name}</p>
                      </div>
                    </td>
                    <td className="data-table-cell">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-ink-muted">{sale.location}</span>
                      </div>
                    </td>
                    <td className="data-table-cell">
                      <p className="text-sm font-black text-emerald-600">{sale.revenue.toLocaleString()} ETB</p>
                    </td>
                    <td className="data-table-cell">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-ink-muted">
                          {new Date(sale.soldAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="data-table-cell text-right">
                      <span className="badge-vibrant bg-emerald-50 text-emerald-600 border-emerald-100">Verified</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
