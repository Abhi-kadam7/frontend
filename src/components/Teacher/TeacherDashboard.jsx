import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaChalkboardTeacher,
  FaFileAlt,
  FaTachometerAlt,
  FaSignOutAlt
} from 'react-icons/fa';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    const funnyMessages = [
      "Logging out? The chalk misses you already! 🧑‍🏫",
      "Time to close the gradebook? 📚",
      "Students will behave... maybe. 👀",
      "Signing off, professor of productivity! 🧠",
      "Hope those reports grade themselves. 😅"
    ];
    const msg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

    if (window.confirm(msg)) {
      localStorage.removeItem('token');
      navigate('/', { replace: true });
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gray-100 relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 lg:static top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-900 to-indigo-700 text-white p-6 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Teacher Panel</h2>
          <button className="text-white lg:hidden" onClick={toggleSidebar}>
            <FaTimes size={22} />
          </button>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-4">
            <li>
              <Link
                to="/teacher/dashboard"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/teacher/dashboard')
                    ? 'bg-indigo-600 text-white shadow'
                    : 'hover:bg-indigo-600 hover:shadow-md'
                }`}
              >
                <FaTachometerAlt />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/teacher/projects"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/teacher/projects')
                    ? 'bg-indigo-600 text-white shadow'
                    : 'hover:bg-indigo-600 hover:shadow-md'
                }`}
              >
                <FaFileAlt />
                <span>Manage Reports</span>
              </Link>
            </li>
          </ul>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 shadow"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow h-full">
        {/* Mobile topbar */}
        <header className="flex items-center justify-between px-4 py-3 bg-white shadow lg:hidden sticky top-0 z-20">
          <button onClick={toggleSidebar} className="text-gray-800">
            <FaBars size={22} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Teacher Dashboard</h1>
          <div />
        </header>

        {/* Page content */}
        <main className="flex-grow overflow-y-auto p-4 lg:p-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
