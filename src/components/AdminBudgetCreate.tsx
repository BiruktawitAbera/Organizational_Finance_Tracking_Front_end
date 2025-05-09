import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminBudgetCreate = () => {
  const [formData, setFormData] = useState({
    allocated_amount: '',
    allocated_to_email: '',
    budget_level: 'organization'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field-specific errors when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    setSuccess(null);

    try {
      // Basic validation
      const amount = parseFloat(formData.allocated_amount);
      if (isNaN(amount) || amount <= 0) {
        throw { message: 'Please enter a valid amount greater than 0' };
      }

      if (!formData.allocated_to_email.trim()) {
        throw { message: 'Recipient email is required' };
      }

      if (!validateEmail(formData.allocated_to_email)) {
        throw { message: 'Please enter a valid email address' };
      }

      if (!formData.budget_level) {
        throw { message: 'Budget level is required' };
      }

      // Prepare payload
      const payload = {
        allocated_amount: amount,
        allocated_to_email: formData.allocated_to_email.trim(),
        budget_level: formData.budget_level
      };

      // Make API call
      const response = await api.post('/api/accounts/admin/budgets/create/', payload);
      
      setSuccess('Budget created successfully!');
      setTimeout(() => {
        navigate('/AdminBudgetList', { 
          state: { success: 'Budget created successfully!' } 
        });
      }, 1500);

    } catch (err) {
      console.error('Budget creation error:', err);
      
      // Handle backend validation errors
      if (err.response?.data) {
        // Field-specific errors
        if (typeof err.response.data === 'object') {
          const backendErrors = {};
          
          if (err.response.data.allocated_to_email) {
            backendErrors.allocated_to_email = Array.isArray(err.response.data.allocated_to_email) 
              ? err.response.data.allocated_to_email.join(' ') 
              : err.response.data.allocated_to_email;
          }
          
          if (err.response.data.budget_level) {
            backendErrors.budget_level = Array.isArray(err.response.data.budget_level)
              ? err.response.data.budget_level.join(' ')
              : err.response.data.budget_level;
          }
          
          if (err.response.data.allocated_amount) {
            backendErrors.allocated_amount = Array.isArray(err.response.data.allocated_amount)
              ? err.response.data.allocated_amount.join(' ')
              : err.response.data.allocated_amount;
          }
          
          if (err.response.data.non_field_errors) {
            setError(Array.isArray(err.response.data.non_field_errors)
              ? err.response.data.non_field_errors.join(' ')
              : err.response.data.non_field_errors);
          }
          
          setFieldErrors(backendErrors);
        } else {
          setError(err.response.data);
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to create budget');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Budget</h1>
        <button
          onClick={() => navigate('/admin/budgets')}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Back to Budgets
        </button>
      </div>

      {/* Error Message */}
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

      {/* Success Message */}
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

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="allocated_amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            id="allocated_amount"
            name="allocated_amount"
            value={formData.allocated_amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="Enter amount"
            className={`w-full px-3 py-2 border ${fieldErrors.allocated_amount ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          />
          {fieldErrors.allocated_amount && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.allocated_amount}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="allocated_to_email" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Email
          </label>
          <input
            type="email"
            id="allocated_to_email"
            name="allocated_to_email"
            value={formData.allocated_to_email}
            onChange={handleChange}
            required
            placeholder="Enter recipient email"
            className={`w-full px-3 py-2 border ${fieldErrors.allocated_to_email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          />
          {fieldErrors.allocated_to_email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.allocated_to_email}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="budget_level" className="block text-sm font-medium text-gray-700 mb-1">
            Budget Level
          </label>
          <select
            id="budget_level"
            name="budget_level"
            value={formData.budget_level}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border ${fieldErrors.budget_level ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="organization">Organization</option>
            <option value="department">Department</option>
          </select>
          {fieldErrors.budget_level && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.budget_level}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/budgets')}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : 'Create Budget'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBudgetCreate;