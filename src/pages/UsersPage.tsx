import { Mail, Phone, MapPin } from 'lucide-react';

const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    location: 'New York, USA',
    phone: '+1 234 567 890',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    location: 'London, UK',
    phone: '+44 123 456 789',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'User',
    location: 'Toronto, CA',
    phone: '+1 345 678 901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces'
  }
];

export default function UsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <button className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          Add User
        </button>
      </div>

      <div className="overflow-hidden bg-white shadow-sm rounded-xl">
        <div className="grid grid-cols-1 gap-6 p-6">
          {users.map((user, index) => (
            <div key={index} className="flex flex-col items-start gap-4 p-4 rounded-lg md:flex-row md:items-center bg-gray-50">
              <img
                src={user.avatar}
                alt={user.name}
                className="object-cover w-16 h-16 rounded-full"
              />
              
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.role}</p>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{user.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm text-blue-600 transition-colors border border-blue-600 rounded hover:bg-blue-50">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm text-red-600 transition-colors border border-red-600 rounded hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}