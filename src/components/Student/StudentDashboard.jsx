import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const studentName = localStorage.getItem('studentName') || 'Student';

  const handleLogout = () => {
    const funnyMessages = [
      "Logging out already? The code will miss you! 👋",
      "Leaving so soon, scholar? 🧠",
      "Bye for now! Don’t forget to submit your report! 📝",
      "Student powers deactivated. 💤",
      "Don't worry, your report is safe! 😌"
    ];
    const message = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

    const isConfirmed = window.confirm(message);
    if (isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('studentName');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-indigo-700 text-white p-6 flex flex-col shadow-lg">
        <h2 className="text-3xl font-extrabold mb-6 text-center tracking-tight">Student Panel</h2>

        {/* Welcome Badge */}
        <p className="bg-white text-indigo-700 font-semibold py-2 px-4 rounded-full shadow text-center mb-6">
          👋 Welcome, {studentName}
        </p>

        {/* Navigation */}
        <nav className="flex-grow">
          <ul className="space-y-4">
            <li>
              <Link
                to="/student/dashboard"
                className="block px-4 py-2 rounded-lg transition-all duration-200 hover:bg-indigo-600 hover:shadow-md"
              >
                📋 Dashboard
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          className="mt-8 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 shadow"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 bg-gradient-to-br from-indigo-100 via-white to-blue-100 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-6 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
