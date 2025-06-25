import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaUserPlus } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      return alert('⚠ Please fill in all fields!');
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/users`, {
        name: newUser.name,
        email: newUser.email,
        username: newUser.email.split('@')[0],
        password: '123456',
        role: newUser.role,
      });

      alert('✅ User added successfully!');
      setNewUser({ name: '', email: '', role: 'student' });
      fetchUsers();
    } catch (err) {
      if (err.response?.status === 409) {
        alert('⚠ User already exists with this email or username.');
      } else {
        console.error(err);
        alert('❌ Failed to add user.');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/auth/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to delete user.');
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">👥 User Management</h2>
      <p className="text-center text-gray-500 mb-6">Manage students and teachers here.</p>

      {/* Add User Form */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">➕ Add New User</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <button
          onClick={handleAddUser}
          className="mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-transform hover:scale-105 w-full sm:w-auto"
        >
          <FaUserPlus /> Add User
        </button>
      </div>

      {/* User List */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 User List</h3>
        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user._id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 transition-all"
              >
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span
                    className={`inline-block mt-1 text-sm font-semibold ${
                      user.role === 'teacher' ? 'text-blue-600' : 'text-green-600'
                    }`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="mt-3 sm:mt-0 flex items-center gap-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-transform hover:scale-105"
                >
                  <FaTrashAlt /> Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
