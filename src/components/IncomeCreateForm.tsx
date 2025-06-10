import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../src/api";

const IncomeCreateForm: React.FC = () => {
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    description: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate amount
      const amountValue = parseFloat(formData.amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Amount must be a number greater than 0");
      }

      // Format amount to 2 decimal places
      const formattedAmount = amountValue.toFixed(2);

      // Validate date
      if (!formData.date) {
        throw new Error("Date is required");
      }

      // Validate description
      if (formData.description.trim().length < 5) {
        throw new Error("Description must be at least 5 characters");
      }

      // Prepare data for API
      const requestData = {
        amount: formattedAmount,
        date: formData.date,
        description: formData.description.trim()
      };

      // Make API request
      await api.post("/api/accounts/incomes/", requestData);
      
      // Redirect to income list with success state
      navigate("/incomes", { state: { success: "Income record created successfully!" } });
    } catch (err: any) {
      console.error("Income creation error:", err);
      
      // Handle API validation errors
      if (err.response?.data) {
        // Handle non-field errors
        if (err.response.data.detail) {
          setError(err.response.data.detail);
        } 
        // Handle field-specific errors
        else if (typeof err.response.data === 'object') {
          const errorMessages = Object.values(err.response.data).flat();
          setError(errorMessages.join(" "));
        } 
        // Handle string errors
        else if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else {
          setError("An unexpected error occurred");
        }
      } else {
        setError(err.message || "Failed to create income record. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold">Create Income Record</h2>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium" htmlFor="amount">
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            step="0.01"
            min="0.01"
            placeholder="Enter amount"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={4}
            maxLength={500}
            placeholder="Describe the income source"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Max 500 characters</p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/incomes')}
            className="bg-gray-300 text-gray-700 py-2 px-6 rounded hover:bg-gray-400 transition duration-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition duration-200 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Record"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncomeCreateForm;