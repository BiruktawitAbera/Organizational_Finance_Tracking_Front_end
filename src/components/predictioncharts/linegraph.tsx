import React from 'react';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
    label: 'Data',
    data: [10, 15, 20, 18, 25, 30, 28, 35, 32, 40, 38, 45], // Replace with your actual data
    borderColor: '#00bfff', // Set the line color
    borderWidth: 2,
    fill: false, // Disable area fill
  }]
};

const options = {
  plugins: {
    legend: {
      display: false, // Hide the legend
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // Hide x-axis grid lines
      },
    },
    y: {
      grid: {
        display: false, // Hide y-axis grid lines
      },
      min: 0, // Set minimum y-axis value to 0
      max: 50, // Set maximum y-axis value to 50 (adjust as needed)
    },
  },
};

const MyLineChart = () => {
  return <Line data={data} options={options} />;
};

export default MyLineChart;