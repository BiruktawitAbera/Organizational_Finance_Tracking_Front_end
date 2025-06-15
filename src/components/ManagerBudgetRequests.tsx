import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface BudgetRequest {
  id: number;
  amount: string;
  reason: string;
  status: string;
  created_at: string;
  requested_by: {
    id: number;
    name: string;
    email: string;
  };
}

const ManagerBudgetRequests = () => {
  const [requests, setRequests] = useState<BudgetRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/budget-requests/manager/', {
          headers: { Authorization: `Token ${token}` }
        });
        setRequests(response.data);
      } catch (error) {
        setMessage('Failed to load requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: number, status: 'APPROVED' | 'DISAPPROVED') => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/budget-requests/${id}/update/`, 
        { status },
        { headers: { Authorization: `Token ${token}` } }
      );
      
      // Update local state
      setRequests(requests.map(request => 
        request.id === id ? { ...request, status } : request
      ));
      
      setMessage(`Request ${status.toLowerCase()} successfully`);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdatingId(null);
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

  if (isLoading) {
    return <div className="text-center py-4">Loading requests...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Department Budget Requests</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
      
      {requests.length === 0 ? (
        <p className="text-gray-600">No pending budget requests</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Department Head</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Reason</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b">
                  <td className="py-3 px-4">
                    <div className="font-medium">{request.requested_by.name}</div>
                    <div className="text-sm text-gray-600">{request.requested_by.email}</div>
                  </td>
                  <td className="py-3 px-4">${parseFloat(request.amount).toFixed(2)}</td>
                  <td className="py-3 px-4">{request.reason}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {request.status === 'PENDING' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(request.id, 'APPROVED')}
                          disabled={updatingId === request.id}
                          className={`bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm ${
                            updatingId === request.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {updatingId === request.id ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(request.id, 'DISAPPROVED')}
                          disabled={updatingId === request.id}
                          className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm ${
                            updatingId === request.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {updatingId === request.id ? 'Disapproving...' : 'Disapprove'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagerBudgetRequests;