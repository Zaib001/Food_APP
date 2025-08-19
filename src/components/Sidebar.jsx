import React, { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaHome, FaCarrot, FaBook, FaCalendarAlt, FaClipboardList,
  FaBoxes, FaCogs, FaChartBar, FaSignOutAlt, FaUsers, FaChevronLeft
} from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';

function Item({ to, icon, label, collapsed, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === '/dashboard'}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
        ${isActive ? 'bg-red-100 text-red-700' : 'text-gray-700 hover:bg-gray-100'}`
      }
      title={collapsed ? label : undefined}
    >
      <span className="text-lg shrink-0">{icon}</span>
      {!collapsed && <span className="text-sm font-medium truncate">{label}</span>}
    </NavLink>
  );
}

function Section({ title, children, collapsed }) {
  return (
    <div className="mt-4">
      {!collapsed && (
        <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </div>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose, onToggle }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  }, []);
  const role = user?.role || 'user';
  // Base (everyone)
  const generalLinks = [
    { to: '/dashboard', label: t('sidebar.dashboard') || 'Dashboard', icon: <FaHome /> },
  ];

  const operationsLinks = [
    { to: '/dashboard/ingredients', label: t('sidebar.ingredients') || 'Ingredients', icon: <FaCarrot /> },
    { to: '/dashboard/recipes',     label: t('sidebar.recipes') || 'Recipes',         icon: <FaBook /> },
    { to: '/dashboard/menus',       label: t('sidebar.menus') || 'Menus',             icon: <FaCalendarAlt /> },
    { to: '/dashboard/planning',    label: t('sidebar.planning') || 'Planning',       icon: <FaClipboardList /> },
    { to: '/dashboard/requisitions',label: t('sidebar.requisitions') || 'Requisitions', icon: <FaClipboardList /> },
    { to: '/dashboard/inventory',   label: t('sidebar.inventory') || 'Inventory',     icon: <FaBoxes /> },
    { to: '/dashboard/production',  label: t('sidebar.production') || 'Production',   icon: <FaCogs /> },
  ];

  const reportsLinks = [
    { to: '/dashboard/reports', label: t('sidebar.reports') || 'Reports', icon: <FaChartBar /> },
  ];

  // Admin extras
  const adminLinks = [
    { to: '/dashboard/users', label: 'Manage Users', icon: <FaUsers /> },
    { to: '/dashboard/stats', label: 'Admin Stats',  icon: <FaChartBar /> },
  ];

  const allLinks = useMemo(() => {
    // Merge user + admin sections for admins
    return role === 'admin'
      ? { general: generalLinks, operations: operationsLinks, reports: reportsLinks, admin: adminLinks }
      : { general: generalLinks, operations: operationsLinks, reports: reportsLinks, admin: [] };
  }, [role]);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-[60] bg-white p-2 rounded shadow-md md:hidden text-xl text-gray-800"
        aria-label="Toggle sidebar"
      >
        <HiMenu />
      </button>

      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 bg-white/90 backdrop-blur
          border-r border-gray-200 shadow-sm
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${collapsed ? 'w-18 md:w-18' : 'w-64 md:w-64'}
        `}
      >
        {/* Header */}
        <div className="relative h-16 flex items-center justify-between px-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-rose-400" />
            {!collapsed && (
              <div className="leading-tight">
                <div className="text-sm font-bold text-gray-900">Food Ops Suite</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-md border text-gray-600 hover:bg-gray-100"
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              <FaChevronLeft className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
            <button className="md:hidden text-2xl px-1" onClick={onClose} aria-label="Close sidebar">×</button>
          </div>
        </div>

        {/* User mini-card */}
        <div className="mx-3 mb-2 rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
              {(user?.name || 'U').slice(0,1).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{user?.name || 'User'}</div>
                <div className="text-xs text-gray-500 truncate">{role}</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="px-2 pb-24 overflow-y-auto h-[calc(100vh-8rem)]">
          <Section title="General" collapsed={collapsed}>
            {allLinks.general.map(l => (
              <Item key={l.to} {...l} collapsed={collapsed} onClick={onClose} />
            ))}
          </Section>

          <Section title="Operations" collapsed={collapsed}>
            {allLinks.operations.map(l => (
              <Item key={l.to} {...l} collapsed={collapsed} onClick={onClose} />
            ))}
          </Section>

          <Section title="Reports" collapsed={collapsed}>
            {allLinks.reports.map(l => (
              <Item key={l.to} {...l} collapsed={collapsed} onClick={onClose} />
            ))}
          </Section>

          {allLinks.admin.length > 0 && (
            <Section title="Admin" collapsed={collapsed}>
              {allLinks.admin.map(l => (
                <Item key={l.to} {...l} collapsed={collapsed} onClick={onClose} />
              ))}
            </Section>
          )}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200">
          <div className="p-3">
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/');
              }}
              className="w-full flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
              title="Log out"
            >
              <FaSignOutAlt />
              {!collapsed && (t('logout') || 'Logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
