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
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard/stats`);
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 13 },
          color: '#1e293b',
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#f8fafc',
        titleColor: '#111827',
        bodyColor: '#1f2937',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        displayColors: true,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          color: '#e5e7eb',
          borderDash: [4, 4],
        },
        ticks: {
          font: { size: 12 },
          color: '#4b5563',
        },
        title: {
          display: true,
          text: 'Month',
          font: { size: 14, weight: '600' },
          color: '#374151',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
          borderDash: [4, 4],
        },
        ticks: {
          stepSize: 1,
          font: { size: 12 },
          color: '#4b5563',
        },
        title: {
          display: true,
          text: 'Reports Count',
          font: { size: 14, weight: '600' },
          color: '#374151',
        },
      },
    },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-sky-50 to-blue-100 animate-fade-in">
      {/* Header */}
      <header className="mb-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 tracking-tight drop-shadow-md">
          🧑‍💼 Admin Dashboard
        </h2>
        <p className="text-gray-600 text-sm sm:text-lg mt-2">Real-time system insights</p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="👨‍🎓 Active Students" value={stats.activeStudents} bg="bg-green-100" text="text-green-700" />
        <StatCard title="📄 Reports Generated" value={stats.reportsGenerated} bg="bg-blue-100" text="text-blue-700" />
        <StatCard title="👩‍🏫 Active Teachers" value={stats.activeTeachers} bg="bg-yellow-100" text="text-yellow-700" />
        <StatCard title="🕒 Pending Approvals" value={stats.pendingApprovals} bg="bg-red-100" text="text-red-700" />
      </section>

      {/* Chart */}
      <section className="bg-white/90 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-xl transition-all duration-300 ease-in-out">
        <h3 className="text-lg sm:text-xl font-semibold text-indigo-800 mb-4 text-center">
          📈 Monthly Report & Approval Trends
        </h3>
        <div className="relative w-full h-[320px] sm:h-[400px] md:h-[450px]">
          <Line data={userStatsData} options={chartOptions} />
        </div>
      </section>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, bg, text }) => (
  <div
    className={`rounded-xl p-5 shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 ${bg} ${text}`}
  >
    <h3 className="text-sm sm:text-md font-semibold">{title}</h3>
    <p className="text-3xl sm:text-4xl font-bold mt-2">{value}</p>
  </div>
);

export default DashboardPage;
