import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

interface Budget {
  id: number;
  allocated_amount: number;
  allocated_by: string;
  allocated_to: string;
  budget_level: 'organization' | 'department';
  allocated_at: string;
  updated_at: string;
}

const AdminBudgetList = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch budgets on component mount and when location.state changes
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/accounts/admin/budgets/');
        setBudgets(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load budgets. Please try again.');
        console.error('Budget fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();

    // Check for success message from navigation
    if (location.state?.success) {
      setSuccess(location.state.success);
      // Clear the location state to avoid showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleAddNew = () => {
    navigate('/AdminBudgetCreate');
  };

  const handleEdit = (budget: Budget) => {
    navigate(`/admin/budgets/edit/${budget.id}`, {
      state: {
        allocated_to: budget.allocated_to,
        allocated_amount: budget.allocated_amount,
        budget_level: budget.budget_level
      }
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/accounts/admin/budgets/${id}/delete/`);
      setBudgets(budgets.filter(b => b.id !== id));
      setSuccess('Budget deleted successfully');
      setDeleteConfirmId(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.message || 
                         'Failed to delete budget';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Budget Management</h1>
        <button
          onClick={handleAddNew}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Add New Budget
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg shadow-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Budget Table */}
      {!loading && !error && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allocated By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgets.map((budget) => (
                  <tr key={budget.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {budget.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {budget.allocated_to}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {budget.budget_level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${budget.allocated_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {budget.allocated_by}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(budget.updated_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(budget)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        {deleteConfirmId === budget.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(budget.id)}
                              className="text-red-600 hover:text-red-900 font-semibold"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(budget.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBudgetList;