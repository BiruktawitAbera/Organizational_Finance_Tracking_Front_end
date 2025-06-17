import React, { useState } from 'react';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

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
              <div className='flex flex-1 justify-between'>
                <div>
                  <Label className="px-1">Start Date</Label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
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
                className='bg-gradient-to-r from-custom-blue to-custom-light-blue text-white'
                onClick={handlePredict}
                disabled={loading}
              >
                {loading ? 'Predicting...' : 'Predict'}
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-1">
          {predictions ? (
            <div className="p-6 bg-white shadow-sm rounded-xl h-full">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Prediction Results</h2>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-700">Configuration</h3>
                <p>Start: {predictions.prediction_config.start_date}</p>
                <p>End: {predictions.prediction_config.end_date}</p>
                <p>Span: {predictions.prediction_config.prediction_span} periods</p>
                <p>Type: {predictions.prediction_config.period_type}</p>
                <p>Departments: {predictions.prediction_config.managed_departments.join(', ')}</p>
              </div>
              
              <div>
                <h3 className="mb-2 font-medium text-gray-700">Net Budget Prediction</h3>
                <div className="space-y-2">
                  {predictions.net_budget_prediction.map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
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
            </div>
          ) : (
            <div className="p-6 bg-white shadow-sm rounded-xl h-full flex items-center justify-center">
              <p className="text-gray-500">
                {loading ? 'Generating predictions...' : 'Submit the form to see predictions'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}