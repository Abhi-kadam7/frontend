import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();


  // Handle logout 
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


  // Utility to check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-700 text-white p-6 flex flex-col shadow-lg">
        <h2 className="text-3xl font-extrabold mb-8 tracking-tight text-center">Admin Panel</h2>
        
        <nav className="flex-grow">
          <ul className="space-y-4">
            {[
              { to: '/admin/dashboard', label: 'Dashboard' },
              { to: '/admin/user-management', label: 'Manage Users' },
              { to: '/admin/reports', label: 'Reports' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(to)
                      ? 'bg-indigo-600 text-white shadow'
                      : 'hover:bg-gray-600 hover:shadow-md'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="mt-10 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 shadow"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 bg-gray-100 overflow-y-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
