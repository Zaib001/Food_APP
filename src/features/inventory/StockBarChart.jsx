// src/components/StockBarChart.jsx
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';


export default function StockBarChart({ data = [] }) {
  const labels = useMemo(() => data.map(d => d.ingredientName || d.item || '—'), [data]);
  const quantities = useMemo(() => data.map(d => Number(d.quantity || 0)), [data]);

  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Quantity',
        data: quantities,
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  }), [labels, quantities]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        display: false // Hide legend for single dataset
      },
      title: { 
        display: true,
        text: 'Inventory Stock Levels',
        font: { size: 16 }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ingredients'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity'
        },
        ticks: {
          precision: 0,
          stepSize: 1
        }
      },
    },
  }), []);

  return (
    <div style={{ height: '400px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}