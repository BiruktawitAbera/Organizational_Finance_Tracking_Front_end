import React from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar.tsx";
import { User, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  Users,
  Menu,
  X,
  DollarSign,
  CreditCard,
  Building,
  LogOut,
  FileText,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
interface SidebarProps {
  role: 'manager' | 'admin'; 
  username: string;
  email: string;
}

const baseMenuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/incomes', icon: DollarSign, label: 'Income' },
  { path: '/expenses', icon: CreditCard, label: 'Expenses' },
  { path: '/department', icon: Building, label: 'Department' },

];




function Sidebar({ role }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate();
  const handleProfile = () => navigate('/ProfilePage');
  const handleLogout = () => navigate('/login');

  const roleBasedMenuItems = [];

  if (role === 'manager') {
    roleBasedMenuItems.push({ path: '/prediction', icon: FileText, label: 'Predictions' });
    roleBasedMenuItems.push({ path: '/manager/budgets', icon: FileText, label: 'Budget' });
    roleBasedMenuItems.push({ path: '/BudgetRequestList', icon: FileText, label: 'Budget Requests' });

  } else if (role === 'admin') {
    roleBasedMenuItems.push({ path: '/users', icon: Users, label: 'Users' });
    roleBasedMenuItems.push({ path: '/prediction', icon: FileText, label: 'Predictions' });
    roleBasedMenuItems.push({ path: '/manager/budgets', icon: FileText, label: 'Budget' });

  } else {
        roleBasedMenuItems.push({ path: '/BudgetRequest', icon: FileText, label: 'Budget Request' });

  }

  
  const menuItems = [...baseMenuItems, ...roleBasedMenuItems];

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
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="border-2 border-blue-500">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <ArrowUp className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="font-bold text-gray-600">{role}</div>
            <LogOut size={20} />
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
