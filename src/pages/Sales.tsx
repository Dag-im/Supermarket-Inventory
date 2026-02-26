import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Package, 
  CreditCard,
  User as UserIcon,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Zap,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Batch, Product } from '../types';
import { cn } from '../utils';

interface CartItem {
  product: Product;
  batch: Batch;
  quantity: number;
}

export const Sales: React.FC = () => {
  const { products, batches, addSale, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<'STORE' | 'DISPATCH'>('DISPATCH');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSaleTotal, setLastSaleTotal] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: Product, batch: Batch) => {
    const existing = cart.find(item => item.batch.id === batch.id);
    if (existing) {
      if (existing.quantity < batch.quantity) {
        setCart(cart.map(item => 
          item.batch.id === batch.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }
    } else {
      setCart([...cart, { product, batch, quantity: 1 }]);
    }
  };

  const updateQty = (batchId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.batch.id === batchId) {
        const newQty = Math.max(1, Math.min(item.batch.quantity, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (batchId: string) => {
    setCart(cart.filter(item => item.batch.id !== batchId));
  };

  const totalRevenue = cart.reduce((acc, item) => acc + (item.product.sellingPrice * item.quantity), 0);

  const [recentSales, setRecentSales] = useState<any[]>([]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    const saleTotal = totalRevenue;
    setLastSaleTotal(saleTotal);
    
    const newSales = cart.map(item => ({
      productId: item.product.id,
      batchId: item.batch.id,
      quantity: item.quantity,
      revenue: item.product.sellingPrice * item.quantity,
      profit: (item.product.sellingPrice - item.product.costPrice) * item.quantity,
      location: item.batch.location,
      soldBy: currentUser?.id || 'unknown',
      timestamp: new Date().toISOString(),
      productName: item.product.name
    }));

    newSales.forEach(sale => addSale(sale));
    
    setRecentSales(prev => [
      { id: Math.random().toString(), total: saleTotal, items: cart.length, time: new Date().toLocaleTimeString() },
      ...prev
    ].slice(0, 5));

    setCart([]);
    setShowSuccess(true);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-8 max-w-[1600px] mx-auto relative">
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-brand-primary rounded-[22px] flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-ink-main">Express Terminal</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-ink-muted text-[10px] font-black uppercase tracking-widest">Active: {currentUser?.name || 'System'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 bg-white p-2 rounded-3xl border-2 border-indigo-50 shadow-xl shadow-indigo-500/5">
            <button 
              onClick={() => setSelectedLocation('DISPATCH')}
              className={cn(
                "px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                selectedLocation === 'DISPATCH' ? "bg-brand-primary text-white shadow-lg shadow-indigo-500/30" : "text-ink-muted hover:bg-indigo-50"
              )}
            >
              <MapPin className="w-3.5 h-3.5" /> Dispatch
            </button>
            <button 
              onClick={() => setSelectedLocation('STORE')}
              className={cn(
                "px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                selectedLocation === 'STORE' ? "bg-brand-primary text-white shadow-lg shadow-indigo-500/30" : "text-ink-muted hover:bg-indigo-50"
              )}
            >
              <Package className="w-3.5 h-3.5" /> Store
            </button>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <Search className="w-5 h-5 text-ink-muted group-focus-within:text-brand-primary transition-colors" />
            <span className="text-[10px] font-black text-ink-muted/40 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">/</span>
          </div>
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search products, SKUs, or scan barcodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white border-2 border-indigo-50 rounded-[2rem] text-sm font-bold focus:ring-8 focus:ring-indigo-500/5 focus:border-brand-primary transition-all outline-none shadow-2xl shadow-indigo-500/5"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProducts.map(product => {
              const productBatches = batches.filter(b => b.productId === product.id && b.location === selectedLocation && b.quantity > 0);
              
              return productBatches.map(batch => (
                <button
                  key={batch.id}
                  onClick={() => addToCart(product, batch)}
                  className="bg-white border-2 border-indigo-50 rounded-[2rem] p-6 text-left group hover:border-brand-primary hover:shadow-2xl hover:shadow-indigo-500/10 active:scale-95 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full -mr-12 -mt-12 group-hover:bg-brand-primary/10 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-ink-muted uppercase tracking-widest">Stock</p>
                      <p className="text-sm font-black text-ink-main">{batch.quantity} {product.unit}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-lg font-black leading-tight text-ink-main group-hover:text-brand-primary transition-colors">{product.name}</h3>
                    <p className="text-[10px] text-ink-muted font-black uppercase tracking-[0.2em] mt-1">Batch: {batch.batchNo}</p>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-[10px] font-black text-ink-muted uppercase tracking-widest">Price</p>
                      <p className="text-2xl font-black text-brand-primary tracking-tighter">{product.sellingPrice.toLocaleString()} <span className="text-xs">ETB</span></p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-brand-primary rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                      <Plus className="w-6 h-6" />
                    </div>
                  </div>
                </button>
              ));
            })}
          </div>
        </div>
      </div>

      <div className="w-[440px] flex flex-col h-full gap-6">
        <div className="bg-white border-2 border-indigo-50 rounded-[2.5rem] flex-[2] flex flex-col overflow-hidden shadow-2xl shadow-indigo-500/10">
          <div className="p-8 border-b border-indigo-50 bg-indigo-50/20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-brand-primary">Checkout</h2>
                <p className="text-[10px] text-ink-muted font-black uppercase tracking-widest mt-0.5">{cart.length} items in cart</p>
              </div>
            </div>
            {cart.length > 0 && (
              <button 
                onClick={() => setCart([])}
                className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-5 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center opacity-20"
                >
                  <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-6">
                    <ShoppingCart className="w-12 h-12 text-brand-primary" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.4em]">Cart is Empty</p>
                  <p className="text-[10px] font-medium mt-2">Select items to begin</p>
                </motion.div>
              ) : (
                cart.map(item => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item.batch.id} 
                    className="flex items-center justify-between p-5 bg-indigo-50/30 rounded-[2rem] border-2 border-transparent hover:border-indigo-100 transition-all group"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-black truncate text-ink-main">{item.product.name}</p>
                      <p className="text-[10px] text-ink-muted font-black uppercase tracking-widest mt-1">
                        {item.product.sellingPrice.toLocaleString()} ETB / {item.product.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-indigo-50">
                        <button 
                          onClick={() => updateQty(item.batch.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-indigo-50 transition-colors text-brand-primary"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 text-sm font-black min-w-[32px] text-center text-ink-main">{item.quantity}</span>
                        <button 
                          onClick={() => updateQty(item.batch.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-indigo-50 transition-colors text-brand-primary"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.batch.id)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl text-ink-muted hover:text-rose-500 hover:bg-rose-50 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="p-8 border-t border-indigo-50 bg-indigo-50/20 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-muted">Subtotal</span>
                <span className="text-sm font-black text-ink-main">{totalRevenue.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-muted">Tax (0%)</span>
                <span className="text-sm font-black text-ink-main">0.00 ETB</span>
              </div>
              <div className="pt-6 border-t border-indigo-100 flex justify-between items-end">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-primary">Total Amount</p>
                  <p className="text-4xl font-black tracking-tighter text-ink-main mt-1">
                    {totalRevenue.toLocaleString()} <span className="text-sm text-ink-muted">ETB</span>
                  </p>
                </div>
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-brand-primary" />
                </div>
              </div>
            </div>
            <button 
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className={cn(
                "w-full py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-3",
                cart.length === 0 
                  ? "bg-indigo-100 text-indigo-300 cursor-not-allowed" 
                  : "bg-brand-primary text-white hover:bg-indigo-700 shadow-indigo-500/40 active:scale-95"
              )}
            >
              Complete Sale <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white border-2 border-indigo-50 rounded-[2.5rem] flex-1 flex flex-col overflow-hidden shadow-xl shadow-indigo-500/5">
          <div className="p-6 border-b border-indigo-50 bg-indigo-50/10 flex items-center gap-3">
            <History className="w-4 h-4 text-brand-primary" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Recent Transactions</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
            {recentSales.length === 0 ? (
              <p className="text-[10px] text-ink-muted font-black uppercase tracking-widest text-center mt-8 opacity-40">No recent sales</p>
            ) : (
              recentSales.map(sale => (
                <div key={sale.id} className="flex items-center justify-between p-4 bg-indigo-50/30 rounded-2xl border border-indigo-50/50">
                  <div>
                    <p className="text-xs font-black text-ink-main">{sale.total.toLocaleString()} ETB</p>
                    <p className="text-[9px] text-ink-muted font-bold uppercase tracking-widest mt-0.5">{sale.items} items • {sale.time}</p>
                  </div>
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-indigo-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-indigo-950/40 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 20, opacity: 0 }}
              className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-ink-main">Sale Success!</h2>
              <p className="text-ink-muted font-bold uppercase tracking-widest text-[10px] mt-4">Transaction Completed</p>
              
              <div className="mt-10 p-8 bg-indigo-50/50 rounded-[2rem] border-2 border-indigo-100">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-muted mb-2">Total Received</p>
                <p className="text-4xl font-black text-brand-primary tracking-tighter">{lastSaleTotal.toLocaleString()} ETB</p>
              </div>

              <button 
                onClick={() => setShowSuccess(false)}
                className="mt-10 w-full py-5 bg-ink-main text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-ink-main/90 transition-all shadow-xl"
              >
                Next Customer
              </button>
              
              <button 
                onClick={() => setShowSuccess(false)}
                className="absolute top-6 right-6 text-ink-muted hover:text-ink-main transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
