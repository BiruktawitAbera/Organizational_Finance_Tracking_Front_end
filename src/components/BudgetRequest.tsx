import React, { useState } from 'react';
import axios from 'axios';

const BudgetRequest = () => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Fetch department head's budget requests
  React.useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/budget-requests/my/', {
          headers: { Authorization: `Token ${token}` }
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Failed to load budget requests', error);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('/budget-requests/create/', 
        { amount, reason },
        { headers: { Authorization: `Token ${token}` } }
      );
      
      setMessage('Budget request submitted successfully!');
      setAmount('');
      setReason('');
      
      // Refresh the request list
      const response = await axios.get('/budget-requests/my/', {
        headers: { Authorization: `Token ${token}` }
      });
      setRequests(response.data);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to submit request');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'DISAPPROVED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Request Additional Budget</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
            Reason
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3">My Budget Requests</h3>
        
        {loadingRequests ? (
          <div className="text-center py-4">Loading requests...</div>
        ) : requests.length === 0 ? (
          <p className="text-gray-600">No budget requests found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Reason</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b">
                    <td className="py-2 px-4">${parseFloat(request.amount).toFixed(2)}</td>
                    <td className="py-2 px-4">{request.reason}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetRequest;