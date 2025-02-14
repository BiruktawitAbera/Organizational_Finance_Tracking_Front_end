import React from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar.tsx";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Menu,
  X,
  DollarSign,
  CreditCard,
  Building,
  LogOut,
  FileText,
} from 'lucide-react';

// Define the type for the Sidebar props
interface SidebarProps {
  role: 'manager' | 'admin'; // Adjust as necessary for your roles
  username: string;
  email: string;
}

// Define the base menu items
const baseMenuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/income', icon: DollarSign, label: 'Income' },
  { path: '/expense', icon: CreditCard, label: 'Expenses' },
  { path: '/budget', icon: BarChart3, label: 'Budget' },
  { path: '/department', icon: Building, label: 'Department' },
];

function Sidebar({ role }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Dynamically create menu items based on the role
  const roleBasedMenuItems = [];

  if (role === 'manager') {
    roleBasedMenuItems.push({ path: '/reports', icon: FileText, label: 'Reports' });
  } else if (role === 'admin') {
    roleBasedMenuItems.push({ path: '/users', icon: Users, label: 'Users' });
  }

  const settingsMenuItem = [{ path: '/settings', icon: Settings, label: 'Settings' }];
  const menuItems = [...baseMenuItems, ...roleBasedMenuItems, ...settingsMenuItem];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 p-2 bg-white rounded-md shadow-md top-4 left-4 lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-white shadow-lg z-40
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center p-6">
          <img src="logo.png" alt="logo" />
          <h1 className="font-serif text-2xl font-bold text-gray-800">BudgetWise</h1>
        </div>
        <nav className="px-4 py-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-lg
                transition-colors duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-custom-blue to-custom-light-blue text-white'
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        {/* User info and role */}
        <hr className="mt-20 border-gray-300" />
        <div className="flex items-center justify-between p-4 mt-auto">
        <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
          <div className="font-bold text-gray-600">{role}@gmail.com</div>
            <LogOut size={20} />
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
