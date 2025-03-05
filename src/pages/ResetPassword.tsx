import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search); // To get the query params from the URL
  const uidb64 = searchParams.get('uidb64');
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!uidb64 || !token) {
      setError('Invalid or missing parameters.');
    }
  }, [uidb64, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/accounts/reset-password/${uidb64}/${token}/`,
        {
          new_password: newPassword,
          confirm_password: confirmPassword,
        }
      );
      setMessage(response.data.detail);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
