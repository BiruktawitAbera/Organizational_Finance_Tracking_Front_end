import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../../src/api"; // Adjust the import path as needed

const UpdateBudgetForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the budget ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    department: "",
    allocated_amount: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the budget data by ID on component mount
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await api.get(`/api/accounts/budget/${id}/detail/`); // Include id in the URL
        setFormData({
          department: response.data.department,
          allocated_amount: response.data.allocated_amount,
        });
        setError("");
      } catch (err) {
        console.error("Failed to fetch budget:", err);
        setError("Failed to fetch budget. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBudget();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/accounts/budget/${id}/update/`, formData); // Include id in the URL
      alert("Budget updated successfully!");
      navigate("/budgets"); // Redirect to BudgetList page
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update budget.");
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-600">Loading budget details...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Update Budget</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Allocated Amount:</label>
          <input
            type="number"
            name="allocated_amount"
            value={formData.allocated_amount}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Update Budget
        </button>
      </form>
    </div>
  );
};

export default UpdateBudgetForm;