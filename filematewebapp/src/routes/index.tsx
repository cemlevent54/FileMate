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
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/files" element={<AdminFiles />} />
    </Routes>
  );
};

export default AppRoutes; 