import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  Package, 
  MapPin,
  AlertCircle,
  Calendar,
  ChevronRight,
  ChevronDown,
  Plus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, Batch, Product } from '../types';
import { cn } from '../utils';

export const Inventory: React.FC = () => {
  const { products, batches, addBatch, addTransfer, activeRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [newBatch, setNewBatch] = useState({
    productId: '',
    batchNo: '',
    receivedDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    quantity: 0,
    location: 'STORE' as 'STORE' | 'DISPATCH',
    costPerUnit: 0
  });

  const [newTransfer, setNewTransfer] = useState({
    productId: '',
    requestedQty: 0,
    fromLocation: 'STORE' as 'STORE' | 'DISPATCH',
    toLocation: 'DISPATCH' as 'STORE' | 'DISPATCH'
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStock = (productId: string, location: 'STORE' | 'DISPATCH') => {
    return batches
      .filter(b => b.productId === productId && b.location === location)
      .reduce((acc, b) => acc + b.quantity, 0);
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBatch(newBatch);
    setIsBatchModalOpen(false);
    setNewBatch({
      productId: '', batchNo: '', receivedDate: new Date().toISOString().split('T')[0],
      expiryDate: '', quantity: 0, location: 'STORE', costPerUnit: 0
    });
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransfer(newTransfer);
    setIsTransferModalOpen(false);
    setNewTransfer({
      productId: '', requestedQty: 0, fromLocation: 'STORE', toLocation: 'DISPATCH'
    });
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-ink-main">Inventory</h1>
          <p className="text-ink-muted text-sm mt-1 font-medium">Monitor stock levels across all locations in real-time.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted group-focus-within:text-brand-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search SKU or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border-2 border-indigo-50 rounded-2xl text-sm font-bold w-80 focus:ring-4 focus:ring-indigo-500/10 focus:border-brand-primary transition-all outline-none shadow-xl shadow-indigo-500/5"
            />
          </div>
          <button 
            onClick={() => setIsBatchModalOpen(true)}
            className="btn-vibrant-primary"
          >
            <Plus className="w-4 h-4" /> Receive Goods
          </button>
        </div>
      </div>

      <div className="card-vibrant overflow-hidden p-0 border-none shadow-indigo-500/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-50/30">
              <th className="data-table-header rounded-tl-3xl">Product Details</th>
              <th className="data-table-header">Store (Back)</th>
              <th className="data-table-header">Dispatch (Front)</th>
              <th className="data-table-header">Total Stock</th>
              <th className="data-table-header">Status</th>
              <th className="data-table-header text-right rounded-tr-3xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50">
            {filteredProducts.map((product) => {
              const storeQty = getStock(product.id, 'STORE');
              const dispatchQty = getStock(product.id, 'DISPATCH');
              const totalQty = storeQty + dispatchQty;
              const isExpanded = expandedProduct === product.id;
              const isLow = storeQty < product.minStockStore || dispatchQty < product.minStockDispatch;

              return (
                <React.Fragment key={product.id}>
                  <tr 
                    className={cn(
                      "group hover:bg-indigo-50/30 transition-colors cursor-pointer",
                      isExpanded && "bg-indigo-50/50"
                    )}
                    onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
                  >
                    <td className="data-table-cell">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Package className="w-6 h-6 text-brand-primary" />
                        </div>
                        <div>
                          <p className="font-black text-sm text-ink-main">{product.name}</p>
                          <p className="text-[10px] text-ink-muted font-black uppercase tracking-widest mt-0.5">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="data-table-cell">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-black",
                          storeQty < product.minStockStore ? 'text-rose-600' : 'text-brand-primary'
                        )}>
                          {storeQty}
                        </span>
                        <span className="text-[10px] text-ink-muted font-black">/ {product.minStockStore}</span>
                      </div>
                    </td>
                    <td className="data-table-cell">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-black",
                          dispatchQty < product.minStockDispatch ? 'text-rose-600' : 'text-brand-primary'
                        )}>
                          {dispatchQty}
                        </span>
                        <span className="text-[10px] text-ink-muted font-black">/ {product.minStockDispatch}</span>
                      </div>
                    </td>
                    <td className="data-table-cell">
                      <p className="text-sm font-black text-ink-main">{totalQty} {product.unit}</p>
                    </td>
                    <td className="data-table-cell">
                      {isLow ? (
                        <span className="badge-vibrant bg-rose-50 text-rose-600 border-rose-100">
                          Low Stock
                        </span>
                      ) : (
                        <span className="badge-vibrant bg-emerald-50 text-emerald-600 border-emerald-100">
                          Healthy
                        </span>
                      )}
                    </td>
                    <td className="data-table-cell text-right">
                      <div className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center transition-all shadow-sm">
                        {isExpanded ? <ChevronDown className="w-5 h-5 text-brand-primary" /> : <ChevronRight className="w-5 h-5 text-brand-primary" />}
                      </div>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="px-8 pb-8 bg-indigo-50/20">
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                              <div className="space-y-4">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary">Active Batches</h4>
                                <div className="space-y-3">
                                  {batches.filter(b => b.productId === product.id).map(batch => (
                                    <div key={batch.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-indigo-50 shadow-sm">
                                      <div className="flex items-center gap-4">
                                        <div className={cn(
                                          "w-3 h-3 rounded-full shadow-lg",
                                          batch.location === 'STORE' ? 'bg-indigo-500 shadow-indigo-500/50' : 'bg-pink-500 shadow-pink-500/50'
                                        )} />
                                        <div>
                                          <p className="text-xs font-black">Batch {batch.batchNo}</p>
                                          <p className="text-[10px] text-ink-muted font-black uppercase tracking-widest mt-0.5">
                                            {batch.location} • In: {batch.receivedDate}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm font-black text-brand-primary">{batch.quantity} {product.unit}</p>
                                        {batch.expiryDate && (
                                          <p className="text-[10px] text-rose-500 font-black uppercase tracking-tighter flex items-center gap-1 justify-end mt-0.5">
                                            <Calendar className="w-3 h-3" /> {batch.expiryDate}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-6">
                                <div className="space-y-4">
                                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary">Quick Operations</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <button 
                                      onClick={() => {
                                        setSelectedProduct(product);
                                        setNewTransfer({...newTransfer, productId: product.id});
                                        setIsTransferModalOpen(true);
                                      }}
                                      className="p-5 bg-white rounded-2xl border-2 border-indigo-50 hover:border-brand-primary transition-all text-left group shadow-sm"
                                    >
                                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-brand-primary group-hover:text-white transition-all">
                                        <ArrowUpDown className="w-5 h-5" />
                                      </div>
                                      <p className="text-xs font-black">Request Transfer</p>
                                    </button>
                                    <button className="p-5 bg-white rounded-2xl border-2 border-indigo-50 hover:border-rose-500 transition-all text-left group shadow-sm">
                                      <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-rose-500 group-hover:text-white transition-all text-rose-500">
                                        <AlertCircle className="w-5 h-5" />
                                      </div>
                                      <p className="text-xs font-black">Mark as Waste</p>
                                    </button>
                                  </div>
                                </div>
                                <div className="p-6 bg-brand-primary rounded-3xl text-white shadow-xl shadow-indigo-500/30 relative overflow-hidden group">
                                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform" />
                                  <div className="flex items-center justify-between mb-6 relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Predictive Analytics</p>
                                    <span className="px-3 py-1 bg-white/20 text-white rounded-full text-[9px] font-black uppercase">Live</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-8 relative z-10">
                                    <div>
                                      <p className="text-3xl font-black tracking-tighter">12.4</p>
                                      <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mt-1">Daily Velocity</p>
                                    </div>
                                    <div>
                                      <p className="text-3xl font-black tracking-tighter text-pink-300">85</p>
                                      <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mt-1">7D Projection</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Batch Modal */}
      <AnimatePresence>
        {isBatchModalOpen && (
          <div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border-none"
            >
              <div className="bg-brand-primary p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter">Receive Goods</h2>
                    <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em] mt-2">Add new stock batches</p>
                  </div>
                  <button onClick={() => setIsBatchModalOpen(false)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleBatchSubmit} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">Product</label>
                  <select 
                    value={newBatch.productId}
                    onChange={(e) => setNewBatch({...newBatch, productId: e.target.value})}
                    className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                    required
                  >
                    <option value="">Select product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">Batch No</label>
                    <input 
                      type="text" 
                      value={newBatch.batchNo}
                      onChange={(e) => setNewBatch({...newBatch, batchNo: e.target.value})}
                      className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">Quantity</label>
                    <input 
                      type="number" 
                      value={newBatch.quantity}
                      onChange={(e) => setNewBatch({...newBatch, quantity: Number(e.target.value)})}
                      className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">Expiry Date</label>
                    <input 
                      type="date" 
                      value={newBatch.expiryDate}
                      onChange={(e) => setNewBatch({...newBatch, expiryDate: e.target.value})}
                      className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">Location</label>
                    <select 
                      value={newBatch.location}
                      onChange={(e) => setNewBatch({...newBatch, location: e.target.value as 'STORE' | 'DISPATCH'})}
                      className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                    >
                      <option value="STORE">Store (Back)</option>
                      <option value="DISPATCH">Dispatch (Front)</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-brand-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30">
                  Receive Stock
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer Modal */}
      <AnimatePresence>
        {isTransferModalOpen && (
          <div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border-none"
            >
              <div className="bg-brand-primary p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter">Stock Transfer</h2>
                    <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em] mt-2">Move items between locations</p>
                  </div>
                  <button onClick={() => setIsTransferModalOpen(false)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleTransferSubmit} className="p-10 space-y-6">
                <div className="p-4 bg-indigo-50/50 rounded-2xl border-2 border-indigo-100 mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-ink-muted">Selected Product</p>
                  <p className="text-lg font-black text-brand-primary mt-1">{selectedProduct?.name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">Quantity to Move</label>
                  <input 
                    type="number" 
                    value={newTransfer.requestedQty}
                    onChange={(e) => setNewTransfer({...newTransfer, requestedQty: Number(e.target.value)})}
                    className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">From</label>
                    <select 
                      value={newTransfer.fromLocation}
                      onChange={(e) => setNewTransfer({...newTransfer, fromLocation: e.target.value as 'STORE' | 'DISPATCH'})}
                      className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                    >
                      <option value="STORE">Store</option>
                      <option value="DISPATCH">Dispatch</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">To</label>
                    <select 
                      value={newTransfer.toLocation}
                      onChange={(e) => setNewTransfer({...newTransfer, toLocation: e.target.value as 'STORE' | 'DISPATCH'})}
                      className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                    >
                      <option value="DISPATCH">Dispatch</option>
                      <option value="STORE">Store</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-brand-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30">
                  Submit Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
