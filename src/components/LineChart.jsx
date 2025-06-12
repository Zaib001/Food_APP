import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function LineChart({ data = [] }) {
  const chartData = {
    labels: data.map(d => d._id),
    datasets: [
      {
        label: 'Total Cost',
        data: data.map(d => d.totalCost),
        borderColor: '#FF6384',
        fill: false,
      },
      {
        label: 'Total Produced',
        data: data.map(d => d.totalProduced),
        borderColor: '#36A2EB',
        fill: false,
      },
    ],
  };

  return <Line data={chartData} options={{ responsive: true }} />;
}
