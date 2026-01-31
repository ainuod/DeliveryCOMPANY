import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token === 'fake-debug-token') {
        // Default recovery for page refresh in debug mode
        setUser({ username: 'Admin_Debug', role: 'ADMIN' });
      } else {
        const response = await api.get('/api/users/me/'); 
        setUser(response.data);
      }
    } catch (err) {
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    console.log("Debug Mode: Bypassing Backend");
    
    // Updated logic to support the new DRIVER role
    let role = 'CLIENT'; // Default
    const lowerUser = username.toLowerCase();

    if (lowerUser.includes('admin')) {
      role = 'ADMIN';
    } else if (lowerUser.includes('driver')) {
      role = 'DRIVER';
    } else if (lowerUser.includes('agent')) {
      role = 'AGENT';
    }

    const mockUser = {
      username: username,
      role: role,
      company: role === 'CLIENT' ? 'Dounia Logistics' : 'ST&L Internal'
    };

    localStorage.setItem('access_token', 'fake-debug-token');
    setUser(mockUser);
    
    return true; 
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);