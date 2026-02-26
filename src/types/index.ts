import { Type } from "@google/genai";

export enum UserRole {
  OWNER = "OWNER",
  STORE_MANAGER = "STORE_MANAGER",
  DISPATCH_MANAGER = "DISPATCH_MANAGER",
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  email: string;
  lastLogin?: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  minStockStore: number;
  minStockDispatch: number;
  isPerishable: boolean;
  defaultExpiryDays: number;
  supplierId: string;
  status: "active" | "inactive";
}

export interface Batch {
  id: string;
  productId: string;
  batchNo: string;
  receivedDate: string;
  expiryDate?: string;
  quantity: number;
  location: "STORE" | "DISPATCH";
  costPerUnit: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

export interface TransferRequest {
  id: string;
  productId: string;
  requestedQty: number;
  status: "PENDING" | "FULFILLED" | "REJECTED";
  requestedBy: string;
  requestedAt: string;
  fulfilledAt?: string;
}

export interface Sale {
  id: string;
  productId: string;
  batchId: string;
  quantity: number;
  revenue: number;
  profit: number;
  location: "STORE" | "DISPATCH";
  soldBy: string;
  soldAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  oldValue?: any;
  newValue?: any;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  batchId: string;
  qtyChange: number;
  reason: "DAMAGE" | "THEFT" | "EXPIRY" | "COUNT_ERROR";
  location: "STORE" | "DISPATCH";
  adjustedBy: string;
  timestamp: string;
}
