import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  FaUserGraduate,
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaUpload
} from 'react-icons/fa';

const DashboardPage = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [reportFile, setReportFile] = useState(null);
  const [submittedReports, setSubmittedReports] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setStudentName(decoded.name || 'Student');
      } catch (err) {
        console.error('Error decoding token:', err);
        setStudentName('Student');
      }
    }
  }, [token]);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reports/my-reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmittedReports(res.data || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
      setError('Unable to fetch reports');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      setError('⚠ Please upload a valid PDF file.');
      return;
    }
    setReportFile(file);
    setError('');
  };

  const handleSubmit = async () => {
    if (!projectTitle.trim() || !reportFile) {
      setError('⚠ Both project title and PDF file are required.');
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append('projectTitle', projectTitle);
    form.append('report', reportFile);

    try {
      await axios.post(`${API_BASE}/reports/submit-report`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setProjectTitle('');
      setReportFile(null);
      setError('');
      alert('✅ Report submitted successfully!');
      fetchReports();
    } catch (err) {
      console.error('Error submitting report:', err);
      setError(err.response?.data?.message || '❌ Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this report?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE}/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('🗑 Report deleted successfully!');
      fetchReports();
    } catch (err) {
      console.error('Failed to delete report:', err);
      alert('❌ Could not delete the report.');
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-indigo-100 via-white to-blue-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 flex items-center gap-2">
          <FaUpload title="Upload" className="text-indigo-600" />
          Submit Project Report
        </h2>
        <p className="flex items-center text-sm sm:text-base text-gray-700 font-medium bg-white px-3 py-1 rounded-full shadow">
          <FaUserGraduate className="mr-2" title="Student" />
          {studentName}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md space-y-4 mb-10">
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="Enter Project Title"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? 'Submitting...' : (
            <>
              <FaUpload /> Submit Report
            </>
          )}
        </button>
      </div>

      {/* Submitted Reports */}
      <div>
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">📑 My Submissions</h3>

        {submittedReports.length > 0 ? (
          <ul className="space-y-4">
            {submittedReports.map((r) => (
              <li
                key={r._id}
                className="p-5 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1">
                  <p className="text-lg font-bold text-indigo-700">{r.projectTitle}</p>
                  <p className="text-sm text-gray-600">
                    Submitted on: {new Date(r.submissionDate).toLocaleDateString('en-IN')}
                  </p>
                  <p
                    className={`text-sm font-medium flex items-center gap-1 ${
                      r.isApproved
                        ? 'text-green-600'
                        : r.rejected
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {r.isApproved ? (
                      <>
                        <FaCheckCircle /> Approved
                      </>
                    ) : r.rejected ? (
                      <>
                        <FaTimesCircle /> Rejected: {r.rejectionReason}
                      </>
                    ) : (
                      <>
                        <FaHourglassHalf /> Pending Approval
                      </>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-700 transition flex items-center gap-2"
                >
                  <FaTrashAlt /> Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 italic">You haven’t submitted any reports yet.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
