import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, DoughnutController, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, DoughnutController, ArcElement);

const lineOptions = {
  maintainAspectRatio: false,
  scales: {
    x: {
      display: true,
    },
    y: {
      display: true,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
};

const doughnutOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
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
      pointRadius: 0,
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

function PredictionSection() {
  console.log("Rendering PredictionSection");
  
  return (
    <section className="flex flex-col p-6 m-2 bg-white rounded-lg shadow-lg" style={{ borderRadius: '20px', height: '300px' }}>
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
    </section>
  );
}

export default PredictionSection;