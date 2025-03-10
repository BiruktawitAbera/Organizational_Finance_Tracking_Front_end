import { useState } from 'react';
import { TrendingUp, Users, Target, PlusCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function AnalyticsPage() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState('');
  const [requestedBy, setRequestedBy] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ amount, reason, requestedBy });
    // Close the popover after submission
    setIsPopoverOpen(false);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Department Budget</h1>
      
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white shadow-md rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-purple-50">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">Growth</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">245%</p>
          <p className="text-sm text-gray-600">Compared to last month</p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Users</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">1,234</p>
          <p className="text-sm text-gray-600">Active users this week</p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-green-50">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Conversion</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">3.2%</p>
          <p className="text-sm text-gray-600">Current conversion rate</p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Button variant="gradient" onClick={() => setIsPopoverOpen(true)}>
          <PlusCircle size={20} color="white" /> Request Budget
        </Button>
      </div>

      {/* Popover for the form */}
      {isPopoverOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsPopoverOpen(false)} />
        <div className="bg-white p-10 rounded-lg shadow-lg z-10 w-1/2"> 
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Request Budget</h2>
            <button onClick={() => setIsPopoverOpen(false)} className="text-2xl text-gray-600 hover:text-gray-800">
              &times;
            </button>
            </div>
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
                  rows="3"
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
              <Button
                type="submit"
                className="px-4 py-2 font-bold focus:outline-none focus:shadow-outline"
                variant="gradient"
              >
                Submit Request
              </Button>
            </form>
          </div>
        </div>
      )}

      <div className="p-6 mt-3 mb-6 bg-white shadow-md rounded-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Performance Overview</h2>
        <div className="space-y-4">
          {['Growth', 'Spent', 'Remaining'].map((metric, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-gray-600">{metric}</span>
              <div className="w-2/3">
                <div className="h-2 bg-gray-100 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full" 
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}