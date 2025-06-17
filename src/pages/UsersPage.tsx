import { useState, useEffect } from 'react';
import { Mail, Building, Loader2 } from 'lucide-react';
import api from "../../src/api";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  department?: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null); // ID of user being deleted
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/api/accounts/users/`);
      const usersData = response.data;
      
      const transformedUsers = usersData.map((user: any) => ({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        department: user.department || null
      }));
      
      setUsers(transformedUsers);
      
      if (transformedUsers.length === 0) {
        setError('No users found.');
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 401) {
          setError('Authentication required. Please login.');
        } else {
          setError('Failed to load users. Please try again later.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async (userId: number) => {
  if (!window.confirm('Are you sure you want to delete this user?')) return;
  
  try {
    setDeleting(userId);
    await api.delete(`/api/accounts/api/users/delete/${userId}/`);
    
    // Remove user from local state instead of refetching
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    
    // Show temporary success message
    setSuccess(`User deleted successfully`);
    setTimeout(() => setSuccess(''), 3000);
  } catch (err: any) {
    const errorMessage = err.response?.data?.error || 'Failed to delete user';
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  } finally {
    setDeleting(null);
  }
};

  // Format role for display
  const formatRole = (role: string) => {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-sm">
        <div className="text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-xl font-bold">Error Loading Users</h3>
          <p className="mt-2">{error}</p>
          {error === 'Authentication required. Please login.' ? (
            <a 
              href="/login"
              className="inline-block px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Go to Login
            </a>
          ) : (
            <button 
              onClick={fetchUsers}
              className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render user list
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <a 
          href='/register' 
          className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Add User
        </a>
      </div>

      <div className="overflow-hidden bg-white shadow-sm rounded-xl">
        <div className="grid grid-cols-1 gap-6 p-6">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="flex flex-col items-start gap-4 p-4 rounded-lg md:flex-row md:items-center bg-gray-50"
            >
              <div className="flex items-center justify-center w-16 h-16 text-white bg-blue-600 rounded-full">
                {user.username.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{user.username}</h3>
                <p className="text-sm text-gray-600">{formatRole(user.role)}</p>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} />
                    <span>{user.email}</span>
                  </div>
                  
                  {user.role.toLowerCase() === 'department_head' && user.department && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building size={16} />
                      <span>Department: {user.department}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleDelete(user.id)}
                  
                  className={`px-3 py-1 text-sm text-red-600 transition-colors border border-red-600 rounded hover:bg-red-50 ${
                    deleting === user.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {deleting === user.id ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}