import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../src/api";

interface Expense {
  id: number;
  amount: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'DISAPPROVED';
  created_at: string;
  updated_at: string;
  department_head: number;
  manager: number | null;
}

interface User {
  id: number;
  email: string;
  is_department_head: boolean;
  is_manager: boolean;
  department: string;
}

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [budgetStatus, setBudgetStatus] = useState<{
    allocated_budget: number;
    pending_expenses: number;
    approved_expenses: number;
    available_budget: number;
  } | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user info from local storage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.success) {
      setSuccessMessage(location.state.success);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await api.get("/api/accounts/expenses/");
      setExpenses(response.data);
    } catch (err: any) {
      setError("Failed to fetch expense records. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch budget status for department heads
  const fetchBudgetStatus = async () => {
    if (user?.is_department_head) {
      try {
        const response = await api.get("/api/accounts/budget-status/");
        setBudgetStatus(response.data);
      } catch (err) {
        console.error("Failed to fetch budget status");
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchExpenses();
      fetchBudgetStatus();
    }
  }, [user]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    return parseFloat(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'DISAPPROVED': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Handle expense creation navigation
  const handleCreateExpense = () => {
    navigate("/expenses/create");
  };

  // Handle status update
const handleUpdateStatus = async (expenseId: number, newStatus: 'APPROVED' | 'DISAPPROVED') => {
  try {
    setUpdatingId(expenseId);
    // Add '/update/' to the endpoint URL
    await api.patch(`/api/accounts/expenses/${expenseId}/update/`, { status: newStatus });
    
    setExpenses(prevExpenses => 
      prevExpenses.map(expense => 
        expense.id === expenseId 
          ? { ...expense, status: newStatus } 
          : expense
      )
    );
      
      // Refresh budget status if user is department head
      if (user?.is_department_head) {
        fetchBudgetStatus();
      }
      
      setSuccessMessage(`Expense ${newStatus.toLowerCase()} successfully!`);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update expense status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Loading user information...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Loading expense records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Expense Management</h2>
          <div className="text-sm text-gray-500 mt-1">
            {user.department && `Department: ${user.department}`}
            {user.is_manager && " | Manager View"}
          </div>
        </div>
        
        <div>
          {user.is_department_head && (
            <button
              onClick={handleCreateExpense}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Expense
            </button>
          )}
        </div>
      </div>
      
      {/* Budget Overview for Department Heads */}
      {user.is_department_head && budgetStatus && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Budget Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow border border-blue-100">
              <h4 className="text-gray-500 text-sm uppercase">Total Allocated</h4>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(budgetStatus.allocated_budget.toString())}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded shadow border border-yellow-100">
              <h4 className="text-gray-500 text-sm uppercase">Pending Expenses</h4>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(budgetStatus.pending_expenses.toString())}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded shadow border border-green-100">
              <h4 className="text-gray-500 text-sm uppercase">Approved Expenses</h4>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(budgetStatus.approved_expenses.toString())}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded shadow border border-purple-100">
              <h4 className="text-gray-500 text-sm uppercase">Available Budget</h4>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(budgetStatus.available_budget.toString())}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
          {error}
        </div>
      )}
      
      {expenses.length === 0 ? (
        <div className="text-center py-8 border border-gray-200 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xl mb-2">No expense records found</p>
          <p className="text-gray-600 mb-6">Get started by creating your first expense record</p>
          {user.is_department_head ? (
            <button
              onClick={handleCreateExpense}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none text-lg"
            >
              Create Expense Record
            </button>
          ) : (
            <p className="text-gray-500">Only department heads can create expense records</p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Created At</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="p-3">{expense.id}</td>
                  <td className="p-3 font-mono font-semibold text-red-700">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="p-3 max-w-xs">{expense.description}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {formatDate(expense.created_at)}
                  </td>
                  <td className="p-3">
                    {user.is_manager && expense.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(expense.id, 'APPROVED')}
                          disabled={updatingId === expense.id}
                          className={`px-3 py-1 rounded-md text-sm flex items-center ${
                            updatingId === expense.id 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {updatingId === expense.id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing
                            </>
                          ) : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(expense.id, 'DISAPPROVED')}
                          disabled={updatingId === expense.id}
                          className={`px-3 py-1 rounded-md text-sm flex items-center ${
                            updatingId === expense.id 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          Disapprove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;