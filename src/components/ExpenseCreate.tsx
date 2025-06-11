import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../src/api";

interface ExpenseForm {
  amount: string;
  description: string;
}

const ExpenseCreateForm: React.FC = () => {
  const [formData, setFormData] = useState<ExpenseForm>({
    amount: '',
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
      if (isNaN(amountValue) ) {
        throw new Error("Amount must be a valid number");
      }
      
      if (amountValue <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      // Format amount to 2 decimal places
      const formattedAmount = amountValue.toFixed(2);

      // Validate description
      if (formData.description.trim().length < 5) {
        throw new Error("Description must be at least 5 characters");
      }

      // Prepare data for API
      const requestData = {
        amount: formattedAmount,
        description: formData.description.trim()
      };

    

      // Make API request
    await api.post("/api/accounts/expenses/create/", requestData);
      
      // Redirect to expense list with success state
      navigate("/expenses", { state: { success: "Expense created successfully!" } });
    } catch (err: any) {
      console.error("Expense creation error:", err);
      
      // Handle API validation errors
      if (err.response?.data) {
        // Handle non-field errors
        if (err.response.data.error) {
          setError(err.response.data.error);
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
        setError(err.message || "Failed to create expense. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Expense</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Explain the purpose of this expense
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Creating Expense...' : 'Submit Expense'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/expenses")}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseCreateForm;