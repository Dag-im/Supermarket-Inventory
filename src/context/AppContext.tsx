import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Product, Batch, Supplier, TransferRequest, Sale, AuditLog, StockAdjustment } from '../types';
import {
  productApi,
  userApi,
  batchApi,
  supplierApi,
  transferApi,
  saleApi,
  auditLogApi,
  stockAdjustmentApi
} from '../services/api';

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
  login: (username: string, password?: string) => Promise<void>;
  logout: () => void;
  switchView: (role: UserRole) => void;
  addSale: (sale: Omit<Sale, 'id' | 'soldAt'>) => Promise<void>;
  addTransfer: (transfer: Omit<TransferRequest, 'id' | 'requestedAt' | 'status'>) => Promise<void>;
  fulfillTransfer: (id: string) => Promise<void>;
  addAdjustment: (adj: Omit<StockAdjustment, 'id' | 'timestamp'>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'status'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addBatch: (batch: Omit<Batch, 'id'>) => Promise<void>;
  updateBatch: (id: string, batch: Partial<Batch>) => Promise<void>;
  deleteBatch: (id: string) => Promise<void>;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  addUser: (user: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  fetchData: () => Promise<void>;
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
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        productsRes,
        usersRes,
        batchesRes,
        suppliersRes,
        transfersRes,
        salesRes,
        auditLogsRes,
        adjustmentsRes
      ] = await Promise.all([
        productApi.getAll(),
        userApi.getAll(),
        batchApi.getAll(),
        supplierApi.getAll(),
        transferApi.getAll(),
        saleApi.getAll(),
        auditLogApi.getAll(),
        stockAdjustmentApi.getAll()
      ]);

      setProducts(productsRes.data.map((p: any) => ({ ...p, id: p._id })));
      setUsers(usersRes.data.map((u: any) => ({ ...u, id: u._id })));
      setBatches(batchesRes.data.map((b: any) => ({ ...b, id: b._id, productId: b.productId._id || b.productId })));
      setSuppliers(suppliersRes.data.map((s: any) => ({ ...s, id: s._id })));
      setTransfers(transfersRes.data.map((t: any) => ({ ...t, id: t._id, productId: t.productId._id || t.productId, requestedBy: t.requestedBy._id || t.requestedBy })));
      setSales(salesRes.data.map((s: any) => ({ ...s, id: s._id, productId: s.productId._id || s.productId, batchId: s.batchId._id || s.batchId, soldBy: s.soldBy._id || s.soldBy })));
      setAuditLogs(auditLogsRes.data.map((l: any) => ({ ...l, id: l._id, userId: l.userId._id || l.userId })));
      setAdjustments(adjustmentsRes.data.map((a: any) => ({ ...a, id: a._id, productId: a.productId._id || a.productId, batchId: a.batchId._id || a.batchId, adjustedBy: a.adjustedBy._id || a.adjustedBy })));
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data if API fails
      setUsers(MOCK_USERS);
      setProducts(MOCK_PRODUCTS);
      setBatches(MOCK_BATCHES);
      setSuppliers(MOCK_SUPPLIERS);
      setSales(MOCK_SALES);
      setAuditLogs(MOCK_AUDIT_LOGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const login = async (username: string, password: string = 'password') => {
    try {
      const response = await userApi.login(username, password);
      const user = { ...response.data, id: response.data._id };
      setCurrentUser(user);
      setActiveRole(user.role);
      await logAction(user.id, 'LOGIN', `User ${username} logged in`);
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to mock login
      const user = MOCK_USERS.find(u => u.username === username);
      if (user) {
        setCurrentUser(user);
        setActiveRole(user.role);
      }
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

  const logAction = async (userId: string, action: string, details: string, oldValue?: any, newValue?: any) => {
    try {
      const response = await auditLogApi.create({ userId, action, details, oldValue, newValue });
      const newLog = { ...response.data, id: response.data._id, userId };
      setAuditLogs(prev => [newLog, ...prev]);
    } catch (error) {
      console.error('Error logging action:', error);
    }
  };

  const addSale = async (saleData: Omit<Sale, 'id' | 'soldAt'>) => {
    try {
      const response = await saleApi.create(saleData);
      const newSale = { ...response.data, id: response.data._id, productId: response.data.productId._id || response.data.productId, batchId: response.data.batchId._id || response.data.batchId, soldBy: response.data.soldBy._id || response.data.soldBy };
      setSales(prev => [newSale, ...prev]);
      await fetchData(); // Refresh data to get updated batches
      if (currentUser) await logAction(currentUser.id, 'SALE', `Sold ${saleData.quantity} of product ${saleData.productId}`);
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  };

  const addTransfer = async (transferData: Omit<TransferRequest, 'id' | 'requestedAt' | 'status'>) => {
    try {
      const response = await transferApi.create(transferData);
      const newTransfer = { ...response.data, id: response.data._id, productId: response.data.productId._id || response.data.productId, requestedBy: response.data.requestedBy._id || response.data.requestedBy };
      setTransfers(prev => [newTransfer, ...prev]);
      if (currentUser) await logAction(currentUser.id, 'TRANSFER_REQUEST', `Requested ${transferData.requestedQty} of product ${transferData.productId}`);
    } catch (error) {
      console.error('Error adding transfer:', error);
    }
  };

  const fulfillTransfer = async (id: string) => {
    try {
      await transferApi.fulfill(id);
      setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'FULFILLED', fulfilledAt: new Date().toISOString() } : t));
      await fetchData(); // Refresh data to get updated batches
      if (currentUser) await logAction(currentUser.id, 'TRANSFER_FULFILL', `Fulfilled transfer ${id}`);
    } catch (error) {
      console.error('Error fulfilling transfer:', error);
    }
  };

  const addAdjustment = async (adjData: Omit<StockAdjustment, 'id' | 'timestamp'>) => {
    try {
      const response = await stockAdjustmentApi.create(adjData);
      const newAdj = { ...response.data, id: response.data._id, productId: response.data.productId._id || response.data.productId, batchId: response.data.batchId._id || response.data.batchId, adjustedBy: response.data.adjustedBy._id || response.data.adjustedBy };
      setAdjustments(prev => [newAdj, ...prev]);
      await fetchData(); // Refresh data to get updated batches
      if (currentUser) await logAction(currentUser.id, 'ADJUSTMENT', `Adjusted stock for batch ${adjData.batchId} by ${adjData.qtyChange}`);
    } catch (error) {
      console.error('Error adding adjustment:', error);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'status'>) => {
    try {
      const response = await productApi.create(productData);
      const newProduct = { ...response.data, id: response.data._id };
      setProducts(prev => [...prev, newProduct]);
      if (currentUser) await logAction(currentUser.id, 'PRODUCT_ADD', `Added product ${productData.name}`);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      await productApi.update(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));
      if (currentUser) await logAction(currentUser.id, 'PRODUCT_UPDATE', `Updated product ${id}`);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productApi.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      if (currentUser) await logAction(currentUser.id, 'PRODUCT_DELETE', `Deleted product ${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const addBatch = async (batchData: Omit<Batch, 'id'>) => {
    try {
      const response = await batchApi.create(batchData);
      const newBatch = { ...response.data, id: response.data._id, productId: response.data.productId._id || response.data.productId };
      setBatches(prev => [...prev, newBatch]);
      if (currentUser) await logAction(currentUser.id, 'BATCH_ADD', `Added batch ${batchData.batchNo} for product ${batchData.productId}`);
    } catch (error) {
      console.error('Error adding batch:', error);
    }
  };

  const updateBatch = async (id: string, batchData: Partial<Batch>) => {
    try {
      await batchApi.update(id, batchData);
      setBatches(prev => prev.map(b => b.id === id ? { ...b, ...batchData } : b));
      if (currentUser) await logAction(currentUser.id, 'BATCH_UPDATE', `Updated batch ${id}`);
    } catch (error) {
      console.error('Error updating batch:', error);
    }
  };

  const deleteBatch = async (id: string) => {
    try {
      await batchApi.delete(id);
      setBatches(prev => prev.filter(b => b.id !== id));
      if (currentUser) await logAction(currentUser.id, 'BATCH_DELETE', `Deleted batch ${id}`);
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  const addSupplier = async (supplierData: Omit<Supplier, 'id'>) => {
    try {
      const response = await supplierApi.create(supplierData);
      const newSupplier = { ...response.data, id: response.data._id };
      setSuppliers(prev => [...prev, newSupplier]);
      if (currentUser) await logAction(currentUser.id, 'SUPPLIER_ADD', `Added supplier ${supplierData.name}`);
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await supplierApi.delete(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      if (currentUser) await logAction(currentUser.id, 'SUPPLIER_DELETE', `Deleted supplier ${id}`);
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const addUser = async (userData: any) => {
    try {
      const response = await userApi.create(userData);
      const newUser = { ...response.data, id: response.data._id };
      setUsers(prev => [...prev, newUser]);
      if (currentUser) await logAction(currentUser.id, 'USER_ADD', `Added user ${userData.name}`);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await userApi.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      if (currentUser) await logAction(currentUser.id, 'USER_DELETE', `Deleted user ${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading inventory system...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      currentUser, activeRole, users, products, batches, suppliers, transfers, sales, auditLogs, adjustments,
      login, logout, switchView, addSale, addTransfer, fulfillTransfer, addAdjustment,
      addProduct, updateProduct, deleteProduct, addBatch, updateBatch, deleteBatch, addSupplier, deleteSupplier,
      addUser, deleteUser, fetchData
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
