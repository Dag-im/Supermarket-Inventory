import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  CreditCard,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Zap,
  X,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Batch {
  id: string;
  productId: string;
  batchNo: string;
  quantity: number;
  location: 'STORE' | 'DISPATCH';
}

interface Product {
  id: string;
  name: string;
  sku: string;
  sellingPrice: number;
  costPrice: number;
  unit: string;
}

interface CartItem {
  product: Product;
  batch: Batch;
  quantity: number;
}

interface Sale {
  id: string;
  total: number;
  items: number;
  time: string;
}

// Mock data for demonstration
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Coffee Beans', sku: 'COF-001', sellingPrice: 450, costPrice: 280, unit: 'kg' },
  { id: '2', name: 'Organic Green Tea', sku: 'TEA-002', sellingPrice: 320, costPrice: 180, unit: 'box' },
  { id: '3', name: 'Honey Jar', sku: 'HON-003', sellingPrice: 280, costPrice: 150, unit: 'jar' },
  { id: '4', name: 'Almond Milk', sku: 'MLK-004', sellingPrice: 180, costPrice: 95, unit: 'liter' },
  { id: '5', name: 'Granola Pack', sku: 'GRN-005', sellingPrice: 220, costPrice: 130, unit: 'pack' },
  { id: '6', name: 'Dark Chocolate', sku: 'CHC-006', sellingPrice: 150, costPrice: 85, unit: 'bar' },
  { id: '7', name: 'Organic Quinoa', sku: 'QUN-007', sellingPrice: 380, costPrice: 220, unit: 'kg' },
  { id: '8', name: 'Coconut Oil', sku: 'OIL-008', sellingPrice: 290, costPrice: 170, unit: 'bottle' },
];

const MOCK_BATCHES: Batch[] = [
  { id: 'b1', productId: '1', batchNo: 'B2024-001', quantity: 15, location: 'DISPATCH' },
  { id: 'b2', productId: '1', batchNo: 'B2024-002', quantity: 8, location: 'STORE' },
  { id: 'b3', productId: '2', batchNo: 'B2024-003', quantity: 22, location: 'DISPATCH' },
  { id: 'b4', productId: '2', batchNo: 'B2024-004', quantity: 12, location: 'STORE' },
  { id: 'b5', productId: '3', batchNo: 'B2024-005', quantity: 18, location: 'DISPATCH' },
  { id: 'b6', productId: '3', batchNo: 'B2024-006', quantity: 6, location: 'STORE' },
  { id: 'b7', productId: '4', batchNo: 'B2024-007', quantity: 30, location: 'DISPATCH' },
  { id: 'b8', productId: '4', batchNo: 'B2024-008', quantity: 14, location: 'STORE' },
  { id: 'b9', productId: '5', batchNo: 'B2024-009', quantity: 25, location: 'DISPATCH' },
  { id: 'b10', productId: '5', batchNo: 'B2024-010', quantity: 10, location: 'STORE' },
  { id: 'b11', productId: '6', batchNo: 'B2024-011', quantity: 40, location: 'DISPATCH' },
  { id: 'b12', productId: '6', batchNo: 'B2024-012', quantity: 20, location: 'STORE' },
  { id: 'b13', productId: '7', batchNo: 'B2024-013', quantity: 12, location: 'DISPATCH' },
  { id: 'b14', productId: '7', batchNo: 'B2024-014', quantity: 5, location: 'STORE' },
  { id: 'b15', productId: '8', batchNo: 'B2024-015', quantity: 18, location: 'DISPATCH' },
  { id: 'b16', productId: '8', batchNo: 'B2024-016', quantity: 9, location: 'STORE' },
];

// Utility function
const cn = (...classes: (string | undefined | false | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const Sales: React.FC = () => {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [batches] = useState<Batch[]>(MOCK_BATCHES);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<'STORE' | 'DISPATCH'>('DISPATCH');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSaleTotal, setLastSaleTotal] = useState(0);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [showCart, setShowCart] = useState(false);

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
    // Show cart when item is added
    setShowCart(true);
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
    // Hide cart if empty
    if (cart.length === 1) {
      setShowCart(false);
    }
  };

  const totalRevenue = cart.reduce((acc, item) => acc + (item.product.sellingPrice * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const saleTotal = totalRevenue;
    setLastSaleTotal(saleTotal);

    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      total: saleTotal,
      items: totalItems,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setRecentSales(prev => [newSale, ...prev].slice(0, 5));
    setCart([]);
    setShowCart(false);
    setShowSuccess(true);

    // Auto-hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Express Sales</h1>
                <p className="text-xs text-gray-500">Point of Sale Terminal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Location Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedLocation('DISPATCH')}
                  className={cn(
                    "px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2",
                    selectedLocation === 'DISPATCH' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600"
                  )}
                >
                  <MapPin className="w-3.5 h-3.5" /> Dispatch
                </button>
                <button
                  onClick={() => setSelectedLocation('STORE')}
                  className={cn(
                    "px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2",
                    selectedLocation === 'STORE' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600"
                  )}
                >
                  <Package className="w-3.5 h-3.5" /> Store
                </button>
              </div>

              {/* Cart Button */}
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Product Grid - Left Side */}
          <div className={cn(
            "transition-all duration-300",
            showCart ? "w-[60%]" : "w-full"
          )}>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products... (Press '/' to focus)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => {
                const productBatches = batches.filter(b => b.productId === product.id && b.location === selectedLocation && b.quantity > 0);

                return productBatches.map(batch => (
                  <button
                    key={batch.id}
                    onClick={() => addToCart(product, batch)}
                    className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-indigo-600 hover:shadow-lg transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                        <Package className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Stock</p>
                        <p className="text-sm font-semibold text-gray-900">{batch.quantity} {product.unit}</p>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">Batch: {batch.batchNo}</p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-lg font-bold text-indigo-600">{product.sellingPrice.toLocaleString()} <span className="text-xs">ETB</span></p>
                      </div>
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                        <Plus className="w-4 h-4 text-indigo-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </button>
                ));
              })}
            </div>
          </div>

          {/* Cart Panel - Right Side */}
          <AnimatePresence>
            {showCart && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-[40%]"
              >
                <div className="bg-white rounded-xl border border-gray-200 sticky top-24">
                  {/* Cart Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-900">Shopping Cart</h2>
                          <p className="text-xs text-gray-500">{totalItems} items</p>
                        </div>
                      </div>
                      {cart.length > 0 && (
                        <button
                          onClick={() => {
                            setCart([]);
                            setShowCart(false);
                          }}
                          className="text-xs text-red-500 hover:text-red-600 transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <ShoppingCart className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">Your cart is empty</p>
                        <p className="text-xs text-gray-400 mt-1">Add items to get started</p>
                      </div>
                    ) : (
                      cart.map(item => (
                        <motion.div
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={item.batch.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.product.sellingPrice.toLocaleString()} ETB</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-white rounded-lg border border-gray-200">
                              <button
                                onClick={() => updateQty(item.batch.id, -1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-l-lg transition-colors"
                              >
                                <Minus className="w-3 h-3 text-gray-600" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQty(item.batch.id, 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-r-lg transition-colors"
                              >
                                <Plus className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.batch.id)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors group"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cart.length > 0 && (
                    <div className="p-4 border-t border-gray-200">
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium text-gray-900">{totalRevenue.toLocaleString()} ETB</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-medium text-gray-900">0.00 ETB</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 flex justify-between">
                          <span className="font-medium text-gray-900">Total</span>
                          <span className="text-xl font-bold text-indigo-600">{totalRevenue.toLocaleString()} <span className="text-sm">ETB</span></span>
                        </div>
                      </div>

                      <button
                        onClick={handleCheckout}
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                      >
                        Complete Sale
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent Transactions */}
        {recentSales.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-medium text-gray-700">Recent Transactions</h2>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {recentSales.map(sale => (
                <div key={sale.id} className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-sm font-bold text-gray-900">{sale.total.toLocaleString()} ETB</p>
                  <p className="text-xs text-gray-500 mt-1">{sale.items} items</p>
                  <p className="text-[10px] text-gray-400 mt-1">{sale.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-white rounded-lg shadow-lg border border-green-200 p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Sale Completed!</p>
                <p className="text-sm text-gray-500">{lastSaleTotal.toLocaleString()} ETB</p>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sales;