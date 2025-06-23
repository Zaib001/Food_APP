import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({ data = [] }) {
  const chartData = {
    labels: data.map(d => d.category),
    datasets: [
      {
        label: 'Ingredient Count',
        data: data.map(d => d.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#9B59B6'],
      },
    ],
  };

  return <Pie data={chartData} options={{ responsive: true }} />;
}
