import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        alert("Invalid credentials. Please check your username and password.");
      }
    } catch (err) {
      alert("Cannot connect to server. Did you run 'python manage.py runserver'?");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="text-center mb-8">
          <img src={logo} alt="ST&L" className="w-28 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#004d40]">Welcome Back</h2>
          <p className="text-slate-400 text-sm">ST&L Logistics Management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text" placeholder="Username" required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#004d40]"
            value={username} onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password" placeholder="Password" required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[#004d40]"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-[#004d40] text-white py-4 rounded-xl font-bold hover:bg-[#00332b] shadow-lg transition-all">
            Login to ST&L
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="text-[#004d40] font-bold hover:underline">Create an Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
