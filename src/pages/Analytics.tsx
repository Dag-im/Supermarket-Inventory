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
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle, Target } from 'lucide-react';
import { cn } from '../utils';

const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6', '#3B82F6'];

const CATEGORY_DATA = [
  { name: 'Beverages', value: 400 },
  { name: 'Food', value: 300 },
  { name: 'Household', value: 300 },
  { name: 'Personal Care', value: 200 },
];

const PERFORMANCE_DATA = [
  { name: 'Jan', revenue: 4000, target: 3500 },
  { name: 'Feb', revenue: 3000, target: 3500 },
  { name: 'Mar', revenue: 5000, target: 4000 },
  { name: 'Apr', revenue: 4500, target: 4000 },
  { name: 'May', revenue: 6000, target: 5000 },
  { name: 'Jun', revenue: 5500, target: 5000 },
];

export const Analytics: React.FC = () => {
  const { products, sales, batches } = useApp();

  const totalRevenue = sales.reduce((acc, s) => acc + s.revenue, 0);
  const totalProfit = sales.reduce((acc, s) => acc + s.profit, 0);
  const totalItemsSold = sales.reduce((acc, s) => acc + s.quantity, 0);
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-ink-main">Intelligence</h1>
          <p className="text-ink-muted text-sm mt-1 font-medium">Advanced inventory performance and growth metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-vibrant-secondary">
            <Target className="w-4 h-4" /> Set Targets
          </button>
          <button className="btn-vibrant-primary">
            <TrendingUp className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Gross Revenue', value: `${totalRevenue.toLocaleString()} ETB`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { name: 'Net Profit', value: `${totalProfit.toLocaleString()} ETB`, icon: TrendingUp, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
          { name: 'Profit Margin', value: `${profitMargin.toFixed(1)}%`, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { name: 'Volume Sold', value: totalItemsSold.toString(), icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        ].map((stat) => (
          <div key={stat.name} className="card-vibrant p-6 border-2 border-transparent hover:border-indigo-50 transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className={cn(stat.bg, "w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm", stat.border, "border")}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-muted">{stat.name}</p>
            </div>
            <p className="text-2xl font-black tracking-tighter text-ink-main">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-vibrant p-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary">Revenue vs Target</h2>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-brand-primary rounded-full shadow-lg shadow-indigo-500/50" />
                <span className="text-[10px] font-black uppercase tracking-widest text-ink-muted">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-100 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-widest text-ink-muted">Target</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#6366F110" />
                <XAxis 
                  dataKey="name" 
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
                  itemStyle={{ fontWeight: 900, fontSize: '12px' }}
                  labelStyle={{ fontWeight: 900, marginBottom: '4px', color: '#6366F1' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366F1" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#6366F1', strokeWidth: 3, stroke: '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 0 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#E0E7FF" 
                  strokeWidth={2} 
                  strokeDasharray="8 8" 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-vibrant p-8">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary mb-10">Category Distribution</h2>
          <div className="h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none', 
                    borderRadius: '24px', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '16px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  iconType="circle" 
                  wrapperStyle={{ 
                    fontSize: '10px', 
                    fontWeight: 900, 
                    textTransform: 'uppercase', 
                    letterSpacing: '2px', 
                    paddingTop: '30px' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-vibrant bg-brand-primary text-white p-10 border-none shadow-2xl shadow-indigo-500/40 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full -ml-32 -mb-32 blur-3xl group-hover:scale-125 transition-transform duration-700" />
        
        <div className="flex items-center justify-between mb-10 relative z-10">
          <div>
            <h2 className="text-3xl font-black tracking-tighter">Top Performing Assets</h2>
            <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em] mt-2">Revenue generation by product unit</p>
          </div>
          <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md border border-white/10">
            Full Inventory Report
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
          {products.slice(0, 6).map((product, i) => (
            <div key={product.id} className="p-6 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/20 transition-all group/item backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xs font-black group-hover/item:bg-white group-hover/item:text-brand-primary transition-all shadow-lg">
                  0{i + 1}
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">
                  Top 10%
                </span>
              </div>
              <p className="font-black text-lg tracking-tight">{product.name}</p>
              <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mt-1">{product.category}</p>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-end justify-between">
                <div>
                  <p className="text-xl font-black text-emerald-400">{(Math.random() * 50000 + 10000).toLocaleString()} ETB</p>
                  <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mt-1">Monthly Revenue</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-pink-300">+{(Math.random() * 15 + 5).toFixed(1)}%</p>
                  <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mt-1">Growth</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
