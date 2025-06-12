import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const fetchReportSummary = async (params) => {
  return await axios.get(`${API_URL}/reports`, {
    headers: headers(),
    params,
  });
};

export const exportReportsToCSV = async (reports) => {
  const res = await axios.post(`${API_URL}/reports/export`, { reports }, {
    headers: {
      ...headers(),
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });

  const blob = new Blob([res.data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'report_summary.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
};
