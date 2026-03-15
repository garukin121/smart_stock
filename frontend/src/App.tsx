import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, TrendingUp, LogOut, User, BarChart2, ClipboardList } from 'lucide-react';
import api from './api';

import Dashboard from './pages/Dashboard.tsx';
import Inventory from './pages/Inventory.tsx';
import Predictions from './pages/Predictions.tsx';
import Analytics from './pages/Analytics.tsx';
import Transactions from './pages/Transactions.tsx';
import Login from './pages/Login.tsx';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [userProfile, setUserProfile] = useState<{ name: string, role: string } | null>(null);

  useEffect(() => {
    api.get('/auth/me').then(res => {
      setUserProfile(res.data);
    }).catch(err => console.error("Failed to fetch profile", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-white border-r min-h-screen flex flex-col p-4 justify-between">
      <div>
        <div className="flex items-center gap-3 text-indigo-600 font-bold text-xl mb-10 pl-2">
          <Package className="w-8 h-8" />
          Smart Stock
        </div>
        <nav className="flex flex-col gap-2">
          <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/') ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/inventory" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/inventory') ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Package className="w-5 h-5" />
            Inventory
          </Link>
          <Link to="/predictions" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/predictions') ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <TrendingUp className="w-5 h-5" />
            Predictions
          </Link>
          <Link to="/analytics" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/analytics') ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <BarChart2 className="w-5 h-5" />
            Analytics
          </Link>
          <Link to="/transactions" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/transactions') ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <ClipboardList className="w-5 h-5" />
            Transaksi
          </Link>
        </nav>
      </div>
      <div>
        {userProfile && (
          <div className="px-4 py-3 mb-2 flex items-center gap-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{userProfile.name}</p>
              <p className="text-xs text-slate-500 capitalize">{userProfile.role}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-colors text-slate-500 hover:bg-rose-50 hover:text-rose-600">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/inventory" element={<PrivateRoute><Layout><Inventory /></Layout></PrivateRoute>} />
        <Route path="/predictions" element={<PrivateRoute><Layout><Predictions /></Layout></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Layout><Analytics /></Layout></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><Layout><Transactions /></Layout></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
