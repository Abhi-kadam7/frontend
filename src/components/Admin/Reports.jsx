import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [originalReports, setOriginalReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${API_BASE}/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(response.data);
        setOriginalReports(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  const handleSearch = () => {
    const filtered = originalReports.filter((report) =>
      report.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setReports(filtered);
  };

  const handleReset = () => {
    setReports(originalReports);
    setSearchTerm('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await axios.delete(`${API_BASE}/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports((prev) => prev.filter((r) => r._id !== id));
      } catch (err) {
        alert('Error deleting report');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_BASE}/reports/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, isApproved: true, rejected: false } : r
        )
      );
    } catch (err) {
      alert('Error approving report');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter reason for rejection:');
    if (!reason) return;

    try {
      await axios.put(
        `${API_BASE}/reports/${id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports((prev) =>
        prev.map((r) =>
          r._id === id
            ? { ...r, isApproved: false, rejected: true, rejectionReason: reason }
            : r
        )
      );
    } catch (err) {
      alert('Error rejecting report');
    }
  };

  const handleGenerateCertificate = async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE}/reports/${id}/certificate`,
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
    <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="text-3xl font-bold mb-4">Admin - Manage Reports</h2>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md flex-grow mr-2"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Search
        </button>
        <button onClick={handleReset} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2">
          Reset
        </button>
      </div>

      {loading ? (
        <motion.p className="text-center text-blue-500 font-semibold">Loading reports...</motion.p>
      ) : error ? (
        <motion.p className="text-center text-red-500 font-semibold">{error}</motion.p>
      ) : (
        <motion.div className="mt-4">
          {reports.length > 0 ? (
            <table className="w-full bg-white rounded shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4">Student</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{report.projectTitle}</td>
                    <td className="py-2 px-4">{report.studentName}</td>
                    <td className="py-2 px-4">{new Date(report.submissionDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4">
                      {report.isApproved ? (
                        <span className="text-green-600 font-semibold">Approved</span>
                      ) : report.rejected ? (
                        <span className="text-red-600 font-semibold">Rejected</span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">Pending</span>
                      )}
                    </td>
                    <td className="py-2 px-4 space-x-2">
                      <a
                        href={`${API_BASE}/reports/${report._id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700"
                      >
                        View
                      </a>

                      {!report.isApproved && !report.rejected && (
                        <>
                          <button
                            onClick={() => handleApprove(report._id)}
                            className="bg-green-600 text-white py-1 px-2 rounded hover:bg-green-800"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(report._id)}
                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {report.isApproved && !report.certificateGenerated && (
                        <button
                          onClick={() => handleGenerateCertificate(report._id)}
                          className="bg-indigo-500 text-white py-1 px-2 rounded hover:bg-indigo-700"
                        >
                          Generate Certificate
                        </button>
                      )}

                      {report.certificateGenerated && (
                        <span className="text-green-600 font-semibold">Certificate Sent</span>
                      )}

                      <button
                        onClick={() => handleDelete(report._id)}
                        className="bg-gray-600 text-white py-1 px-2 rounded hover:bg-gray-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No reports found.</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Reports;
