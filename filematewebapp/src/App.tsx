import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import MainContent from './components/MainContent';
import { LanguageProvider } from './context/LanguageContext';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <LanguageProvider>
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
          <Route path="/" element={
            <Layout>
              <MainContent />
            </Layout>
          } />
        </Routes>
      </LanguageProvider>
    </Router>
  );
}

export default App;
