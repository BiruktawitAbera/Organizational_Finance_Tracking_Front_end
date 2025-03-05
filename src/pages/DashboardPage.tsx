import { Users, DollarSign, ShoppingCart, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar.tsx";
import DoughnutChart from "../components/totalprofit.tsx"
import AnimatedCounter from "../components/animatedcounter.tsx"
import { Tv, Coins } from 'lucide-react';
import IncomeTable from '../components/table.tsx';
import { Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const lineData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: '#2D5BFF',
      backgroundColor: 'rgba(75,192,192,0.2)',
    },
  ],
};

const lineOptions = {
  responsive: true,
  elements: {
    line: {
      tension: 0.4, 
    },
    point: {
      radius: 0,
    }
  },
  scales: {
    x: {
      display: false, 
    },
    y: {
      display: false,
    },
  },
  plugins: {
    legend: {
      display: false, 
    },
  },
};

const recentActivities = [
  {
    icon: Tv,
    description: 'Subscription',
    time: '25 left',
    progress: 9,
    maxProgress: 10,
  },
  {
    icon: ShoppingCart,
    description: 'Marketing',
    time: '120 left',
    progress: 7,
    maxProgress: 10,
  },
  {
    icon: Coins,
    description: 'Savings',
    time: '50 left',
    progress: 8,
    maxProgress: 10,
  }
];

const stats = [
  {
    label: 'Total Revenue',
    value: '$45,231.89',
    icon: DollarSign,
    change: '+20.1%',
    changeType: 'positive'
  },
  {
    label: 'Active Users',
    value: '2,338',
    icon: Users,
    change: '+15.3%',
    changeType: 'positive'
  },
  {
    label: 'New Orders',
    value: '182',
    icon: ShoppingCart,
    change: '-3.2%',
    changeType: 'negative'
  },
];

const doughnutData = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: ['#1E90FF', '#4682B4', '#5F9EA0'],
      hoverBackgroundColor: ['#1E90FF', '#4682B4', '#5F9EA0'],
      hoverOffset: 4,
    },
  ],
};

const doughnutOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

interface DashboardPageProps {
  role: string; // Role passed directly as a string prop
}

export default function DashboardPage({ role }: DashboardPageProps) {
  return (
    <div className='font-inter'>
      <div className='flex items-center justify-between mb-6'>
        <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, <span className='text-transparent bg-gradient-to-r from-custom-blue to-custom-light-blue bg-clip-text'>{role}</span>
        </h1>
        <p className='text-[#475467]'>Access & manage your finance in a simple and effective way</p>
        </div>
        <div className='flex items-center'>
          <Bell className="w-6 h-6 mr-4 text-gray-800" />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Shared Section for All Roles */}
      <section className='flex p-6 mb-6 bg-white rounded-lg shadow-lg' style={{ borderRadius: '20px', height: '168px' }}>
        <div className='w-32 h-32 mr-6'><DoughnutChart /></div>
        <div className='flex flex-col gap-6'>
            <h2 className='font-semibold text-[#101828] text-base'>Current Profit</h2>
            <div className="flex flex-col gap-2">
              <p className="font-medium text-[#475467] text-sm">
                Total Current Balance
              </p>
              <div className="font-bold text-[#101828] text-3xl flex-center gap-2">
                <AnimatedCounter />
              </div>
            </div>
        </div>
      </section>

      {/* Conditional Sections Based on Role */}
      {role === 'admin' && (
        <section className='flex flex-col p-6 mb-6 bg-white rounded-lg shadow-lg'>
          <div className="flex flex-col justify-between w-full md:flex-row">
            <div className="flex flex-col items-center w-full mb-4 md:w-1/2 md:mb-0">
              <div className="flex items-center justify-center w-full" style={{ height: '200px' }}>
                <Line data={lineData} options={lineOptions} />
              </div>
              <p className='mt-4 text-lg font-bold'>Prediction</p>
            </div>
            <p className='flex items-end mt-4 text-lg font-bold text-center md:mt-0'>Status: <span className="text-green-500">Good</span></p>
            <div className="flex flex-col items-center w-full md:w-1/2">
              <div className="flex items-center justify-center w-full" style={{ height: '200px' }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
              <p className='mt-4 text-lg font-bold'>Budget Allocation</p>
            </div>
          </div>
        </section>
      )}

      {/* Conditionally Rendered for Non-Admin */}
      {role !== 'admin' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="p-6 bg-white shadow-md rounded-xl">
            <h2 className="mb-4 text-lg font-bold text-gray-800">My Budget</h2>
            <div className="space-y-3">
              {recentActivities.map((activity, i) => (
                <div key={i} className="space-y-1">
                  <div className={`flex items-center gap-4 p-5 rounded-xl ${i === 0 ? "bg-blue-100/25" : i === 1 ? "bg-pink-100/25" : "bg-green-100/25"}`}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${i === 0 ? "bg-blue-700/25" : i === 1 ? "bg-pink-700/25" : "bg-green-700/25"}`}>
                      <activity.icon size={20} className={i === 0 ? "text-blue-700" : i === 1 ? "text-pink-700" : "text-green-700"} />
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between w-full">
                        <p className={i === 0 ? "text-sm font-semibold text-blue-900" : i === 1 ? "text-sm font-semibold text-pink-900" : "text-sm font-semibold text-green-900"}>{activity.description}</p>
                        <p className={i === 0 ? "text-sm font-normal text-blue-700" : i === 1 ? "text-sm font-normal text-pink-700" : "text-sm font-normal text-green-700"}>{activity.time}</p>
                      </div>
                      <div className={`w-full h-2 rounded-full ${i === 0 ? "bg-blue-200" : i === 1 ? "bg-pink-200" : "bg-green-200"}`}>
                        <div className={`h-full rounded-full ${i === 0 ? "bg-blue-700" : i === 1 ? "bg-pink-700" : "bg-green-700"}`} style={{ width: `${(activity.progress / activity.maxProgress) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats (Visible for all roles) */}
      <div className="grid grid-cols-1 gap-6 mt-8 mb-8 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 bg-white shadow-md rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-medium text-gray-800">Statistics</h2>
                <p className="text-lg font-semibold text-gray-900">{stat.label}</p>
              </div>
              <div className="p-3 bg-blue-100/25 rounded-full">
                <stat.icon className="text-blue-700 w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}