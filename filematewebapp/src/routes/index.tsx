import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import MainContent from '../components/MainContent';
import LoginPage from '../pages/LoginPage';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import AdminDashboard from '../pages/AdminDashboard';
import AdminUsers from '../pages/AdminUsers';
import AdminFiles from '../pages/AdminFiles';
import MyFiles from '../pages/MyFiles';
import Profile from '../pages/Profile';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <Layout>
          <LoginPage />
        </Layout>
      } />
      <Route path="/register" element={
        <Layout>
          <Register />
        </Layout>
      } />
      <Route path="/forgot-password" element={
        <Layout>
          <ForgotPassword />
        </Layout>
      } />
      <Route path="/" element={
        <Layout>
          <MainContent />
        </Layout>
      } />
      <Route path="/my-files" element={
        <ProtectedRoute>
          <Layout>
            <MyFiles />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <AdminProtectedRoute>
          <AdminUsers />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/files" element={
        <AdminProtectedRoute>
          <AdminFiles />
        </AdminProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes; 