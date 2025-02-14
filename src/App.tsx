import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import SignInPage from './pages/LoginPage';
import SignUpPage from './pages/RegisterPage';

function App() {
  const role = "admin";
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<DashboardLayout role={role} />}>
      <Route index element={<DashboardPage role={role} />} />
      <Route path='login' element={<SignInPage />} />
      <Route path='register' element={<SignUpPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="income" element={<IncomePage />} />
          <Route path="expense" element={<ExpensePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage role={role} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;