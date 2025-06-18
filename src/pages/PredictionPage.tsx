import React, { useState, useMemo } from 'react';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

// Helper function to calculate net budget
const calculateNetBudget = (incomeData, expenseData) => {
  if (!incomeData || !expenseData) return [];
  
  // Create a map for faster lookups
  const expenseMap = new Map();
  expenseData.forEach(item => {
    expenseMap.set(item.period, item.total_amount);
  });

  return incomeData.map(incomeItem => {
    const period = incomeItem.period;
    const expenseAmount = expenseMap.get(period) || 0;
    return {
      period,
      net_budget: incomeItem.total_amount - expenseAmount
    };
  });
};

export default function SettingsPage({role}) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [predictionSpan, setPredictionSpan] = useState(3);
  const [periodType, setPeriodType] = useState('quarterly');
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    setLoading(true);
    setError('');
    setPredictions(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/accounts/predictionss/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          prediction_span: predictionSpan,
          period_type: periodType
        })
      });

      // Get response text first to handle both HTML and JSON
      const responseText = await response.text();
      
      try {
        // Attempt to parse as JSON
        const data = JSON.parse(responseText);
        
        if (!response.ok) {
          // Handle Django error messages
          const errorMsg = data.detail || data.error || data.message || `Request failed with status ${response.status}`;
          throw new Error(errorMsg);
        }
        
        setPredictions(data);
      } catch (jsonError) {
        // If parsing fails, it's HTML - handle as error
        if (responseText.includes('<html')) {
          // Extract useful information from HTML
          const statusMatch = responseText.match(/<title>.*?(\d{3}).*?<\/title>/);
          const status = statusMatch ? statusMatch[1] : response.status;
          
          const errorMsg = `Server error (${status}): ${
            responseText.includes('Not Found') ? 'Endpoint not found' : 
            responseText.includes('Server Error') ? 'Internal server error' : 
            'Unexpected HTML response'
          }`;
          
          throw new Error(errorMsg);
        }
        throw new Error(`Invalid response: ${responseText.substring(0, 100)}`);
      }
    } catch (error) {
      setError(error.message);
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate net budget when predictions change
  const netBudgetData = useMemo(() => {
    if (!predictions) return [];
    
    // Use existing net budget if available
    if (predictions.net_budget_prediction) {
      return predictions.net_budget_prediction;
    }
    
    // Calculate if we have income and expense data
    if (predictions.predicted_income && predictions.predicted_expense) {
      return calculateNetBudget(
        predictions.predicted_income,
        predictions.predicted_expense
      );
    }
    
    return [];
  }, [predictions]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Predictions</h1>

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Enter the necessary details for prediction</h2>
            <div className="space-y-4">
              <div className='flex flex-1 justify-between gap-4'>
                <div className="w-full">
                  <Label className="px-1">Start Date</Label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <Label className="px-1">End Date</Label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label className="px-1">Span</Label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={predictionSpan}
                  onChange={(e) => setPredictionSpan(Number(e.target.value))}
                  min="1"
                  max="24"
                />
              </div>
              <div>
                <Label className="px-1">Period Type</Label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value)}
                >
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div className='flex justify-end mt-6'>
              <Button 
                className='bg-gradient-to-r from-custom-blue to-custom-light-blue text-white hover:from-blue-700 hover:to-light-blue-700 transition-colors'
                onClick={handlePredict}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Predicting...
                  </span>
                ) : 'Predict'}
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-1">
          {predictions ? (
            <div className="p-6 bg-white shadow-sm rounded-xl h-full">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Prediction Results</h2>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Configuration</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Start:</span> {predictions.prediction_config.start_date}</p>
                  <p><span className="font-medium">End:</span> {predictions.prediction_config.end_date}</p>
                  <p><span className="font-medium">Span:</span> {predictions.prediction_config.prediction_span} periods</p>
                  <p><span className="font-medium">Type:</span> {predictions.prediction_config.period_type}</p>
                  <p><span className="font-medium">Departments:</span> {predictions.prediction_config.managed_departments.join(', ')}</p>
                </div>
              </div>
              
              {/* Always show net budget if we have data */}
              {netBudgetData.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-2 font-medium text-gray-700">Net Budget Prediction</h3>
                  <div className="space-y-2">
                    {netBudgetData.map((item, index) => (
                      <div key={`net-${index}`} className="flex justify-between py-2 border-b">
                        <span className="font-medium">{item.period}</span>
                        <span className={`font-medium ${
                          item.net_budget >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${item.net_budget.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show income/expense breakdown if we have that data */}
              {(predictions.predicted_income || predictions.predicted_expense) && (
                <div className="mt-6">
                  <h3 className="mb-3 font-medium text-gray-700">Detailed Predictions</h3>
                  
                  {predictions.predicted_income && predictions.predicted_income.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-600 mb-1 flex items-center">
                        <span className="mr-2">Income</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </h4>
                      <div className="space-y-1">
                        {predictions.predicted_income.map((item, index) => (
                          <div key={`income-${index}`} className="flex justify-between py-1">
                            <span className="text-gray-600">{item.period}</span>
                            <span className="text-green-600 font-medium">${item.total_amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {predictions.predicted_expense && predictions.predicted_expense.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-600 mb-1 flex items-center">
                        <span className="mr-2">Expenses</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </h4>
                      <div className="space-y-1">
                        {predictions.predicted_expense.map((item, index) => (
                          <div key={`expense-${index}`} className="flex justify-between py-1">
                            <span className="text-gray-600">{item.period}</span>
                            <span className="text-red-600 font-medium">${item.total_amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 bg-white shadow-sm rounded-xl h-full flex items-center justify-center">
              <p className="text-gray-500 text-center">
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating predictions...
                  </span>
                ) : 'Submit the form to see predictions'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}