import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import logo from '../assets/logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    company_name: ''
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // payload structure matches UserSerializer:
      // { username, password, email, role: 'CLIENT', client_profile: { company_name } }
      const payload = {
        ...formData,
        role: 'CLIENT',
        client_profile: {
          company_name: formData.company_name
        }
      };
      // remove flat company_name from root
      delete payload.company_name;

      await api.post('/api/users/', payload);
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please check your inputs.");
    }
  };

  return (
    <div className="login-container">
      {/* FIX: Added 'bg-white' and 'opacity-100' to ensure 
         the card is perfectly white and not "dark/grey" 
      */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/10 z-20">

        <div className="flex flex-col items-center mb-8 text-center">
          <img src={logo} alt="ST&L" className="w-24 mb-4" />
          <h1 className="text-2xl font-black text-[#004d40]">Create Account</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Join the ST&L Logistics Network</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name / Username"
            required
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-[#004d40]/20 focus:border-[#004d40] transition-all text-slate-700"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-[#004d40]/20 focus:border-[#004d40] transition-all text-slate-700"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <input
            type="text"
            placeholder="Company Name"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-[#004d40]/20 focus:border-[#004d40] transition-all text-slate-700"
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-[#004d40]/20 focus:border-[#004d40] transition-all text-slate-700"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-[#004d40] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#004d40]/30 hover:bg-[#00332b] transform transition active:scale-[0.98] mt-2"
          >
            Register to ST&L
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-[#004d40] font-black hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;