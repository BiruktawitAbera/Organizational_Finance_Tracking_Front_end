import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

function ProfilePage() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    role: '',
    department: '',
    salary: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/accounts/user-profile/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Format role for display
  const formatRole = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': 'Admin',
      'manager': 'Manager',
      'department_head': 'Department Head'
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <section className='flex p-6 mb-6 bg-white rounded-lg shadow-lg' style={{ borderRadius: '20px', height: '168px' }}>
        <div className='w-32 h-32 mr-6'>
          <Avatar>
            <AvatarImage 
              className="w-32 h-32 rounded-full" 
              src="https://github.com/shadcn.png" 
            />
            <AvatarFallback>
              {userData.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className='flex flex-col gap-6 items-center'>
          <h2 className="font-bold text-[#101828] text-3xl flex-center gap-2">
            {userData.username}
          </h2>
          <div className="flex flex-col gap-2">
            <p className="font-medium bg-[#475467] text-sm text-white p-2 rounded-sm">
              {formatRole(userData.role)}
            </p>
          </div>
        </div>
      </section>
      
      <section className='flex flex-col p-6 mb-6 bg-white rounded-lg shadow-lg h-full' style={{ borderRadius: '20px' }}>
        <div className="flex-col flex m-2">
          <h1 className="text-sm text-gray-500 mb-0.5">Email</h1>
          <p className="text-normal">{userData.email}</p>
        </div>

        {/* Conditionally render department only for department_head */}
        {userData.role === 'department_head' && (
          <div className="flex-col flex m-2">
            <h1 className="text-sm text-gray-500 mb-0.5">Department</h1>
            <p className="text-normal">{userData.department}</p>
          </div>
        )}
        
        <div className="flex flex-col m-2">
          <h1 className="text-sm text-gray-500 mb-0.5">Salary</h1>
          <p className="text-normal">{userData.salary}</p>
        </div>
      </section>
    </div>
  )
}

export default ProfilePage;