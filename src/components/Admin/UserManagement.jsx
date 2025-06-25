import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student' });

  // Fetch all users on mount
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
    username: newUser.email.split('@')[0], // generate username
    password: '123456', // default password
    role: newUser.role,
  });

  alert('✅ User added successfully!');
  setNewUser({ name: '', email: '', role: 'student' });
  fetchUsers();
} catch (err) {
  if (err.response && err.response.status === 409) {
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
    fetchUsers(); // Refresh list
  } catch (err) {
    console.error(err);
    alert('❌ Failed to delete user.');
  }
};


  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
      <p className="mt-2 text-gray-600">Manage students and teachers here.</p>

      {/* Add New User Form */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800">Add New User</h3>
        <div className="mt-4 space-y-4">
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            placeholder="User Name"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="User Email"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button
            onClick={handleAddUser}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
          >
            ➕ Add User
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">User List</h3>
        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200">
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className={`text-sm font-semibold ${user.role === 'teacher' ? 'text-blue-600' : 'text-green-600'}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
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
