import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserShield, FaUserGraduate, FaChalkboardTeacher, FaEye, FaEyeSlash } from "react-icons/fa";

const roleIcons = {
  Admin: <FaUserShield className="text-2xl text-white group-hover:scale-110 transition-transform" />,
  Student: <FaUserGraduate className="text-2xl text-white group-hover:scale-110 transition-transform" />,
  Teacher: <FaChalkboardTeacher className="text-2xl text-white group-hover:scale-110 transition-transform" />,
};

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedRole) return setError("⚠ Please select a role");
    if (!credentials.username || !credentials.password)
      return setError("⚠ Please enter both username and password");

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        username: credentials.username,
        password: credentials.password,
        role: selectedRole.toLowerCase(),
      });

      localStorage.setItem("token", response.data.token);
      setError(null);

      switch (selectedRole) {
        case "Admin":
          navigate("/admin");
          break;
        case "Student":
          navigate("/student");
          break;
        case "Teacher":
          navigate("/teacher");
          break;
        default:
          setError("Unknown role");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }

    setCredentials({ username: "", password: "" });
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
      <input
        type="text"
        name="username"
        placeholder={`${selectedRole} Username`}
        value={credentials.username}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span
          onClick={togglePasswordVisibility}
          className="absolute top-3 right-3 cursor-pointer text-gray-600 hover:text-indigo-600"
          title={showPassword ? "Hide Password" : "Show Password"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button
        type="submit"
        className="w-full py-2 font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow hover:scale-105 transform transition duration-300"
      >
        Login as {selectedRole}
      </button>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </form>
  );

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "url('https://media.getmyuni.com/azure/college-images-test/nanasaheb-mahadik-college-of-engineering-nmce-sangli/2079edd702dc4d77a028f45677854a84.jpeg')",
      }}
    >
      <div className="w-full max-w-md p-6 space-y-6 bg-white/20 backdrop-blur-md rounded-xl shadow-2xl animate-slide-in-up">
        <h2 className="text-3xl font-bold text-center text-gray-800">Project Report Submission System</h2>
        <p className="text-center text-gray-900">Select your role to log in</p>

        {/* Role buttons with icons and tooltips */}
        <div className="flex justify-between gap-3">
          {["Admin", "Student", "Teacher"].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              title={`Login as ${role}`}
              className={`group flex-1 flex flex-col items-center px-4 py-2 font-semibold text-white rounded-xl transition-all duration-300 ${
                selectedRole === role
                  ? "bg-indigo-700 scale-105"
                  : role === "Student"
                  ? "bg-green-500 hover:bg-green-600"
                  : role === "Teacher"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              <div>{roleIcons[role]}</div>
              <span className="text-sm mt-1">{role}</span>
            </button>
          ))}
        </div>

        {selectedRole && (
          <div className="pt-4 animate-fade-in">
            <h3 className="text-xl font-semibold text-center text-indigo-600">{selectedRole} Login</h3>
            {renderLoginForm()}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
