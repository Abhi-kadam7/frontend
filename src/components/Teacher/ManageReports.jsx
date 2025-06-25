import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageReports = () => {
  const [submittedReports, setSubmittedReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterApproved, setFilterApproved] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API_BASE}/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmittedReports(response.data || []);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('❌ Failed to fetch reports.');
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApproveReport = async (id) => {
    try {
      await axios.put(`${API_BASE}/reports/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Report approved!');
      fetchReports();
    } catch (err) {
      console.error('Approve error:', err);
      setError('❌ Error approving report.');
    }
  };

  const handleRejectReport = async (id) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await axios.put(`${API_BASE}/reports/${id}/reject`, { reason }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('⚠️ Report rejected.');
      fetchReports();
    } catch (err) {
      console.error('Reject error:', err);
      setError('❌ Error rejecting report.');
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Delete this report?')) return;

    try {
      await axios.delete(`${API_BASE}/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('🗑 Report deleted.');
      fetchReports();
    } catch (err) {
      console.error('Delete error:', err);
      setError('❌ Error deleting report.');
    }
  };

  const handleGenerateCertificate = async (id) => {
    try {
      const res = await axios.post(`${API_BASE}/reports/${id}/certificate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Certificate.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert('🎓 Certificate generated!');
      fetchReports();
    } catch (err) {
      console.error('Certificate error:', err);
      setError('❌ Error generating certificate.');
    }
  };

  const filteredReports = submittedReports.filter((report) =>
    (report.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterApproved === null || report.isApproved === filterApproved)
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">📋 Manage Reports</h2>
        <p className="text-gray-600 mt-1">Review, approve, reject or delete student submissions.</p>
      </header>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search by name or title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          onChange={(e) =>
            setFilterApproved(e.target.value === 'all' ? null : e.target.value === 'approved')
          }
          className="w-full sm:w-60 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Reports</option>
          <option value="approved">Approved</option>
          <option value="not-approved">Not Approved</option>
        </select>
      </div>

      {/* Reports */}
      {filteredReports.length > 0 ? (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-6">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className="border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <p className="font-bold text-indigo-700">{report.studentName}</p>
                <p className="text-sm text-gray-700">{report.projectTitle}</p>
                <p className="text-xs text-gray-500">{new Date(report.submissionDate).toLocaleDateString()}</p>
                <p
                  className={`text-sm font-semibold mt-1 ${
                    report.isApproved
                      ? 'text-green-600'
                      : report.rejected
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {report.isApproved
                    ? '✅ Approved'
                    : report.rejected
                    ? `❌ Rejected: ${report.rejectionReason}`
                    : '⏳ Pending'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:justify-end">
                <a
                  href={`${API_BASE}/reports/${report._id}/pdf`}
                  target="_blank"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded"
                >
                  View
                </a>

                {!report.isApproved && !report.rejected && (
                  <>
                    <button
                      onClick={() => handleApproveReport(report._id)}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectReport(report._id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}

                {report.isApproved && !report.certificateGenerated && (
                  <button
                    onClick={() => handleGenerateCertificate(report._id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded"
                  >
                    Generate Certificate
                  </button>
                )}

                {report.certificateGenerated && (
                  <span className="text-green-700 font-semibold text-sm">🎓 Certificate Generated</span>
                )}

                <button
                  onClick={() => handleDeleteReport(report._id)}
                  className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-8">No reports found.</p>
      )}

      {error && <p className="text-red-600 text-center mt-6 font-medium">{error}</p>}
    </div>
  );
};

export default ManageReports;
