import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Documentation from "./pages/Documentation";
import Dashboard from "./components/Dashboard";
import History from "./pages/History";
import Header from "./components/Header";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import Arcade from "./pages/Arcade";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css';

import LoginBg from './assets/login-bg.jpg';
import AdminBg from './assets/admin-bg.jpg';
import DashboardBg from './assets/dashboard-bg.jpg';
import Footer from "./components/Footer";

export default function App() {
  const location = useLocation();

  let currentBg = LoginBg;
  if (location.pathname.includes('/admin')) currentBg = AdminBg;
  else if (location.pathname.includes('/dashboard')) currentBg = DashboardBg;

  return (
    <div className="app-container" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${currentBg})` }}>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/arcade" element={<Arcade />} />
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
