import React, { useState, useEffect } from 'react';
import { Users, DollarSign, ShoppingCart, Bell, BarChart, FileText, User, ArrowUp, ArrowDown, Lock, Activity } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import api from "../../src/api";
import { format } from 'date-fns';

interface DashboardData {
  // Common fields
  total_budget?: number;
  total_expenses?: number;
  pending_requests?: number;
  
  // Admin-specific
  budget_allocation?: { department: string; amount: number }[];
  income_timeline?: { quarter: string; amount: number }[];
  expense_timeline?: { quarter: string; amount: number }[];
  
  // Manager-specific
  expense_trends?: { month: string; amount: number }[];
  
  // Recent activities for all roles
  recent_activities?: {
    type: string;
    id: number;
    department?: string;
    amount?: number;
    description: string;
    status?: string;
    date: string;
    link?: string;
  }[];
  
  // Department Head-specific
  available_budget?: number;
}

interface DashboardPageProps {
  role: string; // 'admin', 'manager', or 'department_head'
}

const DashboardPage: React.FC<DashboardPageProps> = ({ role }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let endpoint = '';
        switch(role) {
          case 'admin':
            endpoint = 'api/accounts/dashboard/admin/';
            break;
          case 'manager':
            endpoint = 'api/accounts/manager/dashboard/';
            break;
          case 'department_head':
            endpoint = '/api/accounts/department/dashboard/';
            break;
          default:
            throw new Error('Invalid user role');
        }
        
        const response = await api.get(endpoint);
        setDashboardData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [role]);

  const handleProfile = () => navigate('/ProfilePage');
  const handleLogout = () => navigate('/login');

  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '$0.00';
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'DISAPPROVED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-700 p-8 rounded-lg border border-red-200 max-w-md">
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Error Loading Dashboard</h3>
            <p className="mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Common stats cards
  const renderStatsCard = (title: string, value: string, icon: React.ElementType, change?: string) => {
    const isPositive = change?.includes('+');
    
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
          <div className="p-2 bg-blue-100/50 rounded-lg">
            {React.createElement(icon, { className: "h-5 w-5 text-blue-600" })}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <div className={`flex items-center mt-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {change}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Admin Dashboard
  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderStatsCard("Total Budget", formatCurrency(dashboardData?.total_budget), DollarSign, "+5.2% from last quarter")}
        {renderStatsCard("Total Expenses", formatCurrency(dashboardData?.total_expenses), ShoppingCart, "+12.7% from last quarter")}
        {renderStatsCard("Departments", "4", Users, "2 new this year")}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Budget Allocation by Department</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {dashboardData?.budget_allocation && dashboardData.budget_allocation.length > 0 ? (
              <Pie 
                data={{
                  labels: dashboardData.budget_allocation.map(item => item.department),
                  datasets: [{
                    data: dashboardData.budget_allocation.map(item => item.amount),
                    backgroundColor: ['#1E90FF', '#4682B4', '#5F9EA0', '#3CB371', '#FF6347'],
                  }]
                }}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No budget allocation data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quarterly Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {dashboardData?.income_timeline && dashboardData.income_timeline.length > 0 ? (
              <Bar 
                data={{
                  labels: dashboardData.income_timeline.map(item => item.quarter),
                  datasets: [
                    {
                      label: 'Income',
                      data: dashboardData.income_timeline.map(item => item.amount),
                      backgroundColor: '#10B981',
                    },
                    {
                      label: 'Expenses',
                      data: dashboardData.expense_timeline?.map(item => item.amount) || [],
                      backgroundColor: '#EF4444',
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No quarterly data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities for Admin */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent System Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData?.recent_activities && dashboardData.recent_activities.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recent_activities.map((activity, index) => (
                <div key={index} className="flex items-center p-3 border-b hover:bg-gray-50">
                  <div className="p-2 mr-3 bg-gray-100 rounded-full">
                    {activity.type === 'login' ? (
                      <Lock className="h-5 w-5 text-gray-600" />
                    ) : activity.type === 'budget_change' ? (
                      <DollarSign className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Activity className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activity.description}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(activity.date), 'MMM dd, yyyy - hh:mm a')}
                    </p>
                  </div>
                  {activity.amount && (
                    <div className="ml-4 font-medium">
                      {formatCurrency(activity.amount)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-500">
              No recent activities
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Manager Dashboard
  const renderManagerDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderStatsCard("Managed Budget", formatCurrency(dashboardData?.total_budget), DollarSign, "12% remaining")}
        {renderStatsCard("Pending Approvals", dashboardData?.pending_requests?.toString() || "0", FileText, "+3 since yesterday")}
        {renderStatsCard("Budget Requests", "7", ShoppingCart, "2 new today")}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Expense Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {dashboardData?.expense_trends && dashboardData.expense_trends.length > 0 ? (
              <Line 
                data={{
                  labels: dashboardData.expense_trends.map(item => item.month),
                  datasets: [{
                    label: 'Expenses',
                    data: dashboardData.expense_trends.map(item => item.amount),
                    borderColor: '#2D5BFF',
                    backgroundColor: 'rgba(45, 91, 255, 0.1)',
                    tension: 0.3,
                  }]
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No expense trends data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Pending Actions</CardTitle>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {dashboardData?.recent_activities && dashboardData.recent_activities.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {dashboardData.recent_activities
                  .filter(activity => activity.status === 'PENDING')
                  .map((activity, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{activity.department}</div>
                          <div className="text-sm text-gray-500">{activity.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(activity.amount)}</div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(activity.date), 'MMM dd, yyyy')}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => activity.link && navigate(activity.link)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No pending actions
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Decisions for Manager */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent Decisions</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData?.recent_activities && dashboardData.recent_activities.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recent_activities
                .filter(activity => activity.status && activity.status !== 'PENDING')
                .map((activity, index) => (
                  <div key={index} className="flex items-center p-3 border-b hover:bg-gray-50">
                    <div className="p-2 mr-3 bg-gray-100 rounded-full">
                      {activity.type === 'expense' ? (
                        <ShoppingCart className="h-5 w-5 text-gray-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{activity.description}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {format(new Date(activity.date), 'MMM dd, yyyy')} • 
                        Status: <span className={activity.status ? getStatusColor(activity.status) : ''}>
                          {activity.status || 'N/A'}
                        </span>
                      </p>
                    </div>
                    <div className="ml-4 font-medium">
                      {formatCurrency(activity.amount || 0)}
                    </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-500">
              No recent decisions
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Department Head Dashboard
  const renderDepartmentHeadDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderStatsCard("Allocated Budget", formatCurrency(dashboardData?.total_budget), DollarSign, "+$20,000 this quarter")}
        {renderStatsCard("Available Balance", formatCurrency(dashboardData?.available_budget), BarChart, "19% remaining")}
        {renderStatsCard("Pending Expenses", dashboardData?.pending_requests?.toString() || "0", FileText, "3 awaiting approval")}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Budget Utilization</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            {dashboardData?.expense_trends && dashboardData.expense_trends.length > 0 ? (
              <Line 
                data={{
                  labels: dashboardData.expense_trends.map(item => item.month),
                  datasets: [{
                    label: 'Budget Utilization',
                    data: dashboardData.expense_trends.map(item => item.amount),
                    borderColor: '#2D5BFF',
                    backgroundColor: 'rgba(45, 91, 255, 0.1)',
                    tension: 0.3,
                  }]
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No budget utilization data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData?.recent_activities && dashboardData.recent_activities.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recent_activities.map((activity, index) => (
                <div key={index} className="flex items-center p-3 border-b hover:bg-gray-50">
                  <div className="p-2 mr-3 bg-gray-100 rounded-full">
                    {activity.type === 'expense' ? (
                      <ShoppingCart className="h-5 w-5 text-gray-600" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activity.description}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {format(new Date(activity.date), 'MMM dd, yyyy')} • 
                      Status: <span className={activity.status ? getStatusColor(activity.status) : ''}>
                        {activity.status || 'N/A'}
                      </span>
                    </p>
                  </div>
                  <div className="ml-4 font-medium">
                    {formatCurrency(activity.amount || 0)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-500">
              No recent activities
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome, <span className='text-transparent bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text'>{role.replace('_', ' ')}</span>
          </h1>
          <p className='text-gray-600 mt-1'>Access & manage your finance in a simple and effective way</p>
        </div>
        <div className='flex items-center'>
          <button className="p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell className="w-5 h-5" />
          </button>
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
        </div>
      </div>

      {/* Dashboard content */}
      <div className="mt-8">
        {role === 'admin' && renderAdminDashboard()}
        {role === 'manager' && renderManagerDashboard()}
        {role === 'department_head' && renderDepartmentHeadDashboard()}
      </div>
    </div>
  );
};

export default DashboardPage;