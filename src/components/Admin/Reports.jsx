import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [originalReports, setOriginalReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data);
        setOriginalReports(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [token, BASE_URL]);

  useEffect(() => {
    let filtered = [...originalReports];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.projectTitle.toLowerCase().includes(lower) ||
          r.studentName.toLowerCase().includes(lower)
      );
    }

    if (filter !== 'all') {
      filtered = filtered.filter((r) => {
        if (filter === 'approved') return r.isApproved;
        if (filter === 'rejected') return r.rejected;
        if (filter === 'pending') return !r.isApproved && !r.rejected;
      });
    }

    setReports(filtered);
  }, [searchTerm, filter, originalReports]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await axios.delete(`${BASE_URL}/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOriginalReports((prev) => prev.filter((r) => r._id !== id));
      } catch (err) {
        alert('Error deleting report');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${BASE_URL}/reports/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = originalReports.map((r) =>
        r._id === id ? { ...r, isApproved: true, rejected: false } : r
      );
      setOriginalReports(updated);
    } catch (err) {
      alert('Error approving report');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter reason for rejection:');
    if (!reason) return;

    try {
      await axios.put(
        `${BASE_URL}/reports/${id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = originalReports.map((r) =>
        r._id === id ? { ...r, isApproved: false, rejected: true, rejectionReason: reason } : r
      );
      setOriginalReports(updated);
    } catch (err) {
      alert('Error rejecting report');
    }
  };

  const handleGenerateCertificate = async (id) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/reports/${id}/certificate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Project_Completion_Certificate.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error generating certificate');
    }
  };

  return (
    <motion.div className="p-4 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">📚 Manage Reports</h2>

      {/* 🔍 Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="search"
          placeholder="Search by title or student name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md shadow-sm"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-48 p-2 border border-gray-300 rounded-md"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* 🗂 Table */}
      {loading ? (
        <p className="text-center text-blue-500 font-semibold">Loading reports...</p>
      ) : error ? (
        <p className="text-center text-red-500 font-semibold">{error}</p>
      ) : reports.length === 0 ? (
        <p className="text-center text-gray-500">No reports found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm bg-white border border-gray-200">
            <thead className="bg-indigo-100 text-gray-800">
              <tr>
                <th className="px-3 py-2 text-left whitespace-nowrap">Title</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Student</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Date</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Status</th>
                <th className="px-3 py-2 text-left whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">{r.projectTitle}</td>
                  <td className="px-3 py-2">{r.studentName}</td>
                  <td className="px-3 py-2">{new Date(r.submissionDate).toLocaleDateString()}</td>
                  <td className="px-3 py-2">
                    {r.isApproved ? (
                      <span className="text-green-600 font-semibold">Approved</span>
                    ) : r.rejected ? (
                      <span className="text-red-600 font-semibold">Rejected</span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">Pending</span>
                    )}
                  </td>
                  <td className="px-3 py-2 space-y-1">
                    <div className="flex flex-wrap gap-1">
                      <a
                        href={`${BASE_URL}/reports/${r._id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-table bg-blue-600"
                      >
                        View
                      </a>
                      {!r.isApproved && !r.rejected && (
                        <>
                          <button onClick={() => handleApprove(r._id)} className="btn-table bg-green-600">
                            Approve
                          </button>
                          <button onClick={() => handleReject(r._id)} className="btn-table bg-red-600">
                            Reject
                          </button>
                        </>
                      )}
                      {r.isApproved && !r.certificateGenerated && (
                        <button onClick={() => handleGenerateCertificate(r._id)} className="btn-table bg-purple-600">
                          Certify
                        </button>
                      )}
                      {r.certificateGenerated && (
                        <span className="text-green-600 text-xs">📩 Sent</span>
                      )}
                      <button onClick={() => handleDelete(r._id)} className="btn-table bg-gray-700">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

// Add button styles globally
const style = document.createElement('style');
style.innerHTML = `
  .btn-table {
    color: white;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s;
  }
  .btn-table:hover {
    filter: brightness(90%);
  }
`;
document.head.appendChild(style);

export default Reports;
