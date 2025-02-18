import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import SignInPage from './pages/LoginPage';
import SignUpPage from './pages/RegisterPage';
import EnforcePage from './pages/EnforcePage';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true); 
  };
  const role = "admin";

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<SignInPage onLogin={handleLogin} />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/enforce" element={<EnforcePage />} />

        {/* Protected routes */}
        <Route path="/" element={isAuthenticated ? <DashboardLayout role={role} /> : <Navigate to="/login" />}>
          <Route index element={<DashboardPage role={role} />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="income" element={<IncomePage />} />
          <Route path="expense" element={<ExpensePage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage role={role} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
