import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Lock, User as UserIcon, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(username);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Minimalist header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-14 h-14 bg-black rounded-2xl mb-5"
          >
            <Package className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">
            Stockflow
          </h1>
          <p className="text-sm text-gray-400 mt-2 tracking-wide">
            Inventory Management System
          </p>
        </motion.div>

        {/* Clean card with minimal styling */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-300"
                  value="password"
                  readOnly
                />
              </div>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Quick access */}
          <div className="mt-8">
            <p className="text-xs text-gray-400 text-center mb-4">
              Demo access
            </p>
            <div className="flex gap-3 justify-center">
              {['owner', 'store', 'dispatch'].map((role) => (
                <motion.button
                  key={role}
                  whileHover={{ y: -2 }}
                  onClick={() => setUsername(role)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-xs font-medium text-gray-600 capitalize">
                    {role}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8 space-y-2"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
            <Shield className="w-3 h-3" />
            <span>Secure enterprise login</span>
          </div>
          <p className="text-xs text-gray-200">
            Version 2.4.0
          </p>
        </motion.div>
      </div>
    </div>
  );
};