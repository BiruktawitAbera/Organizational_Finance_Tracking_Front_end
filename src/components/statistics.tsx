// Install required dependencies first

import React from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, DoughnutController, ArcElement } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, DoughnutController, ArcElement);

const lineOptions = {
  scales: {
    x: {
      display: false, // Hide X axis
    },
    y: {
      display: false, // Hide Y axis
    },
  },
  plugins: {
    legend: {
      display: false, // Hide legend
    },
  },
  elements: {
    line: {
      tension: 0.4, // Smooth the line
    },
  },
};

const lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    {
      data: [12, 19, 3, 5],
      borderColor: '#2D5BFF',
      fill: false,
      pointRadius: 0, // Remove points
    },
  ],
};

const StatCard = ({ title, number, change, changeColor, data }) => (
  <div className="bg-white shadow-lg p-6 m-2 flex justify-between rounded-lg" style={{ borderRadius: '20px', height: '225.22px', width: '332px' }}>
    <div className="flex flex-col justify-center items-center w-1/2">
      <span className="text-gray-500 text-xs mb-1">Statistics</span>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-2xl font-bold">{number}</p>
      <p className={`text-sm ${changeColor} mt-1`}>{change}</p>
    </div>
    <div className="flex items-center justify-center w-1/2" style={{ height: '100%' }}>
      <Line data={data} options={lineOptions} />
    </div>
  </div>
);
const App = () => (
  <div className="ml-64 mr-8">
    <div className="flex justify-between">
      <StatCard title="Income" number="678" change="+21.01%" changeColor="text-green-500" data={lineData} />
      <StatCard title="Total Profit" number="2888" change="+21.01%" changeColor="text-green-500" data={lineData} />
      <StatCard title="Expenses" number="215" change="-7.69%" changeColor="text-red-500" data={lineData} />
    </div>
  </div>
);

export default App;
