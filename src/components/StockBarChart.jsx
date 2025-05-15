import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function StockBarChart({ data }) {
  const grouped = data.reduce((acc, item) => {
    acc[item.ingredientName] = (acc[item.ingredientName] || 0) + Number(item.quantity);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(grouped),
    datasets: [
      {
        label: 'Stock Quantity',
        data: Object.values(grouped),
        backgroundColor: '#f87171',
      },
    ],
  };

  return (
    <div className="bg-white mt-6 p-4 rounded-xl shadow">
      <h3 className="text-md font-semibold mb-2 text-gray-700">📊 Stock by Ingredient</h3>
      <Bar data={chartData} />
    </div>
  );
}
