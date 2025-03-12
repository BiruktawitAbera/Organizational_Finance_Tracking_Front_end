import { useState } from 'react';
import { Button } from '../components/ui/button';

function RequestForm() {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!amount || !reason || !requestedBy) {
        throw new Error('All fields are required');
      }

      const response = await fetch('/api/submit-budget-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          reason,
          requestedBy,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setAmount('');
      setReason('');
      setRequestedBy('');
      setSuccess('Request submitted successfully!');
      setError(null);
    } catch (error: any) {
      setError(error.message);
      setSuccess(null);
    }
  };

  return (
    <div className="flex flex-1">
      <div className="flex-1 p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Request Budget</h1>

        <div className="p-6 bg-white shadow-md rounded-xl">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="amount" className="block mb-2 text-sm font-bold text-gray-700">
                Amount:
              </label>
              <input
                type="number"
                id="amount"
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="reason" className="block mb-2 text-sm font-bold text-gray-700">
                Reason:
              </label>
              <textarea
                id="reason"
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="requestedBy" className="block mb-2 text-sm font-bold text-gray-700">
                Requested By:
              </label>
              <input
                type="text"
                id="requestedBy"
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="mb-4 text-red-600">{error}</div>
            )}
            {success && (
              <div className="mb-4 text-green-600">{success}</div>
            )}
            <Button
              type="submit"
              className="w-full px-4 py-2 font-bold rounded focus:outline-none focus:shadow-outline"
              variant={'gradient'}
            >
              Submit Request
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RequestForm;
