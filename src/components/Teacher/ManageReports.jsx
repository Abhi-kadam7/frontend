import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageReports = () => {
  const [submittedReports, setSubmittedReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterApproved, setFilterApproved] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API_BASE}/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmittedReports(response.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch reports');
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
      fetchReports();
    } catch (err) {
      console.error('Approve error:', err);
      setError('Error approving report');
    }
  };

  const handleRejectReport = async (id) => {
    const reason = window.prompt('Enter reason for rejection:');
    if (!reason) return;

    try {
      await axios.put(`${API_BASE}/reports/${id}/reject`, { reason }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReports();
    } catch (err) {
      console.error('Reject error:', err);
      setError('Error rejecting report');
    }
  };

  const handleDeleteReport = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this report?');
    if (!confirm) return;

    try {
      await axios.delete(`${API_BASE}/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReports();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Error deleting report');
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
      link.setAttribute('download', 'Project_Completion_Certificate.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      fetchReports();
    } catch (err) {
      console.error('Certificate generation error:', err);
      setError('Error generating certificate');
    }
  };

  const filteredReports = submittedReports.filter((report) =>
    (report.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterApproved === null || report.isApproved === filterApproved)
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h2>
        <p className="text-gray-600 mt-1">Manage and approve submitted project reports.</p>
      </header>

      {/* Filters */}
      <section className="p-6 bg-white rounded-lg shadow mb-8">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by student name or project title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-3 rounded w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <select
            onChange={(e) =>
              setFilterApproved(e.target.value === 'all' ? null : e.target.value === 'approved')
            }
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">All Reports</option>
            <option value="approved">Approved</option>
            <option value="not-approved">Not Approved</option>
          </select>
        </div>
      </section>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <section className="p-6 bg-white rounded-lg shadow mt-6">
          <h3 className="text-xl font-semibold mb-4">Submitted Reports</h3>
          <ul className="space-y-4">
            {filteredReports.map((report) => (
              <li key={report._id} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4">
                <div className="text-gray-700">
                  <p className="font-semibold">{report.studentName} - {report.projectTitle}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(report.submissionDate).toLocaleDateString()} | {report.studentEmail}
                  </p>
                  <p className={`text-sm font-bold mt-1 ${report.isApproved ? 'text-green-600' : report.rejected ? 'text-red-600' : 'text-yellow-600'}`}>
                    {report.isApproved
                      ? '✅ Approved'
                      : report.rejected
                      ? `❌ Rejected: ${report.rejectionReason}`
                      : '⏳ Pending'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                  <a
                    href={`${API_BASE}/reports/${report._id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                  >
                    View Report
                  </a>

                  {!report.isApproved && !report.rejected && (
                    <>
                      <button
                        onClick={() => handleApproveReport(report._id)}
                        className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectReport(report._id)}
                        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {report.isApproved && !report.certificateGenerated && (
                    <button
                      onClick={() => handleGenerateCertificate(report._id)}
                      className="bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700"
                    >
                      Generate Certificate
                    </button>
                  )}

                  {report.certificateGenerated && (
                    <p className="text-green-700 font-semibold">🎓 Certificate Generated</p>
                  )}

                  <button
                    onClick={() => handleDeleteReport(report._id)}
                    className="bg-gray-600 text-white py-1 px-3 rounded hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="text-gray-600">No reports found.</p>
      )}

      {error && <p className="text-red-600 mt-6">{error}</p>}
    </div>
  );
};

export default ManageReports;
