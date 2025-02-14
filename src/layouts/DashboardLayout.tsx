import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

type DashboardLayoutProps = {
  role: string; // Define the type of role, adjust if necessary
};

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const location = useLocation(); // Get the current location

  // Define paths where the sidebar should not be displayed
  const hideSidebarPaths = ['/login', '/register'];

  return (
    <div className="flex h-screen bg-white">
      {/* Conditionally render Sidebar based on the current path */}
      {!hideSidebarPaths.includes(location.pathname) && <Sidebar role={role} />}
      <main className="flex-1 overflow-auto">
        <div className="container px-4 py-8 mx-auto sm:px-6">
          {/* Add padding to prevent overlap with mobile menu button */}
          <div className="pt-12 sm:pt-0">
            <Outlet context={{ role: role }} /> {/* Pass role to the outlet */}
          </div>
        </div>
      </main>
    </div>
  );
}
