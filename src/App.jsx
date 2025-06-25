import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import AdminDashboard from './components/Admin/AdminDashboard';
import DashboardPage from './components/Admin/DashboardPage';
import UserManagement from './components/Admin/UserManagement';
import Reports from './components/Admin/Reports';

import StudentDashboard from "./components/Student/StudentDashboard.jsx";
import StudentDashboardPage from "./components/Student/DashboardPage.jsx";

import TeacherDashboard from './components/Teacher/TeacherDashboard';
import TeacherDashboardPage from './components/Teacher/DashboardPage';
import ManageReports from './components/Teacher/ManageReports.jsx';

import { ThemeProvider } from './context/ThemeContext';


const AppContent = () => (
  <div className="relative">
    <Routes>
      <Route path="/" element={<LoginPage />} />

      {/* Admin Dashboard Routes */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Student Dashboard Routes */}
      <Route path="/student" element={<StudentDashboard />}>
        <Route index element={<StudentDashboardPage />} />
        <Route path='dashboard' element={<StudentDashboardPage/>}/>
      </Route>

      {/* Teacher Dashboard Routes */}
      <Route path="/teacher" element={<TeacherDashboard />}>
        <Route index element={<TeacherDashboardPage />} />
        <Route path="dashboard" element={<TeacherDashboardPage />} />
        <Route path="projects" element={<ManageReports />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  </div>
);

const App = () => (
  <ThemeProvider>
    <Router>
      <AppContent />
    </Router>
  </ThemeProvider>
);

export default App;