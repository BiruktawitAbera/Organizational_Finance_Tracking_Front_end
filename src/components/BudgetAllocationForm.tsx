import React, { useState } from "react";
import api from "../../src/api"; // Adjust the import path as needed

// Define the type for the form data
interface BudgetFormData {
  department: string;
  allocated_amount: string;
}

// Define the props for the component
interface BudgetAllocationFormProps {
  onBudgetAllocated: (newBudget: any) => void; // Replace `any` with the actual type of the budget object
}

// Department choices
const DEPARTMENT_CHOICES = [
  { value: "income", label: "Income Breakdown" },
  { value: "savings", label: "Savings & Investments" },
  { value: "fixed_expenses", label: "Fixed Expenses" },
  { value: "variable_expenses", label: "Variable Expenses" },
];

const BudgetAllocationForm: React.FC<BudgetAllocationFormProps> = ({ onBudgetAllocated }) => {
  const [formData, setFormData] = useState<BudgetFormData>({
    department: "",
    allocated_amount: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loader state
  const [successMessage, setSuccessMessage] = useState<string>(""); // Success message state

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Show loader
    setError(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages

    try {
      const response = await api.post("/api/accounts/budget/", formData); // Use api.post directly
      onBudgetAllocated(response.data); // Notify parent component
      setFormData({ department: "", allocated_amount: "" }); // Reset form
      setSuccessMessage("Budget allocated successfully!"); // Show success message
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to allocate budget.");
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Allocate Budget</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Department:</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="" disabled>
              Select a department
            </option>
            {DEPARTMENT_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
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
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center"
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Allocating...
            </>
          ) : (
            "Allocate Budget"
          )}
        </button>
      </form>
    </div>
  );
};

export default BudgetAllocationForm;