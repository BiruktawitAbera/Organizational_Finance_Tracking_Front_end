import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import api from '../api';

const UpdateBudgetForm = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the initial values from location.state
  const { allocated_to, allocated_amount, budget_level } = location.state || {
    allocated_to: '',
    allocated_amount: 0,
    budget_level: 'organization'
  };

  const [formData, setFormData] = useState({
    allocated_to,
    allocated_amount,
    budget_level
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'allocated_amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await api.put(`/api/accounts/admin/budgets/${id}/update/`, formData);
      setSuccess('Budget updated successfully!');
      setTimeout(() => navigate('/AdminBudgetList'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Budget</h1>
      
      {/* Status messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allocated_to">
            Recipient Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="allocated_to"
            type="email"
            name="allocated_to"
            value={formData.allocated_to}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allocated_amount">
            Amount
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="allocated_amount"
            type="number"
            name="allocated_amount"
            min="0"
            step="0.01"
            value={formData.allocated_amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budget_level">
            Budget Level
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="budget_level"
            name="budget_level"
            value={formData.budget_level}
            onChange={handleChange}
            required
          >
            <option value="organization">Organization</option>
            <option value="department">Department</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Budget'}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => navigate('/AdminBudgetList')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBudgetForm;