import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Products
export const productApi = {
    getAll: () => api.get('/products'),
    getById: (id: string) => api.get(`/products/${id}`),
    create: (data: any) => api.post('/products', data),
    update: (id: string, data: any) => api.put(`/products/${id}`, data),
    delete: (id: string) => api.delete(`/products/${id}`),
};

// Users
export const userApi = {
    getAll: () => api.get('/users'),
    create: (data: any) => api.post('/users', data),
    login: (username: string, password: string) =>
        api.post('/users/login', { username, password }),
    delete: (id: string) => api.delete(`/users/${id}`),
};

// Batches
export const batchApi = {
    getAll: () => api.get('/batches'),
    getById: (id: string) => api.get(`/batches/${id}`),
    create: (data: any) => api.post('/batches', data),
    update: (id: string, data: any) => api.put(`/batches/${id}`, data),
    delete: (id: string) => api.delete(`/batches/${id}`),
};

// Suppliers
export const supplierApi = {
    getAll: () => api.get('/suppliers'),
    getById: (id: string) => api.get(`/suppliers/${id}`),
    create: (data: any) => api.post('/suppliers', data),
    update: (id: string, data: any) => api.put(`/suppliers/${id}`, data),
    delete: (id: string) => api.delete(`/suppliers/${id}`),
};

// Transfers
export const transferApi = {
    getAll: () => api.get('/transfers'),
    create: (data: any) => api.post('/transfers', data),
    fulfill: (id: string) => api.put(`/transfers/${id}/fulfill`),
    delete: (id: string) => api.delete(`/transfers/${id}`),
};

// Sales
export const saleApi = {
    getAll: () => api.get('/sales'),
    create: (data: any) => api.post('/sales', data),
    getAnalytics: () => api.get('/sales/analytics'),
};

// Audit Logs
export const auditLogApi = {
    getAll: () => api.get('/audit-logs'),
    create: (data: any) => api.post('/audit-logs', data),
};

// Stock Adjustments
export const stockAdjustmentApi = {
    getAll: () => api.get('/stock-adjustments'),
    create: (data: any) => api.post('/stock-adjustments', data),
};

export default api;
