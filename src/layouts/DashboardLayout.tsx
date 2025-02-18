import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

type DashboardLayoutProps = {
  role: string;
};

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const location = useLocation();

  const hideSidebarPaths = ['/login', '/register'];

  return (
    <div className="flex h-screen bg-white">
      {!hideSidebarPaths.includes(location.pathname) && <Sidebar role={role} />}
      <main className="flex-1 overflow-auto">
        <div className="container px-4 py-8 mx-auto sm:px-6">
          <div className="pt-12 sm:pt-0">
            <Outlet context={{ role: role }} />
          </div>
        </div>
      </main>
    </div>
  );
}
