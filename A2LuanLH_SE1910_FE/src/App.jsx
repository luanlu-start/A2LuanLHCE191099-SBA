import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AccountManagementPage from './pages/admin/AccountManagementPage';
import CategoryManagementPage from './pages/staff/CategoryManagementPage';
import NewsManagementPage from './pages/staff/NewsManagementPage';
import HistoryNewsPage from './pages/staff/HistoryNewsPage';
import ProfilePage from './pages/staff/ProfilePage';

// Protected Route for Admin
function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

// Protected Route for Staff
function StaffRoute({ children }) {
  const { user, isStaff } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isStaff) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Guest News */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Admin Routes */}
              <Route
                path="/admin/accounts"
                element={
                  <AdminRoute>
                    <AccountManagementPage />
                  </AdminRoute>
                }
              />

              {/* Staff Routes */}
              <Route
                path="/staff/categories"
                element={
                  <StaffRoute>
                    <CategoryManagementPage />
                  </StaffRoute>
                }
              />
              <Route
                path="/staff/news"
                element={
                  <StaffRoute>
                    <NewsManagementPage />
                  </StaffRoute>
                }
              />
              <Route
                path="/staff/history"
                element={
                  <StaffRoute>
                    <HistoryNewsPage />
                  </StaffRoute>
                }
              />
              <Route
                path="/staff/profile"
                element={
                  <StaffRoute>
                    <ProfilePage />
                  </StaffRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: '1.25rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Assignment 02 SBA301 - FUNewsManagementSystem • Student: <strong>LuanLH</strong> • Class: <strong>SE1910</strong>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

