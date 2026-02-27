import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Download,
  Upload,
  Package,
  Edit2,
  Trash2,
  Barcode,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

export const Products: React.FC = () => {
  const { products, addProduct, deleteProduct, suppliers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    barcode: '',
    name: '',
    description: '',
    category: '',
    subCategory: '',
    unit: '',
    costPrice: 0,
    sellingPrice: 0,
    minStockStore: 10,
    minStockDispatch: 5,
    isPerishable: false,
    defaultExpiryDays: 0,
    supplierId: '',
  });

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(newProduct);
    setIsModalOpen(false);
    setNewProduct({
      sku: '',
      barcode: '',
      name: '',
      description: '',
      category: '',
      subCategory: '',
      unit: '',
      costPrice: 0,
      sellingPrice: 0,
      minStockStore: 10,
      minStockDispatch: 5,
      isPerishable: false,
      defaultExpiryDays: 0,
      supplierId: '',
    });
  };

  return (
    <div className="space-y-8 max-w-400 mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-ink-main">
            Catalog
          </h1>
          <p className="text-ink-muted text-sm mt-1 font-medium">
            Manage your global product definitions and pricing.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn-vibrant-secondary">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="btn-vibrant-secondary">
            <Upload className="w-4 h-4" /> Import
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-vibrant-primary"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted group-focus-within:text-brand-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by SKU, Name or Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-6 py-4 bg-white border-2 border-indigo-50 rounded-2xl text-sm font-bold w-full focus:ring-4 focus:ring-indigo-500/10 focus:border-brand-primary transition-all outline-none shadow-xl shadow-indigo-500/5"
          />
        </div>
        <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-ink-muted">
          <Filter className="w-4 h-4 text-brand-primary" /> Filter by:
          <select className="bg-indigo-50/50 border-2 border-indigo-100 rounded-xl px-4 py-2 text-ink-main cursor-pointer font-black outline-none focus:border-brand-primary transition-all">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Groceries</option>
          </select>
        </div>
      </div>

      <div className="card-vibrant overflow-hidden p-0 border-none shadow-indigo-500/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-50/30">
              <th className="data-table-header rounded-tl-3xl">Product</th>
              <th className="data-table-header">Category</th>
              <th className="data-table-header">Cost Price</th>
              <th className="data-table-header">Selling Price</th>
              <th className="data-table-header">Margin</th>
              <th className="data-table-header text-right rounded-tr-3xl">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50">
            {filteredProducts.map((product) => {
              const margin = (
                ((product.sellingPrice - product.costPrice) /
                  product.sellingPrice) *
                100
              ).toFixed(1);

              return (
                <tr
                  key={product.id}
                  className="group hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="data-table-cell">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Package className="w-6 h-6 text-brand-primary" />
                      </div>
                      <div>
                        <p className="font-black text-sm text-ink-main">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-ink-muted font-black uppercase tracking-widest mt-0.5">
                          SKU: {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="data-table-cell">
                    <span className="badge-vibrant bg-indigo-50 text-brand-primary border-indigo-100">
                      {product.category}
                    </span>
                  </td>
                  <td className="data-table-cell">
                    <p className="text-sm font-black text-ink-main">
                      {product.costPrice.toLocaleString()} ETB
                    </p>
                  </td>
                  <td className="data-table-cell">
                    <p className="text-sm font-black text-brand-primary">
                      {product.sellingPrice.toLocaleString()} ETB
                    </p>
                  </td>
                  <td className="data-table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-2 bg-indigo-50 rounded-full overflow-hidden border border-indigo-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(Number(margin), 0)}%` }}
                          className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        />
                      </div>
                      <span className="text-[11px] font-black text-emerald-600">
                        {margin}%
                      </span>
                    </div>
                  </td>
                  <td className="data-table-cell text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm border border-indigo-50 text-ink-muted hover:text-brand-primary hover:border-brand-primary transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm border border-indigo-50 text-ink-muted hover:text-brand-primary hover:border-brand-primary transition-all"
                        title="Barcode"
                      >
                        <Barcode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm border border-indigo-50 text-ink-muted hover:text-rose-500 hover:border-rose-500 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-4xl shadow-2xl overflow-hidden border-none"
            >
              <div className="bg-brand-primary p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter">
                      New Product
                    </h2>
                    <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em] mt-2">
                      Define global product parameters
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <form
                onSubmit={handleSubmit}
                className="p-10 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={newProduct.sku}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, sku: e.target.value })
                      }
                      className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">
                      Unit (e.g. kg, pcs)
                    </label>
                    <input
                      type="text"
                      value={newProduct.unit}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, unit: e.target.value })
                      }
                      className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">
                      Cost Price (ETB)
                    </label>
                    <input
                      type="number"
                      value={newProduct.costPrice}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          costPrice: Number(e.target.value),
                        })
                      }
                      className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">
                      Selling Price (ETB)
                    </label>
                    <input
                      type="number"
                      value={newProduct.sellingPrice}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          sellingPrice: Number(e.target.value),
                        })
                      }
                      className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">
                    Supplier
                  </label>
                  <select
                    value={newProduct.supplierId}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        supplierId: e.target.value,
                      })
                    }
                    className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                    required
                  >
                    <option value="">Select a supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
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
                    Create Product
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
