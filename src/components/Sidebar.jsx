import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaHome, FaCarrot, FaBook, FaCalendarAlt, FaClipboardList,
  FaBoxes, FaCogs, FaChartBar, FaSignOutAlt, FaUsers
} from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';

export default function Sidebar({ isOpen, onClose, onToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  // User-only links
  const userLinks = [
    { to: '/dashboard', label: t('sidebar.dashboard'), icon: <FaHome /> },
    { to: '/dashboard/ingredients', label: t('sidebar.ingredients'), icon: <FaCarrot /> },
    { to: '/dashboard/recipes', label: t('sidebar.recipes'), icon: <FaBook /> },
    { to: '/dashboard/menus', label: t('sidebar.menus'), icon: <FaCalendarAlt /> },
    { to: '/dashboard/planning', label: t('sidebar.planning'), icon: <FaClipboardList /> },
    { to: '/dashboard/requisitions', label: t('sidebar.requisitions'), icon: <FaClipboardList /> },
    { to: '/dashboard/inventory', label: t('sidebar.inventory'), icon: <FaBoxes /> },
    { to: '/dashboard/production', label: t('sidebar.production'), icon: <FaCogs /> },
    { to: '/dashboard/reports', label: t('sidebar.reports'), icon: <FaChartBar /> },
  ];

  // Admin-only links
  const adminLinks = [
    { to: '/dashboard', label: t('sidebar.dashboard'), icon: <FaHome /> },
    { to: '/dashboard/users', label: 'Manage Users', icon: <FaUsers /> },
  ];

  // Only show admin links if admin, otherwise user links
  const linksToShow = role === 'admin' ? adminLinks : userLinks;

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 bg-white p-2 rounded shadow-md md:hidden text-xl text-gray-800"
      >
        <HiMenu />
      </button>

      <aside
        className={`fixed top-0 left-0 max-h-full w-64 bg-white shadow-xl rounded-r-xl z-40 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:rounded-none md:shadow-none`}
      >
        <div className="p-4 text-lg font-bold border-b flex justify-between items-center">
          LOGO
          <button className="md:hidden text-xl" onClick={onClose}>×</button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {linksToShow.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/dashboard'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-6 py-4 rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-red-100 text-red-600 font-semibold shadow-inner'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-red-500'
                    }`
                  }
                >
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="border-t my-6" />

          <div className="flex justify-center">
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/');
              }}
              className="flex items-center gap-2 text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
            >
              <FaSignOutAlt />
              {t('logout')}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
