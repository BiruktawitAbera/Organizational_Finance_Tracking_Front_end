import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../../src/api"; // Adjust the import path as needed

interface Budget {
  id: number;
  department: string;
  allocated_amount: string;
  allocated_to: string;
  allocated_at: string;
}

const BudgetList: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch budgets on component mount
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await api.get("/api/accounts/budgets/"); // Use api.get directly
        setBudgets(response.data);
        setError(""); // Clear any previous errors
      } catch (err: any) {
        console.error("Failed to fetch budgets:", err);
        setError("Failed to fetch budgets. Please try again later.");
      } finally {
        setIsLoading(false); // Stop loading
      }
    };
    fetchBudgets();
  }, []);

  // Handle budget deletion
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await api.delete(`/api/accounts/budget/${id}/delete/`);
        // Remove the deleted budget from the state
        setBudgets((prevBudgets) => prevBudgets.filter((budget) => budget.id !== id));
        alert("Budget deleted successfully!");
      } catch (err) {
        console.error("Failed to delete budget:", err);
        alert("Failed to delete budget. Please try again later.");
      }
    }
  };

  // Navigate to BudgetAllocationForm
  const handleAddBudget = () => {
    navigate("/allocate-budget"); // Navigate to the BudgetAllocationForm page
  };

  // Navigate to UpdateBudgetForm
  const handleEditBudget = (budgetId: number) => {
    navigate(`/update-budget/${budgetId}`); // Navigate to the UpdateBudgetForm page
  };

  if (isLoading) {
    return <p className="text-center">Loading budgets...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Allocated Budgets</h2>
        <button
          onClick={handleAddBudget}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add Budget
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {budgets.length === 0 ? (
        <p>No budgets allocated yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Allocated To</th>
              <th className="p-3 text-left">Allocated At</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => (
              <tr key={budget.id} className="border-b">
                <td className="p-3">{budget.department}</td>
                <td className="p-3">${budget.allocated_amount}</td>
                <td className="p-3">{budget.allocated_to}</td>
                <td className="p-3">
                  {new Date(budget.allocated_at).toLocaleString()}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEditBudget(budget.id)}
                    className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BudgetList;