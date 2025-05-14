import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

interface Budget {
  id: number;
  allocated_by: string;
  allocated_to: string; // This is the email
  allocated_to_name: string;
  amount: string;
  budget_level: string;
  department: string;
  fiscal_year: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface RemainingBudget {
  total_amount: number;
  allocated_amount: number;
  remaining_amount: number;
}

const ManagerBudgetList = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [remainingBudget, setRemainingBudget] = useState<RemainingBudget | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [updatedAmount, setUpdatedAmount] = useState('');
  const [updatedNotes, setUpdatedNotes] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const budgetsResponse = await api.get('/api/accounts/manager/budgets/');
        setBudgets(budgetsResponse.data);
        
        try {
          const remainingResponse = await api.get('/api/accounts/api/manager/budgets/remaining/');
          setRemainingBudget({
            total_amount: remainingResponse.data.total_amount,
            allocated_amount: remainingResponse.data.allocated_amount,
            remaining_amount: remainingResponse.data.remaining_amount
          });
        } catch (e) {
          console.log("User is not a manager or endpoint not accessible", e);
        }
        
        setError(null);
        
        if (location.state?.success) {
          setSuccess(location.state.success);
          window.history.replaceState({}, document.title);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('The requested resource was not found. Please check the API endpoint.');
          console.error('404 Error - Endpoint might be incorrect:', err.config.url);
        } else {
          const errorMessage = err.response?.data?.detail || 
                            err.response?.data?.message || 
                            'Failed to load budgets. Please try again.';
          setError(errorMessage);
        }
        console.error('Budget fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

  const handleAddNew = () => {
    navigate('/manager/budgets/create');
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/accounts/api/manager/budgets/${id}/delete/`);
      setBudgets(budgets.filter(b => b.id !== id));
      setSuccess('Budget allocation deleted successfully');
      setDeleteConfirmId(null);
      
      try {
        const remainingResponse = await api.get('/api/accounts/api/manager/budgets/remaining/');
        setRemainingBudget({
          total_amount: remainingResponse.data.total_amount,
          allocated_amount: remainingResponse.data.allocated_amount,
          remaining_amount: remainingResponse.data.remaining_amount
        });
      } catch (e) {
        console.log("Failed to refresh remaining budget", e);
      }
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.message || 
                         'Failed to delete budget allocation';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    }
  };

  const openEditModal = (budget: Budget) => {
    setCurrentBudget(budget);
    setUpdatedAmount(budget.amount);
    setUpdatedNotes(budget.notes || '');
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!currentBudget) return;

    try {
      // Calculate the difference between old and new amount
      const oldAmount = parseFloat(currentBudget.amount);
      const newAmount = parseFloat(updatedAmount);
      const amountDifference = newAmount - oldAmount;

      // Check if the update would exceed remaining budget
      if (remainingBudget && amountDifference > remainingBudget.remaining_amount) {
        throw new Error(`Update would exceed remaining budget by ${formatCurrency(amountDifference - remainingBudget.remaining_amount)}`);
      }

      // Prepare payload matching backend expectations
      const payload = {
        amount: updatedAmount,
        notes: updatedNotes,
        department: currentBudget.department,
        allocated_to_email: currentBudget.allocated_to, // Using email as required by backend
        fiscal_year: currentBudget.fiscal_year
      };

      console.log("Sending update payload:", payload);

      const response = await api.put(
        `/api/accounts/manager/budgets/${currentBudget.id}/update/`,
        payload
      );

      // Update local state with full response
      setBudgets(budgets.map(b => 
        b.id === currentBudget.id ? { 
          ...b, 
          ...response.data,
          allocated_to_name: b.allocated_to_name // Preserve the name
        } : b
      ));
      
      setSuccess('Budget allocation updated successfully');
      setIsEditModalOpen(false);
      
      // Refresh remaining budget
      try {
        const remainingResponse = await api.get('/api/accounts/manager/budgets/remaining/');
        setRemainingBudget({
          total_amount: remainingResponse.data.total_amount,
          allocated_amount: remainingResponse.data.allocated_amount,
          remaining_amount: remainingResponse.data.remaining_amount
        });
      } catch (e) {
        console.log("Failed to refresh remaining budget", e);
      }
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Update error:", err.response?.data || err);
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.message || 
                         err.message ||
                         'Failed to update budget allocation';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    }
  };

  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Edit Budget Modal */}
      {isEditModalOpen && currentBudget && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Budget Allocation</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Head</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                  value={currentBudget.allocated_to_name || currentBudget.allocated_to}
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                  value={currentBudget.department}
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={updatedAmount}
                  onChange={(e) => setUpdatedAmount(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={updatedNotes}
                  onChange={(e) => setUpdatedNotes(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of your component remains the same */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          {remainingBudget ? 'Department Budget Allocation' : 'Department Budgets'}
        </h1>
        <div className="flex space-x-4">
          {remainingBudget && (
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-800">
                <span className="font-medium">Total Budget: </span>
                {formatCurrency(remainingBudget.total_amount)}
              </div>
              <div className="text-sm text-blue-800">
                <span className="font-medium">Allocated: </span>
                {formatCurrency(remainingBudget.allocated_amount)}
              </div>
              <div className="text-sm font-semibold text-blue-900">
                <span className="font-bold">Remaining: </span>
                {formatCurrency(remainingBudget.remaining_amount)}
              </div>
            </div>
          )}
          <button
            onClick={handleAddNew}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            disabled={remainingBudget?.remaining_amount !== undefined && remainingBudget.remaining_amount <= 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Allocate Budget
          </button>
        </div>
      </div>

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
        <div className="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg shadow-lg z-50">
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

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {budgets.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No budget allocations</h3>
              <p className="mt-1 text-sm text-gray-500">
                {remainingBudget ? 
                  "Get started by allocating a department budget." : 
                  "No budgets have been allocated to you."}
              </p>
              {remainingBudget && (
                <div className="mt-6">
                  <button
                    onClick={handleAddNew}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Allocate Budget
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department Head
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fiscal Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {budgets.map((budget) => (
                    <tr key={budget.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {budget.allocated_to_name || budget.allocated_to}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {budget.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(budget.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {budget.fiscal_year}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {budget.notes || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(budget.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(budget)}
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
          )}
        </div>
      )}
    </div>
  );
};

export default ManagerBudgetList;