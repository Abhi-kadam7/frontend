import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUsersCog,
  FaFileAlt,
  FaSignOutAlt,
} from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    const messages = [
      'Are you sure you want to abandon your admin powers? 🦸‍♂️',
      'Logging out? But we were just getting started! 😢',
      'Wait! Don’t leave me alone with the bugs! 🐛',
      'Goodbye, mighty admin. The system shall miss your rule. 👑',
    ];
    if (window.confirm(messages[Math.floor(Math.random() * messages.length)])) {
      localStorage.removeItem('token');
      navigate('/', { replace: true });
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/admin/user-management', label: 'Manage Users', icon: <FaUsersCog /> },
    { to: '/admin/reports', label: 'Reports', icon: <FaFileAlt /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Overlay on Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-gradient-to-b from-gray-900 to-gray-700 text-white transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
            <button className="lg:hidden" onClick={toggleSidebar}>
              <FaTimes />
            </button>
          </div>

          <nav className="flex-grow space-y-3">
            {navItems.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                  isActive(to)
                    ? 'bg-indigo-600 text-white shadow'
                    : 'hover:bg-gray-600'
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar for mobile */}
        <header className="lg:hidden bg-white shadow px-4 py-3 flex justify-between items-center sticky top-0 z-20">
          <button onClick={toggleSidebar}>
            <FaBars size={22} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Admin Dashboard</h1>
          <div></div>
        </header>

        {/* Main Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
