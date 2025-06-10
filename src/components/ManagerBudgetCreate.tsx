import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface DepartmentHead {
  id: number;
  email: string;
  name: string;
  department: string;
  role: string;
}

interface BudgetData {
  total_amount: number;
  allocated_amount: number;
  remaining_amount: number;
}

const ManagerBudgetCreate = () => {
  const [formData, setFormData] = useState({
    amount: '',
    allocated_to_email: '',
    department: 'HR', // Default to HR code
    fiscal_year: new Date().getFullYear().toString(),
    notes: '',
    budget_level: 'department'
  });
  
  // Updated department choices with code and display name
  const departments = [
    { code: 'HR', name: 'Human Resources' },
    { code: 'OPS', name: 'Operations' },
    { code: 'IT', name: 'Information Technology' },
    { code: 'SALES', name: 'Sales & Revenue' },
  ];
  
  const [loading, setLoading] = useState({
    initial: true,
    submitting: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [remainingBudget, setRemainingBudget] = useState<BudgetData | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(prev => ({ ...prev, initial: true }));
        setError(null);

        const budgetResponse = await api.get('/api/accounts/api/manager/budgets/remaining/');

        setRemainingBudget({
          total_amount: parseFloat(budgetResponse.data.total_amount),
          allocated_amount: parseFloat(budgetResponse.data.allocated_amount),
          remaining_amount: parseFloat(budgetResponse.data.remaining_amount)
        });

      } catch (err: any) {
        console.error("Fetch error:", err);
        let errorMessage = 'Failed to load required data';
        
        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = 'Session expired. Please login again.';
          } else if (err.response.data?.detail) {
            errorMessage = err.response.data.detail;
          } else if (err.response.data?.error) {
            errorMessage = err.response.data.error;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.amount = 'Please enter a valid amount greater than 0';
      isValid = false;
    } else if (remainingBudget && amount > remainingBudget.remaining_amount) {
      errors.amount = `Amount exceeds remaining budget of $${remainingBudget.remaining_amount.toFixed(2)}`;
      isValid = false;
    }

    if (!formData.allocated_to_email) {
      errors.allocated_to_email = 'Please enter department head email';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.allocated_to_email)) {
      errors.allocated_to_email = 'Please enter a valid email address';
      isValid = false;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remainingBudget) return;
    
    setLoading(prev => ({ ...prev, submitting: true }));
    setError(null);
    setFieldErrors({});
    setSuccess(null);

    if (!validateForm()) {
      setLoading(prev => ({ ...prev, submitting: false }));
      return;
    }

    try {
      const payload = {
        amount: parseFloat(formData.amount),
        allocated_to_email: formData.allocated_to_email,
        department: formData.department,
        fiscal_year: formData.fiscal_year,
        notes: formData.notes,
        budget_level: 'department'
      };

      const response = await api.post('/api/accounts/api/manager/budgets/create/', payload);
      
      if (response.status === 201) {
        setSuccess('Budget allocated successfully!');
        navigate('/manager/budgets', {
          state: { 
            success: 'Budget allocated successfully!',
            newBudget: response.data
          }
        });
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      let errorMessage = 'Failed to allocate budget';
      
      if (err.response) {
        if (err.response.data) {
          if (typeof err.response.data === 'object') {
            setFieldErrors(err.response.data);
            return;
          }
          errorMessage = err.response.data.toString();
        } else if (err.response.status === 400) {
          errorMessage = 'Validation error. Please check your inputs.';
        } else if (err.response.status === 403) {
          errorMessage = 'You are not authorized to perform this action.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (loading.initial) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading required data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Allocate Department Budget</h1>
        <button
          onClick={() => navigate('/manager/budgets')}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Back to Budgets
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
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
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500">
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

      {remainingBudget ? (
        <div className="mb-6 bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-medium text-blue-600">Total Budget</p>
              <p className="text-lg font-semibold text-blue-800">{formatCurrency(remainingBudget.total_amount)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600">Allocated</p>
              <p className="text-lg font-semibold text-blue-800">{formatCurrency(remainingBudget.allocated_amount)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600">Remaining</p>
              <p className="text-lg font-semibold text-blue-800">{formatCurrency(remainingBudget.remaining_amount)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-yellow-700">Budget information not available</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="Enter amount"
            className={`w-full px-3 py-2 border ${fieldErrors.amount ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            disabled={loading.submitting}
          />
          {fieldErrors.amount && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.amount}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="allocated_to_email" className="block text-sm font-medium text-gray-700 mb-1">
            Department Head Email
          </label>
          <input
            type="email"
            id="allocated_to_email"
            name="allocated_to_email"
            value={formData.allocated_to_email}
            onChange={handleChange}
            required
            placeholder="Enter department head's email"
            className={`w-full px-3 py-2 border ${fieldErrors.allocated_to_email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            disabled={loading.submitting}
          />
          {fieldErrors.allocated_to_email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.allocated_to_email}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border ${fieldErrors.department ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            disabled={loading.submitting}
          >
            {departments.map((dept) => (
              <option key={dept.code} value={dept.code}>
                {dept.name}
              </option>
            ))}
          </select>
          {fieldErrors.department && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.department}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="fiscal_year" className="block text-sm font-medium text-gray-700 mb-1">
            Fiscal Year
          </label>
          <input
            type="number"
            id="fiscal_year"
            name="fiscal_year"
            value={formData.fiscal_year}
            onChange={handleChange}
            min="2000"
            max="2100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading.submitting}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any additional notes about this allocation"
            disabled={loading.submitting}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/manager/budgets')}
            disabled={loading.submitting}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading.submitting || !remainingBudget}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading.submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Allocating...
              </span>
            ) : 'Allocate Budget'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManagerBudgetCreate;