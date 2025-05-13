import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart() {
  const data = {
    labels: ['Vegetables', 'Proteins', 'Grains', 'Dairy', 'Other'],
    datasets: [
      {
        label: 'Category %',
        data: [35, 25, 20, 10, 10],
        backgroundColor: [
          '#34d399',
          '#60a5fa',
          '#fbbf24',
          '#f472b6',
          '#9ca3af',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">
        Ingredient Category Share
      </h2>
      <Doughnut data={data} />
    </div>
  );
}
