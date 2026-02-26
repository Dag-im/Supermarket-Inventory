import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Product, Batch, Supplier, TransferRequest, Sale, AuditLog, StockAdjustment } from '../types';

interface AppState {
  currentUser: User | null;
  activeRole: UserRole | null; // For Owner to switch views
  users: User[];
  products: Product[];
  batches: Batch[];
  suppliers: Supplier[];
  transfers: TransferRequest[];
  sales: Sale[];
  auditLogs: AuditLog[];
  adjustments: StockAdjustment[];
  
  // Actions
  login: (username: string) => void;
  logout: () => void;
  switchView: (role: UserRole) => void;
  addSale: (sale: Omit<Sale, 'id' | 'soldAt'>) => void;
  addTransfer: (transfer: Omit<TransferRequest, 'id' | 'requestedAt' | 'status'>) => void;
  fulfillTransfer: (id: string) => void;
  addAdjustment: (adj: Omit<StockAdjustment, 'id' | 'timestamp'>) => void;
  addProduct: (product: Omit<Product, 'id' | 'status'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addBatch: (batch: Omit<Batch, 'id'>) => void;
  updateBatch: (id: string, batch: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  deleteSupplier: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Initial Mock Data
const MOCK_USERS: User[] = [
  { id: '1', username: 'owner', role: UserRole.OWNER, name: 'Abebe Owner', email: 'owner@inventory.com' },
  { id: '2', username: 'store', role: UserRole.STORE_MANAGER, name: 'Kebede Store', email: 'store@inventory.com' },
  { id: '3', username: 'dispatch', role: UserRole.DISPATCH_MANAGER, name: 'Mulu Dispatch', email: 'dispatch@inventory.com' },
];

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Global Foods Ltd', contactPerson: 'John Doe', email: 'john@global.com', phone: '+251911223344', address: 'Addis Ababa, Ethiopia' },
  { id: 's2', name: 'Tech Supplies Co', contactPerson: 'Jane Smith', email: 'jane@tech.com', phone: '+251922334455', address: 'Bole, Addis Ababa' },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1', sku: 'SKU-001', barcode: '123456789', name: 'Premium Coffee Beans', description: 'High-quality roasted beans',
    category: 'Beverages', subCategory: 'Coffee', unit: 'kg', costPrice: 450, sellingPrice: 650,
    minStockStore: 50, minStockDispatch: 20, isPerishable: true, defaultExpiryDays: 180, supplierId: 's1', status: 'active'
  },
  {
    id: 'p2', sku: 'SKU-002', barcode: '987654321', name: 'Organic Honey', description: 'Pure natural honey',
    category: 'Food', subCategory: 'Sweeteners', unit: 'jar', costPrice: 300, sellingPrice: 450,
    minStockStore: 30, minStockDispatch: 15, isPerishable: true, defaultExpiryDays: 365, supplierId: 's1', status: 'active'
  },
  {
    id: 'p3', sku: 'SKU-003', barcode: '456789123', name: 'Paper Towels', description: 'Highly absorbent towels',
    category: 'Household', subCategory: 'Cleaning', unit: 'pack', costPrice: 80, sellingPrice: 120,
    minStockStore: 100, minStockDispatch: 40, isPerishable: false, defaultExpiryDays: 0, supplierId: 's2', status: 'active'
  }
];

const MOCK_BATCHES: Batch[] = [
  { id: 'b1', productId: 'p1', batchNo: 'B001', receivedDate: '2024-01-15', expiryDate: '2024-07-15', quantity: 120, location: 'STORE', costPerUnit: 450 },
  { id: 'b2', productId: 'p1', batchNo: 'B001', receivedDate: '2024-01-15', expiryDate: '2024-07-15', quantity: 45, location: 'DISPATCH', costPerUnit: 450 },
  { id: 'b3', productId: 'p2', batchNo: 'B002', receivedDate: '2024-02-10', expiryDate: '2025-02-10', quantity: 80, location: 'STORE', costPerUnit: 300 },
  { id: 'b4', productId: 'p3', batchNo: 'B003', receivedDate: '2024-03-01', quantity: 200, location: 'STORE', costPerUnit: 80 },
];

const MOCK_SALES: Sale[] = [
  { id: 's1', productId: 'p1', batchId: 'b2', quantity: 5, revenue: 3250, profit: 1000, location: 'DISPATCH', soldBy: '3', soldAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 's2', productId: 'p2', batchId: 'b3', quantity: 2, revenue: 900, profit: 300, location: 'STORE', soldBy: '2', soldAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 's3', productId: 'p1', batchId: 'b2', quantity: 10, revenue: 6500, profit: 2000, location: 'DISPATCH', soldBy: '3', soldAt: new Date(Date.now() - 86400000).toISOString() },
];

const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'l1', userId: '1', action: 'SYSTEM_START', details: 'System initialized with mock data', timestamp: new Date(Date.now() - 172800000).toISOString() },
  { id: 'l2', userId: '1', action: 'LOGIN', details: 'Owner logged in', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'l3', userId: '2', action: 'STOCK_RECEIVE', details: 'Received 120 units of Premium Coffee Beans', timestamp: new Date(Date.now() - 43200000).toISOString() },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [users] = useState<User[]>(MOCK_USERS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [batches, setBatches] = useState<Batch[]>(MOCK_BATCHES);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);

  const login = (username: string) => {
    const user = users.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      setActiveRole(user.role);
      logAction(user.id, 'LOGIN', `User ${username} logged in`);
    }
  };

  const logout = () => {
    if (currentUser) logAction(currentUser.id, 'LOGOUT', `User ${currentUser.username} logged out`);
    setCurrentUser(null);
    setActiveRole(null);
  };

  const switchView = (role: UserRole) => {
    if (currentUser?.role === UserRole.OWNER) {
      setActiveRole(role);
    }
  };

  const logAction = (userId: string, action: string, details: string, oldValue?: any, newValue?: any) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
      oldValue,
      newValue
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addSale = (saleData: Omit<Sale, 'id' | 'soldAt'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Math.random().toString(36).substr(2, 9),
      soldAt: new Date().toISOString(),
    };
    
    setSales(prev => [newSale, ...prev]);
    
    // Update batch quantity
    setBatches(prev => prev.map(b => {
      if (b.id === saleData.batchId) {
        return { ...b, quantity: b.quantity - saleData.quantity };
      }
      return b;
    }));

    if (currentUser) logAction(currentUser.id, 'SALE', `Sold ${saleData.quantity} of product ${saleData.productId}`);
  };

  const addTransfer = (transferData: Omit<TransferRequest, 'id' | 'requestedAt' | 'status'>) => {
    const newTransfer: TransferRequest = {
      ...transferData,
      id: Math.random().toString(36).substr(2, 9),
      requestedAt: new Date().toISOString(),
      status: 'PENDING'
    };
    setTransfers(prev => [newTransfer, ...prev]);
    if (currentUser) logAction(currentUser.id, 'TRANSFER_REQUEST', `Requested ${transferData.requestedQty} of product ${transferData.productId}`);
  };

  const fulfillTransfer = (id: string) => {
    const transfer = transfers.find(t => t.id === id);
    if (!transfer) return;

    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'FULFILLED', fulfilledAt: new Date().toISOString() } : t));

    // Move stock logic (simplified: find first batch in STORE and move to DISPATCH)
    const storeBatch = batches.find(b => b.productId === transfer.productId && b.location === 'STORE' && b.quantity >= transfer.requestedQty);
    
    if (storeBatch) {
      setBatches(prev => {
        const newBatches = [...prev];
        // Deduct from store
        const storeIdx = newBatches.findIndex(b => b.id === storeBatch.id);
        newBatches[storeIdx] = { ...newBatches[storeIdx], quantity: newBatches[storeIdx].quantity - transfer.requestedQty };
        
        // Add to dispatch (find existing batch or create new)
        const dispatchBatchIdx = newBatches.findIndex(b => b.productId === transfer.productId && b.location === 'DISPATCH' && b.batchNo === storeBatch.batchNo);
        
        if (dispatchBatchIdx > -1) {
          newBatches[dispatchBatchIdx] = { ...newBatches[dispatchBatchIdx], quantity: newBatches[dispatchBatchIdx].quantity + transfer.requestedQty };
        } else {
          newBatches.push({
            ...storeBatch,
            id: Math.random().toString(36).substr(2, 9),
            location: 'DISPATCH',
            quantity: transfer.requestedQty
          });
        }
        return newBatches;
      });
    }

    if (currentUser) logAction(currentUser.id, 'TRANSFER_FULFILL', `Fulfilled transfer ${id}`);
  };

  const addAdjustment = (adjData: Omit<StockAdjustment, 'id' | 'timestamp'>) => {
    const newAdj: StockAdjustment = {
      ...adjData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setAdjustments(prev => [newAdj, ...prev]);
    
    setBatches(prev => prev.map(b => {
      if (b.id === adjData.batchId) {
        return { ...b, quantity: b.quantity + adjData.qtyChange };
      }
      return b;
    }));

    if (currentUser) logAction(currentUser.id, 'ADJUSTMENT', `Adjusted stock for batch ${adjData.batchId} by ${adjData.qtyChange}`);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'status'>) => {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'active'
    };
    setProducts(prev => [...prev, newProduct]);
    if (currentUser) logAction(currentUser.id, 'PRODUCT_ADD', `Added product ${productData.name}`);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));
    if (currentUser) logAction(currentUser.id, 'PRODUCT_UPDATE', `Updated product ${id}`);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if (currentUser) logAction(currentUser.id, 'PRODUCT_DELETE', `Deleted product ${id}`);
  };

  const addBatch = (batchData: Omit<Batch, 'id'>) => {
    const newBatch: Batch = {
      ...batchData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setBatches(prev => [...prev, newBatch]);
    if (currentUser) logAction(currentUser.id, 'BATCH_ADD', `Added batch ${batchData.batchNo} for product ${batchData.productId}`);
  };

  const updateBatch = (id: string, batchData: Partial<Batch>) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, ...batchData } : b));
    if (currentUser) logAction(currentUser.id, 'BATCH_UPDATE', `Updated batch ${id}`);
  };

  const deleteBatch = (id: string) => {
    setBatches(prev => prev.filter(b => b.id !== id));
    if (currentUser) logAction(currentUser.id, 'BATCH_DELETE', `Deleted batch ${id}`);
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setSuppliers(prev => [...prev, newSupplier]);
    if (currentUser) logAction(currentUser.id, 'SUPPLIER_ADD', `Added supplier ${supplierData.name}`);
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    if (currentUser) logAction(currentUser.id, 'SUPPLIER_DELETE', `Deleted supplier ${id}`);
  };

  return (
    <AppContext.Provider value={{
      currentUser, activeRole, users, products, batches, suppliers, transfers, sales, auditLogs, adjustments,
      login, logout, switchView, addSale, addTransfer, fulfillTransfer, addAdjustment,
      addProduct, updateProduct, deleteProduct, addBatch, updateBatch, deleteBatch, addSupplier, deleteSupplier
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
