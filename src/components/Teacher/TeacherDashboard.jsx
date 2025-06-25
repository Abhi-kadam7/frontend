import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const funnyMessages = [
      "Logging out? The chalk misses you already! 🧑‍🏫",
      "Time to close the gradebook? 📚",
      "Students will behave... maybe. 👀",
      "Signing off, professor of productivity! 🧠",
      "Hope those reports grade themselves. 😅"
    ];
    const msg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    const isConfirmed = window.confirm(msg);

    if (isConfirmed) {
      localStorage.removeItem('token');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-6">Teacher Panel</h2>

        <nav className="flex-grow">
          <ul className="space-y-4">
            <li>
              <Link
                to="/teacher/dashboard"
                className="block px-2 py-1 rounded hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/teacher/projects"
                className="block px-2 py-1 rounded hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Manage Reports
              </Link>
            </li>
          </ul>
        </nav>

        <button
          className="mt-auto bg-red-500 hover:bg-red-700 py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherDashboard;
