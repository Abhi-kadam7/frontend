import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TeacherDashboardPage = () => {
  const [submittedReports, setSubmittedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/teacher/reports`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubmittedReports(response.data);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setError('❌ Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const approvedReports = submittedReports.filter(report => report.isApproved).length;
  const pendingReports = submittedReports.filter(report => !report.isApproved).length;

  const data = {
    labels: ['Approved', 'Pending'],
    datasets: [
      {
        label: 'Reports Status',
        data: [approvedReports, pendingReports],
        backgroundColor: ['#4CAF50', '#FF5722'],
        borderColor: ['#388E3C', '#F44336'],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 14, weight: 'bold' } },
      },
      title: {
        display: true,
        text: 'Approval Status Overview',
        font: { size: 18 },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="p-8 bg-gradient-to-br from-yellow-50 to-white min-h-screen">
      {/* Header */}
      <header className="mb-10 text-center animate-fade-in-down">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">📘 Teacher Dashboard</h2>
        <p className="text-gray-600 text-lg">Monitor and manage submitted project reports.</p>
      </header>

      {loading ? (
        <p className="text-center text-lg font-semibold text-gray-700 animate-pulse">Loading reports...</p>
      ) : error ? (
        <p className="text-red-500 text-center font-medium">{error}</p>
      ) : (
        <>
          {/* Stat Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 animate-fade-in">
            <Card title="📂 Total Reports" value={submittedReports.length} bg="bg-blue-100" />
            <Card title="✅ Approved" value={approvedReports} bg="bg-green-100" />
            <Card title="⏳ Pending" value={pendingReports} bg="bg-red-100" />
          </section>

          {/* Chart & Recent List */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
            {/* Bar Chart */}
            <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-bold mb-4 text-gray-700">📊 Reports Overview</h3>
              <Bar data={data} options={options} />
            </div>

            {/* Recent Submissions */}
            <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-bold mb-4 text-gray-700">🕓 Recent Submissions</h3>
              <ul className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {submittedReports.map((report, index) => (
                  <li key={index} className="border-b pb-2 text-sm">
                    <span className="font-semibold text-indigo-700">{report.studentName}</span> —{' '}
                    <span className="text-gray-800 italic">{report.projectTitle}</span> —{' '}
                    <span
                      className={`font-bold ${
                        report.isApproved ? 'text-green-600' : 'text-yellow-600'
                      }`}
                    >
                      {report.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

// Reusable Stat Card Component
const Card = ({ title, value, bg }) => (
  <div
    className={`${bg} p-6 rounded-2xl shadow-md text-center transform transition duration-300 hover:scale-105 hover:shadow-xl`}
  >
    <h4 className="text-xl font-semibold text-gray-700">{title}</h4>
    <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
  </div>
);

export default TeacherDashboardPage;
