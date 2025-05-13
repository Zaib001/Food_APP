import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Ingredients Used',
      data: [120, 135, 150, 170, 160],
      borderColor: '#f87171',
      fill: false,
    },
    {
      label: 'Requisitions',
      data: [45, 50, 48, 60, 52],
      borderColor: '#60a5fa',
      fill: false,
    },
    {
      label: 'Menus Created',
      data: [30, 32, 34, 38, 40],
      borderColor: '#34d399',
      fill: false,
    },
    {
      label: 'Budget Used %',
      data: [55, 62, 70, 74, 76],
      borderColor: '#fbbf24',
      fill: false,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default function LineChart() {
  return <Line data={data} options={options} />;
}
