import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [stats, setStats] = useState({
    activeStudents: 0,
    activeTeachers: 0,
    reportsGenerated: 0,
    pendingApprovals: 0,
    monthlyStats: [],
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const labels = stats.monthlyStats?.map((entry) => entry.month) || [];

  const userStatsData = {
    labels,
    datasets: [
      {
        label: 'Reports Generated',
        data: stats.monthlyStats?.map((entry) => entry.total) || [],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Pending Approvals',
        data: stats.monthlyStats?.map((entry) => entry.pending) || [],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Monthly Report & Approval Trends',
        font: { size: 18, weight: 'bold' },
        color: '#1f2937',
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Month' },
        ticks: { font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Reports' },
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-sky-50 to-blue-100 animate-fade-in">
      {/* Header */}
      <header className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-indigo-700 tracking-tight drop-shadow-md">
          🧑‍💼 Admin Dashboard
        </h2>
        <p className="text-gray-600 text-lg mt-2">System insights and real-time reporting overview</p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="👨‍🎓 Active Students" value={stats.activeStudents} bg="bg-green-100" text="text-green-700" />
        <StatCard title="📄 Reports Generated" value={stats.reportsGenerated} bg="bg-blue-100" text="text-blue-700" />
        <StatCard title="👩‍🏫 Active Teachers" value={stats.activeTeachers} bg="bg-yellow-100" text="text-yellow-700" />
        <StatCard title="🕒 Pending Approvals" value={stats.pendingApprovals} bg="bg-red-100" text="text-red-700" />
      </section>

      {/* Chart Section */}
      <section className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out" style={{ height: '440px' }}>
        <h3 className="text-2xl font-semibold text-indigo-800 mb-4">📈 Report Trends (Real-Time)</h3>
        <Line data={userStatsData} options={options} />
      </section>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, bg, text }) => (
  <div
    className={`rounded-xl p-6 shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 ${bg} ${text}`}
  >
    <h3 className="text-md font-semibold">{title}</h3>
    <p className="text-4xl font-bold mt-2">{value}</p>
  </div>
);

export default DashboardPage;
