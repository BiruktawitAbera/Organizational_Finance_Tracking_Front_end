import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import IncomePage from "./pages/IncomePage";
import ExpensePage from "./pages/ExpensePage";
import SignInPage from "./pages/LoginPage";
import SignUpPage from "./pages/RegisterPage";
import EnforcePage from "./pages/EnforcePage";
import ForgotPassword from "./pages/Forgotpassword";
import ResetPassword from "./pages/ResetPassword";
import AdminBudgetList from "./components/AdminBudgetList";
import UpdateBudgetForm from "./components/UpdateBudgetForm";
import AdminBudgetCreate from "./components/AdminBudgetCreate";
import ManagerBudgetList from "./components/ManagerBudgetList";
import ManagerBudgetCreate from "./components/ManagerBudgetCreate";
import IncomeList from "./components/IncomeList";
import IncomeCreateForm from "./components/IncomeCreateForm";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user role from the backend
  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem("access_token");


 // Assuming you store JWT in localStorage
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const response = await axios.get("http://127.0.0.1:8000/api/accounts/user-role/", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Fixed syntax issue here
      });
      
      setRole(response.data.role);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);


  if (loading) {
    return <div>Loading...</div>; // Show a loading state while fetching user role
  }

  return (
    <BrowserRouter>
      <Routes>


        {/* Public routes */}
        <Route path="/login" element={<SignInPage onLogin={fetchUserRole} />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/enforce" element={<EnforcePage />} />
        <Route path="/Forgotpassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route path="/" element={isAuthenticated ? <DashboardLayout role={role} /> : <Navigate to="/login" />} >
          <Route index element={<DashboardPage role={role} />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="income" element={<IncomePage />} />
          <Route path="expense" element={<ExpensePage />} />
          <Route path="users" element={role === "admin" ? <UsersPage /> : <Navigate to="/" />} />
          <Route path="settings" element={<SettingsPage role={role} />} />
          {/* Route for the Budget Allocation Form */}
          <Route path="AdminBudgetCreate" element={<AdminBudgetCreate />} />
          <Route path="AdminBudgetList" element={<AdminBudgetList />} />
          {/* <Route path="/update-budget/:id" element={<UpdateBudgetForm />} /> */}
          <Route path="/admin/budgets/edit/:id" element={<UpdateBudgetForm />} />

          {/* manager budget allocation */}
          <Route path="/manager/budgets" element={<ManagerBudgetList />} />
          <Route path="/manager/budgets/create" element={<ManagerBudgetCreate />} />

          {/* income records */}
          <Route path="/incomes" element={<IncomeList />} />
          <Route path="/create-income" element={<IncomeCreateForm />} />


        </Route>
      </Routes>


      

    </BrowserRouter>
  );
}

export default App;
