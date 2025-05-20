import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import MainContent from '../components/MainContent';
import LoginPage from '../pages/LoginPage';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import AdminDashboard from '../pages/AdminDashboard';

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
    </Routes>
  );
};

export default AppRoutes; 