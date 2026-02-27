import {
  Edit2,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  Truck,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Suppliers: React.FC = () => {
  const { suppliers, addSupplier, deleteSupplier } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
  });

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier(newSupplier);
    setIsModalOpen(false);
    setNewSupplier({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
    });
  };

  return (
    <div className="space-y-8 max-w-400 mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-ink-main">
            Partners
          </h1>
          <p className="text-ink-muted text-sm mt-1 font-medium">
            Manage vendor relationships and supply chains.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-vibrant-primary"
        >
          <Plus className="w-4 h-4" /> Add New Supplier
        </button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted group-focus-within:text-brand-primary transition-colors" />
        <input
          type="text"
          placeholder="Search by company or contact person..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border-2 border-indigo-50 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-brand-primary transition-all outline-none shadow-xl shadow-indigo-500/5"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={supplier.id}
            className="card-vibrant p-6 group hover:border-brand-primary transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-brand-primary/10 transition-colors" />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm border border-indigo-50 text-ink-muted hover:text-brand-primary hover:border-brand-primary transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteSupplier(supplier.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm border border-indigo-50 text-ink-muted hover:text-rose-500 hover:border-rose-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-lg font-black text-ink-main tracking-tight">
                {supplier.name}
              </h3>
              <p className="text-[11px] text-brand-primary font-black uppercase tracking-[0.2em] mt-1">
                {supplier.contactPerson}
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 text-ink-muted group/info">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50/50 flex items-center justify-center group-hover/info:bg-indigo-50 transition-colors">
                    <Mail className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span className="text-xs font-bold">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-4 text-ink-muted group/info">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50/50 flex items-center justify-center group-hover/info:bg-indigo-50 transition-colors">
                    <Phone className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span className="text-xs font-bold">{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-4 text-ink-muted group/info">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50/50 flex items-center justify-center group-hover/info:bg-indigo-50 transition-colors">
                    <MapPin className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span className="text-xs font-bold truncate">
                    {supplier.address}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-indigo-50 flex items-center justify-between">
                <span className="badge-vibrant bg-emerald-50 text-emerald-600 border-emerald-100">
                  Active Partner
                </span>
                <button className="text-[10px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-2 hover:gap-3 transition-all">
                  Order History <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-white rounded-4xl shadow-2xl overflow-hidden border-none"
            >
              <div className="bg-brand-primary p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <h2 className="text-3xl font-black tracking-tighter relative z-10">
                  Register Partner
                </h2>
                <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em] mt-2 relative z-10">
                  Vendor Information Management
                </p>
              </div>
              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={newSupplier.name}
                      onChange={(e) =>
                        setNewSupplier({ ...newSupplier, name: e.target.value })
                      }
                      className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={newSupplier.contactPerson}
                      onChange={(e) =>
                        setNewSupplier({
                          ...newSupplier,
                          contactPerson: e.target.value,
                        })
                      }
                      className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, email: e.target.value })
                    }
                    className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newSupplier.phone}
                    onChange={(e) =>
                      setNewSupplier({ ...newSupplier, phone: e.target.value })
                    }
                    className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-ink-muted ml-1">
                    Business Address
                  </label>
                  <textarea
                    value={newSupplier.address}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-5 py-3 bg-indigo-50/30 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-brand-primary transition-all outline-none min-h-25 resize-none"
                    required
                  />
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
                    Register Partner
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
