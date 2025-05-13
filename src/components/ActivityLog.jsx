import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaCheckCircle,
    FaExclamationTriangle,
  } from 'react-icons/fa';
  
  const logs = [
    { icon: FaPlus, message: 'New ingredient added: Tomato', color: 'text-green-600' },
    { icon: FaEdit, message: 'Recipe "Omelette" updated', color: 'text-blue-500' },
    { icon: FaTrash, message: 'Deleted recipe: "Old Soup"', color: 'text-red-500' },
    { icon: FaCheckCircle, message: 'Inventory check completed', color: 'text-emerald-500' },
    { icon: FaExclamationTriangle, message: 'Low stock alert: Milk', color: 'text-yellow-500' },
  ];
  
  export default function ActivityLog() {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <ul className="space-y-3 text-sm">
          {logs.map(({ icon: Icon, message, color }, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <Icon className={`mt-1 text-md ${color}`} />
              <span>{message}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  