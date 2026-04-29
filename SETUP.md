# Inventory Management System - Full Stack Setup

## Overview
Complete inventory management system with React frontend and Node.js/MongoDB backend.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or pnpm

## Backend Setup

### 1. Navigate to server directory
```bash
cd server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_management
```

For MongoDB Atlas, use your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_management
```

### 4. Start the backend
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to project root
```bash
cd ..
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
The `.env` file is already created with:
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the frontend
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Testing the Application

### 1. Start MongoDB
Make sure MongoDB is running locally or your Atlas connection is active.

### 2. Start Backend
```bash
cd server
npm run dev
```

### 3. Start Frontend (in new terminal)
```bash
npm run dev
```

### 4. Login
Open `http://localhost:5173` and login with:
- Username: `owner` (full access)
- Username: `store` (store manager)
- Username: `dispatch` (dispatch manager)
- Password: `password` (for all users)

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `POST /api/users/login` - Login
- `DELETE /api/users/:id` - Delete user

### Batches
- `GET /api/batches` - Get all batches
- `POST /api/batches` - Create batch
- `PUT /api/batches/:id` - Update batch
- `DELETE /api/batches/:id` - Delete batch

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Transfers
- `GET /api/transfers` - Get all transfers
- `POST /api/transfers` - Create transfer
- `PUT /api/transfers/:id/fulfill` - Fulfill transfer
- `DELETE /api/transfers/:id` - Delete transfer

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create sale

### Audit Logs
- `GET /api/audit-logs` - Get audit logs
- `POST /api/audit-logs` - Create log

### Stock Adjustments
- `GET /api/stock-adjustments` - Get adjustments
- `POST /api/stock-adjustments` - Create adjustment

## Features

### Frontend
- Dashboard with analytics
- Product catalog management
- Inventory tracking (Store & Dispatch locations)
- Supplier management
- Transfer requests between locations
- Point of Sale (POS) system
- User management with role-based access
- Audit log viewer
- Analytics and reporting

### Backend
- RESTful API
- MongoDB database
- Automatic stock updates on sales
- Transfer fulfillment logic
- Audit logging
- Role-based data access

## Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` configuration
- Check port 5000 is available

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `.env` has correct API URL
- Check browser console for CORS errors

### Database connection issues
- Verify MongoDB connection string
- Check network access (for Atlas)
- Ensure database user has proper permissions

## Development

### Backend
```bash
cd server
npm run dev  # Uses nodemon for auto-reload
```

### Frontend
```bash
npm run dev  # Uses Vite for hot reload
```

## Production Build

### Frontend
```bash
npm run build
npm run preview
```

### Backend
```bash
cd server
npm start
```

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Axios
- Framer Motion
- Recharts

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- CORS
- dotenv
