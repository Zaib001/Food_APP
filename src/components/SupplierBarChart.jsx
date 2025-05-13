import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SupplierBarChart({ data }) {
  const grouped = data.reduce((acc, r) => {
    acc[r.supplier] = (acc[r.supplier] || 0) + Number(r.quantity);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(grouped),
    datasets: [
      {
        label: 'Quantity',
        data: Object.values(grouped),
        backgroundColor: '#f87171',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  return (
    <div className="bg-white shadow p-6 mt-6 rounded-xl">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Quantity by Supplier</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
