import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../src/api";

interface Income {
  id: number;
  amount: string;
  date: string;
  description: string;
  department: string;
  created_at: string;
  updated_at: string;
  created_by: number;
}

interface User {
  id: number;
  email: string;
  is_department_head: boolean;
  is_manager: boolean;
  is_superuser: boolean;
  department: string;
}

const IncomeList: React.FC = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [recentIncomes, setRecentIncomes] = useState<Income[]>([]);
  const [fullHistoryIncomes, setFullHistoryIncomes] = useState<Income[]>([]); // New state for full history
  const [isFetchingFullHistory, setIsFetchingFullHistory] = useState<boolean>(false); // Loading state for full history
  const [showFullHistory, setShowFullHistory] = useState<boolean>(false); // Toggle between views
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [isManagerView, setIsManagerView] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user info from local storage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Check if user is manager or admin
        if (parsedUser.is_manager || parsedUser.is_superuser) {
          setIsManagerView(true);
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.success) {
      setSuccessMessage(location.state.success);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  // Fetch incomes
  const fetchIncomes = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      if (isManagerView) {
        // For managers/admins, fetch recent incomes and total
        const [recentResponse, summaryResponse] = await Promise.all([
          api.get("/api/accounts/incomes/history/", {
            params: {
              ordering: "-created_at",
              page_size: 5
            }
          }),
          api.get("/api/accounts/incomes/summary/")
        ]);
        
        // Handle both paginated and non-paginated responses
        setRecentIncomes(recentResponse.data.results || recentResponse.data);
        setTotalIncome(summaryResponse.data.total_income || 0);
      } else {
        // For department heads, fetch normal income list
        const response = await api.get("/api/accounts/income-list/");
        setIncomes(response.data);
      }
    } catch (err: any) {
      setError("Failed to fetch income records. Please try again later.");
      console.error("API error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch full income history
  const fetchFullIncomeHistory = async () => {
    try {
      setIsFetchingFullHistory(true);
      setError("");
      
      const response = await api.get("/api/accounts/incomes/history/");
      setFullHistoryIncomes(response.data.results || response.data);
      setShowFullHistory(true);
    } catch (err: any) {
      setError("Failed to fetch full income history. Please try again later.");
      console.error("API error:", err);
    } finally {
      setIsFetchingFullHistory(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchIncomes();
    }
  }, [user, isManagerView]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  // Calculate department total
  const departmentTotal = user?.department 
    ? incomes
        .filter(income => income.department === user.department)
        .reduce((sum, income) => sum + parseFloat(income.amount), 0)
    : 0;

  // Handle income creation navigation
  const handleCreateIncome = () => {
    navigate("/create-income");
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Loading user information...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Loading income records...</p>
      </div>
    );
  }

  const isDepartmentHead = user.is_department_head;
  const userDepartment = user.department;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Income Records</h2>
          <div className="text-sm text-gray-500 mt-1">
            {userDepartment && `Department: ${userDepartment}`}
            {isManagerView && " (Manager/Admin View)"}
          </div>
        </div>
        
        <div>
          {isDepartmentHead && !isManagerView && (
            <button
              onClick={handleCreateIncome}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Income
            </button>
          )}
        </div>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Manager/Admin View */}
      {isManagerView ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold mb-4">Total Income Summary</h3>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
              <p className="text-gray-600 mt-2">Across all departments</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold mb-4">
                {showFullHistory ? "Full Income History" : "Recent Income Records"}
              </h3>
              <p className="text-gray-600">
                {showFullHistory 
                  ? `Showing all ${fullHistoryIncomes.length} records`
                  : "Showing latest 5 records"}
              </p>
            </div>
          </div>

          {(showFullHistory ? fullHistoryIncomes : recentIncomes).length === 0 ? (
            <div className="text-center py-8 border border-gray-200 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl mb-2">No income records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Department</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Recorded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(showFullHistory ? fullHistoryIncomes : recentIncomes).map((income) => (
                    <tr key={income.id} className="hover:bg-gray-50">
                      <td className="p-3">{formatDate(income.date)}</td>
                      <td className="p-3 max-w-xs">{income.description}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {income.department}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-semibold text-green-700">
                        {formatCurrency(income.amount)}
                      </td>
                      <td className="p-3 text-sm text-gray-500">{formatDate(income.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={showFullHistory ? () => setShowFullHistory(false) : fetchFullIncomeHistory}
              disabled={isFetchingFullHistory}
              className={`bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none flex items-center justify-center mx-auto ${
                isFetchingFullHistory ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isFetchingFullHistory ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : showFullHistory ? (
                "Show Recent Income Records"
              ) : (
                "View Full Income History"
              )}
            </button>
          </div>
        </>
      ) : (
        // Department Head View (existing logic)
        <>
          {incomes.length === 0 ? (
            <div className="text-center py-8 border border-gray-200 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl mb-2">No income records found</p>
              <p className="text-gray-600 mb-6">Get started by creating your first income record</p>
              {isDepartmentHead ? (
                <button
                  onClick={handleCreateIncome}
                  className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none text-lg"
                >
                  Create Income Record
                </button>
              ) : (
                <p className="text-gray-500">Only department heads can create income records</p>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">ID</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Description</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Department</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {incomes.map((income) => (
                      <tr key={income.id} className="hover:bg-gray-50">
                        <td className="p-3">{income.id}</td>
                        <td className="p-3">{formatDate(income.date)}</td>
                        <td className="p-3 max-w-xs">{income.description}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {income.department}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-semibold text-green-700">
                          {formatCurrency(income.amount)}
                        </td>
                        <td className="p-3 text-sm text-gray-500">{formatDate(income.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Department Summary for Department Heads */}
              {isDepartmentHead && userDepartment && (
                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Department Summary</h3>
                    <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                      {userDepartment}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                      <h4 className="text-gray-500 text-sm uppercase">Total Income</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(departmentTotal)}
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded shadow">
                      <h4 className="text-gray-500 text-sm uppercase">Number of Records</h4>
                      <p className="text-2xl font-bold">
                        {incomes.filter(i => i.department === userDepartment).length}
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded shadow">
                      <h4 className="text-gray-500 text-sm uppercase">Latest Record</h4>
                      <p className="text-lg">
                        {incomes.length > 0 ? formatDate(incomes[0].date) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default IncomeList;