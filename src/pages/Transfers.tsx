import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeftRight,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  ArrowRight,
  Search,
  AlertCircle,
  Truck,
  Box,
  History,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, TransferRequest } from '../types';

import { cn } from '../utils';

export const Transfers: React.FC = () => {
  const {
    products,
    transfers,
    addTransfer,
    fulfillTransfer,
    activeRole,
    currentUser,
  } = useApp();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [requestedQty, setRequestedQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'FULFILLED'>(
    'PENDING'
  );

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || requestedQty <= 0) return;

    addTransfer({
      productId: selectedProductId,
      requestedQty,
      requestedBy: currentUser?.id || 'unknown',
    });

    setIsRequestModalOpen(false);
    setSelectedProductId('');
    setRequestedQty(1);
  };

  const getProductName = (id: string) =>
    products.find((p) => p.id === id)?.name || 'Unknown Product';
  const getProductSku = (id: string) =>
    products.find((p) => p.id === id)?.sku || '---';

  const filteredTransfers = transfers.filter((t) => t.status === activeTab);

  return (
    <div className="space-y-8 max-w-400 mx-auto">
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-4xl flex items-center justify-center text-brand-primary shadow-xl shadow-indigo-500/10">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-ink-main">
              Logistics
            </h1>
            <p className="text-ink-muted text-sm mt-1 font-medium">
              Internal stock movements and replenishment pipeline.
            </p>
          </div>
        </div>
        {(activeRole === UserRole.OWNER ||
          activeRole === UserRole.DISPATCH_MANAGER) && (
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="btn-vibrant-primary px-8 py-4 rounded-2xl flex items-center gap-3"
          >
            <Plus className="w-5 h-5" /> Request Transfer
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="flex gap-4 bg-white p-2 rounded-3xl border-2 border-indigo-50 w-fit shadow-xl shadow-indigo-500/5">
            <button
              onClick={() => setActiveTab('PENDING')}
              className={cn(
                'px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2',
                activeTab === 'PENDING'
                  ? 'bg-brand-primary text-white shadow-lg shadow-indigo-500/30'
                  : 'text-ink-muted hover:bg-indigo-50'
              )}
            >
              <Clock className="w-4 h-4" /> Pending Requests
            </button>
            <button
              onClick={() => setActiveTab('FULFILLED')}
              className={cn(
                'px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2',
                activeTab === 'FULFILLED'
                  ? 'bg-brand-primary text-white shadow-lg shadow-indigo-500/30'
                  : 'text-ink-muted hover:bg-indigo-50'
              )}
            >
              <History className="w-4 h-4" /> Transfer History
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTransfers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[3rem] p-32 text-center border-2 border-dashed border-indigo-100"
                >
                  <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                    <Box className="w-12 h-12 text-brand-primary opacity-20" />
                  </div>
                  <h3 className="text-xl font-black text-ink-main tracking-tight">
                    No {activeTab.toLowerCase()} transfers
                  </h3>
                  <p className="text-ink-muted text-sm mt-2 font-medium">
                    All stock movements are currently up to date.
                  </p>
                </motion.div>
              ) : (
                filteredTransfers.map((transfer, i) => (
                  <motion.div
                    key={transfer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white border-2 border-indigo-50 rounded-[2.5rem] p-8 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-8 flex-1">
                        <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                          <Package className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                              TRF-{transfer.id.slice(0, 8)}
                            </span>
                            <span className="text-[10px] font-black text-ink-muted uppercase tracking-widest">
                              {new Date(
                                transfer.requestedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-xl font-black text-ink-main mt-2 tracking-tight">
                            {getProductName(transfer.productId)}
                          </h3>
                          <p className="text-[11px] text-ink-muted font-black uppercase tracking-widest mt-1">
                            SKU: {getProductSku(transfer.productId)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-12 px-12 border-x border-indigo-50">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-ink-muted uppercase tracking-widest mb-2">
                            Route
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="px-4 py-2 bg-indigo-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-ink-main">
                              Store
                            </div>
                            <ArrowRight className="w-4 h-4 text-brand-primary" />
                            <div className="px-4 py-2 bg-brand-primary rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/20">
                              Dispatch
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-ink-muted uppercase tracking-widest mb-2">
                            Quantity
                          </p>
                          <p className="text-2xl font-black text-brand-primary tracking-tighter">
                            {transfer.requestedQty}{' '}
                            <span className="text-xs">Units</span>
                          </p>
                        </div>
                      </div>

                      <div className="pl-12 flex items-center gap-6">
                        {transfer.status === 'PENDING' ? (
                          <div className="flex items-center gap-3">
                            {(activeRole === UserRole.OWNER ||
                              activeRole === UserRole.STORE_MANAGER) && (
                              <button
                                onClick={() => fulfillTransfer(transfer.id)}
                                className="bg-emerald-500 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2"
                              >
                                <CheckCircle2 className="w-4 h-4" /> Fulfill
                              </button>
                            )}
                            <button className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-ink-muted hover:bg-white hover:text-brand-primary hover:shadow-lg transition-all border border-transparent hover:border-indigo-100">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" /> Completed
                            </div>
                            <button className="text-brand-primary text-[11px] font-black uppercase tracking-widest hover:underline">
                              View Receipt
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border-2 border-indigo-50 rounded-[3rem] p-10 shadow-xl shadow-indigo-500/5">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-ink-main mb-8 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-brand-primary" /> Logistics
              Policy
            </h3>
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-ink-main">
                    Verification
                  </p>
                  <p className="text-[11px] text-ink-muted mt-2 leading-relaxed font-medium">
                    All transfers must be verified by the receiving manager upon
                    arrival.
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                  <ArrowLeftRight className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-ink-main">
                    Auto-Adjustment
                  </p>
                  <p className="text-[11px] text-ink-muted mt-2 leading-relaxed font-medium">
                    Stock levels are adjusted automatically once fulfilled.
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-ink-main">
                    SLA Warning
                  </p>
                  <p className="text-[11px] text-ink-muted mt-2 leading-relaxed font-medium">
                    Pending requests older than 24h will be flagged for review.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand-primary rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <h3 className="text-xl font-black tracking-tight">Need Help?</h3>
              <p className="text-white/60 text-[11px] font-black uppercase tracking-widest mt-2">
                Logistics Support
              </p>
              <button className="mt-8 w-full py-4 bg-white text-brand-primary rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl">
                Contact Warehouse
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isRequestModalOpen && (
          <div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden border-none"
            >
              <div className="bg-brand-primary p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <h2 className="text-4xl font-black tracking-tighter relative z-10">
                  New Request
                </h2>
                <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em] mt-2 relative z-10">
                  Replenishment Order
                </p>
              </div>
              <form onSubmit={handleRequest} className="p-12 space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">
                    Select Product
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-6 py-5 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none appearance-none"
                    required
                  >
                    <option value="">Choose a product...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">
                    Requested Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={requestedQty}
                    onChange={(e) => setRequestedQty(parseInt(e.target.value))}
                    className="w-full px-6 py-5 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="flex-1 px-8 py-5 bg-indigo-50 text-brand-primary rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-5 bg-brand-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30"
                  >
                    Send Request
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
