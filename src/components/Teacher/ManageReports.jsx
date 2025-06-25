import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageReports = () => {
  const [submittedReports, setSubmittedReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterApproved, setFilterApproved] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch all reports
  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmittedReports(response.data);
    } catch (err) {
      setError('Failed to fetch reports');
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, []);

  // Approve report
  const handleApproveReport = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/reports/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReports();
    } catch (err) {
      setError('Error approving report');
    }
  };

  // Reject report with reason
  const handleRejectReport = async (id) => {
    const reason = window.prompt('Please enter the reason for rejecting this report:');
    if (!reason) return;

    try {
      await axios.put(
        `http://localhost:5000/api/reports/${id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReports();
    } catch (err) {
      setError('Error rejecting report');
    }
  };

  // Delete report
  const handleDeleteReport = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this report?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReports();
    } catch (err) {
      setError('Error deleting report');
    }
  };

  // Generate certificate
  const handleGenerateCertificate = async (reportId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/reports/${reportId}/certificate`,
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

      fetchReports();
    } catch (err) {
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
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by student name or project title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
          <ul className="space-y-3">
            {filteredReports.map((report) => (
              <li key={report._id} className="flex justify-between items-center border-b pb-4">
                <div className="text-gray-600">
                  <p>
                    <strong>{report.studentName}</strong> - {report.projectTitle} -{' '}
                    {new Date(report.submissionDate).toLocaleDateString()}
                  </p>
                  <p className={`font-semibold ${report.isApproved ? 'text-green-500' : 'text-red-500'}`}>
                    {report.isApproved ? 'Approved' : 'Not Approved'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {report.studentEmail} - {report.department || 'N/A'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`http://localhost:5000/api/reports/${report._id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-500 text-white py-1 px-4 rounded-lg hover:bg-yellow-600 transition"
                  >
                    View Report
                  </a>

                  {!report.isApproved && (
                    <>
                      <button
                        onClick={() => handleApproveReport(report._id)}
                        className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 transition"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleRejectReport(report._id)}
                        className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {report.isApproved && !report.certificateGenerated && (
                    <button
                      onClick={() => handleGenerateCertificate(report._id)}
                      className="bg-indigo-500 text-white py-1 px-4 rounded-lg hover:bg-indigo-600 transition"
                    >
                      Generate Certificate
                    </button>
                  )}

                  {report.certificateGenerated && (
                    <p className="text-green-600 font-semibold">Certificate Generated</p>
                  )}

                  <button
                    onClick={() => handleDeleteReport(report._id)}
                    className="bg-gray-600 text-white py-1 px-4 rounded-lg hover:bg-gray-700 transition"
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

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default ManageReports;
