import React from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, DoughnutController, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, DoughnutController, ArcElement);

const lineOptions = {
  maintainAspectRatio: false, // Ensure the chart doesn't grow beyond its container
  scales: {
    x: {
      display: true, // Hide X axis
    },
    y: {
      display: true, // Hide Y axis
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

const doughnutOptions = {
  maintainAspectRatio: false, // Ensure the chart doesn't grow beyond its container
  plugins: {
    legend: {
      display: false, // Hide legend
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

const doughnutData = {
  labels: ['Segment 1', 'Segment 2', 'Segment 3'],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ['#1E90FF', '#4682B4', '#5F9EA0'],
      hoverBackgroundColor: ['#1E90FF', '#4682B4', '#5F9EA0'],
    },
  ],
};
function PredectionSection() {
  return (
    <div className='ml-2'>
      <section className="bg-white shadow-lg p-6 m-2 flex flex-col rounded-lg ml-64 mr-8" style={{ borderRadius: '20px', height: '300px' }}>
        <div className="w-full flex justify-between">
          <div className="w-1/2 flex flex-col items-center">
            
            <div className="flex items-center justify-center w-full" style={{ height: '200px' }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
          <div className="w-1/2 flex flex-col items-center">
            <div className="flex items-center justify-center w-full" style={{ height: '200px' }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>
        <div className="flex justify-evenly mt-4">
            <div className='flex justify-between gap-'>
          <p className="text-lg font-bold">Prediction for the next month</p><p className="text-lg"><strong>Status: <span className="text-green-500">Good</span></strong></p></div><p className="text-lg font-bold"> Budget Allocation</p>
        </div>  </section></div>
  )
}

export default PredectionSection