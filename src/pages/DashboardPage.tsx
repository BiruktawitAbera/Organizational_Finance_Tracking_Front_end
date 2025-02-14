import { Users, DollarSign, ShoppingCart, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar.tsx";
import DoughnutChart from "../components/totalprofit.tsx"
import AnimatedCounter from "../components/animatedcounter.tsx"
// import PredictionSection from '../components/PredictionSection.tsx';
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
    // Add more datasets as needed
  ],
};

const lineOptions = {
  responsive: true,
  elements: {
    line: {
      tension: 0.4, // Smooth the lines
    },
    point: {
      radius: 0, // Remove the points
    }
  },
  scales: {
    x: {
      display: false, // Remove the x-axis
    },
    y: {
      display: false, // Remove the y-axis
    },
  },
  plugins: {
    legend: {
      display: false, // Hide the legend if desired
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
      display: false, // Hide the legend if desired
    },
  },
};

export default function DashboardPage({ role }) {
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
      <section className='flex p-6 mb-6 bg-white rounded-lg shadow-lg' style={{ borderRadius: '20px', height: '168px' }}>
        <div className='w-32 h-32 mr-6'><DoughnutChart /></div>
        <div className='flex flex-col gap-6'>
            <h2 className='font-semibold text-[#101828] text-base'> Current Profit</h2>
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
    <section className='flex p-6 mb-6 bg-white rounded-lg shadow-lg'>
        <div className="flex justify-between w-full">
          <div className="flex flex-col items-center w-1/2">
            <div className="flex items-center justify-center w-full" style={{ height: '200px' }}>
              <Line data={lineData} options={lineOptions} />
            </div>
            <p className='mt-4 text-lg font-bold'>Prediction</p>
          </div>
          <p className='flex items-end mt-4 text-lg font-bold'>Status: <span className="text-green-500"> Good</span></p>
          <div className="flex flex-col items-center w-1/2">
            <div className="flex items-center justify-center w-full" style={{ height: '200px' }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
            <p className='mt-4 text-lg font-bold'>Budget Allocation</p>
          </div>
        </div>
      </section>
    
    {/* PredictionSection */}
    {/* <section className="flex flex-col p-6 m-2 bg-white rounded-lg shadow-lg" style={{ borderRadius: '20px', height: '300px' }}>
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-center w-1/2">
              <div className="flex items-center justify-center w-full" style={{ height: '200px' }}>
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
            <div className="flex flex-col items-center w-1/2">
              <div className="flex items-center justify-center w-full" style={{ height: '200px' }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
          <div className="flex mt-4 justify-evenly">
            <div className='flex justify-between'>
              <p className="text-lg font-bold">Prediction for the next month</p>
              <p className="text-lg"><strong>Status: <span className="text-green-500">Good</span></strong></p>
            </div>
            <p className="text-lg font-bold"> Budgt Allocation</p>
          </div>
        </section> */}
  {/* Conditionally render Quick Actions based on role */}
  {role !== 'admin' && (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
    {/* Recent Activity Section */}
    <div className="p-6 bg-white shadow-md rounded-xl">
      <h2 className="mb-4 text-lg font-bold text-gray-800">My budget</h2>
      <div className="space-y-3"> {/* Adjusted spacing to 12px */}
        {recentActivities.map((activity, i) => (
          <div key={i} className="space-y-1">
            <div className={`flex items-center gap-4 p-5 rounded-xl ${
                  i === 0
                    ? "bg-blue-100/25"
                    : i === 1
                    ? "bg-pink-100/25"
                    : "bg-green-100/25"
                }`}>
              {/* Circular container for the icon */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  i === 0
                    ? "bg-blue-700/25"
                    : i === 1
                    ? "bg-pink-700/25"
                    : "bg-green-700/25"
                }`}
              >
                <activity.icon
                  size={20}
                  className={
                    i === 0
                      ? "text-blue-700"
                      : i === 1
                      ? "text-pink-700"
                      : "text-green-700"
                  }
                />
              </div>
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between w-full">
                  {/* Description with medium font size and 900 weight */}
                  <p
                    className={
                      i === 0
                        ? "text-sm font-semibold text-blue-900"
                        : i === 1
                        ? "text-sm font-semibold text-pink-900"
                        : "text-sm font-semibold text-green-900"
                    }
                  >
                    {activity.description}
                  </p>
                  {/* Time with medium font size and 700 weight */}
                  <p
                    className={
                      i === 0
                        ? "text-sm font-normal text-blue-700"
                        : i === 1
                        ? "text-sm font-normal text-pink-700"
                        : "text-sm font-normal text-green-700"
                    }
                  >
                    {activity.time}
                  </p>
                </div>
                {/* Progress bar with 700 for value and 100 for remaining */}
                <div className={`w-full h-2 rounded-full ${
                  i === 0
                    ? "bg-blue-200"
                    : i === 1
                    ? "bg-pink-200"
                    : "bg-green-200" // Changed to a lighter shade for better contrast
                }`}>
                  <div
                    className={`h-full rounded-full ${
                      i === 0
                        ? "bg-blue-700"
                        : i === 1
                        ? "bg-pink-700"
                        : "bg-green-700"
                    }`}
                    style={{
                      width: `${(activity.progress / activity.maxProgress) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  
    {/* Pending Tasks Section */}
    <div className="flex-1 p-6 bg-white shadow-md rounded-xl">
      <h2 className="mb-4 text-lg font-bold text-gray-800">Pending Tasks</h2>
      <div className="space-y-4">
        {[
          { task: 'Create Report', count: 5 },
          { task: 'Add User', count: 2 },
          { task: 'Update Profile', count: 3 },
          { task: 'View Analytics', count: 1 },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            {/* Task Name */}
            <p className="text-lg font-semibold text-gray-700">{item.task}</p>
            {/* Number of Tasks Left */}
            <p className="text-lg font-semibold text-gray-800">{item.count}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
   )}
   <div className="grid grid-cols-1 gap-6 mt-8 mb-8 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 bg-white shadow-md rounded-xl">
          <div className="flex items-center justify-between mb-4">
            {/* Left Content */}
            <div>
              <h2 className="text-sm font-medium text-gray-800">Statistics</h2>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
            {/* Image on the Right */}
            <img
              src="/path/to/your/chart/image.svg"
              alt="Income Chart"
              className="w-16 h-8"
            />
          </div>
          {/* Statistic Value */}
          <h2 className="text-2xl font-bold text-gray-800">{stat.value}</h2>
          {/* Change Indicator */}
          <span
            className={`text-sm font-medium ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {stat.change}
          </span>
        </div>
        
        ))}
      </div>
      <h1 className='text-xl font-bold'>Activity</h1>
         <IncomeTable />
         </div>
  )
}
