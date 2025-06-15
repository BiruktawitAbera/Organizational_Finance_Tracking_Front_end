import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface BudgetRequest {
  id: number;
  amount: string;
  reason: string;
  status: string;
  created_at: string;
}

interface BudgetRequestListProps {
  isManagerView?: boolean;
}

const BudgetRequestList: React.FC<BudgetRequestListProps> = ({ isManagerView = false }) => {
  const [requests, setRequests] = useState<BudgetRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isManagerView 
        ? '/budget-requests/manager/' 
        : '/budget-requests/my/';
      
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Token ${token}` }
      });
      
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to load budget requests', error);
    } finally {
      setIsLoading(false);
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

  if (requests.length === 0) {
    return <p className="text-gray-600">No budget requests found</p>;
  }

  return (
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
  );
};

export default BudgetRequestList;