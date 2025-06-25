import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaUserTie, FaFileAlt, FaCheckCircle, FaClock } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TeacherDashboardPage = () => {
  const [teacherName, setTeacherName] = useState('');
  const [submittedReports, setSubmittedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setTeacherName(decoded.name || 'Teacher');
      } catch (err) {
        console.error('Token decode failed:', err);
        setTeacherName('Teacher');
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/teacher/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmittedReports(response.data || []);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('❌ Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const approvedReports = submittedReports.filter((r) => r.isApproved).length;
  const pendingReports = submittedReports.filter((r) => !r.isApproved).length;

  const data = {
    labels: ['Approved', 'Pending'],
    datasets: [
      {
        label: 'Reports',
        data: [approvedReports, pendingReports],
        backgroundColor: ['#4CAF50', '#FFA726'],
        borderColor: ['#2E7D32', '#FB8C00'],
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 13, weight: 'bold' } },
      },
      title: {
        display: true,
        text: 'Project Report Approval Status',
        font: { size: 18, weight: 'bold' },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-2">
            <FaUserTie className="text-indigo-700" />
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 text-base mt-1">Monitor and manage student reports in real-time.</p>
        </div>
        <span className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded-full shadow flex items-center gap-2 text-sm sm:text-base">
          <FaUserTie /> {teacherName}
        </span>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Reports" value={submittedReports.length} icon={<FaFileAlt />} bg="bg-indigo-100" />
        <StatCard title="Approved" value={approvedReports} icon={<FaCheckCircle />} bg="bg-green-100" />
        <StatCard title="Pending" value={pendingReports} icon={<FaClock />} bg="bg-orange-100" />
      </div>

      {/* Chart + Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">📊 Reports Overview</h3>
          <Bar data={data} options={options} />
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">🕒 Recent Submissions</h3>
          <ul className="max-h-72 overflow-y-auto space-y-3 pr-2">
            {submittedReports.slice(0, 10).map((r, i) => (
              <li key={i} className="text-sm sm:text-base text-gray-700 border-b pb-2">
                <strong className="text-indigo-700">{r.studentName}</strong> —{' '}
                <span className="italic">{r.projectTitle}</span>{' '}
                <span className={`ml-2 font-semibold ${r.isApproved ? 'text-green-600' : 'text-orange-600'}`}>
                  {r.isApproved ? 'Approved' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Error & Loading */}
      {loading && <p className="mt-6 text-center text-gray-600 animate-pulse">Loading reports...</p>}
      {error && <p className="mt-6 text-center text-red-500">{error}</p>}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, bg }) => (
  <div className={`p-4 sm:p-6 rounded-xl shadow-md flex items-center justify-between ${bg}`}>
    <div>
      <h4 className="text-sm sm:text-md font-medium text-gray-600">{title}</h4>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
    </div>
    <div className="text-3xl sm:text-4xl text-indigo-700 opacity-80">{icon}</div>
  </div>
);

export default TeacherDashboardPage;
