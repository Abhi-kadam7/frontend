import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaTachometerAlt, FaUsersCog, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    const funnyMessages = [
      "Are you sure you want to abandon your admin powers? 🦸‍♂️",
      "Logging out? But we were just getting started! 😢",
      "Wait! Don’t leave me alone with the bugs! 🐛",
      "Goodbye, mighty admin. The system shall miss your rule. 👑",
      "Don't go! The users are behaving... for now. 😬",
    ];
    const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    const isConfirmed = window.confirm(randomMessage);

    if (isConfirmed) {
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
    <div className="flex h-screen overflow-hidden font-sans bg-gray-100 relative">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 lg:static top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-700 text-white p-6 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Admin Panel</h2>
          <button className="text-white lg:hidden" onClick={toggleSidebar}>
            <FaTimes size={22} />
          </button>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-4">
            {navItems.map(({ to, label, icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(to)
                      ? 'bg-indigo-600 text-white shadow'
                      : 'hover:bg-gray-600 hover:shadow-md'
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="font-medium">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="mt-10 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 shadow"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow h-full">
        {/* Top Bar (mobile toggle) */}
        <header className="flex items-center justify-between px-4 py-3 bg-white shadow lg:hidden sticky top-0 z-20">
          <button onClick={toggleSidebar} className="text-gray-800">
            <FaBars size={22} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <div></div>
        </header>

        {/* Page Content */}
        <main className="flex-grow overflow-y-auto p-4 lg:p-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
