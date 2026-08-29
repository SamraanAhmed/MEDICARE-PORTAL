import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

// Helper: restore user/role from localStorage synchronously on first load
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('medicare_user');
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
};
const getStoredRole = () => localStorage.getItem('medicare_role') || null;

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage immediately so user stays logged in across reloads
  const [user, setUser] = useState(getStoredUser);
  const [role, setRole] = useState(getStoredRole);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const profile = await api.getCurrentUser();
        if (profile) {
          // Merge: prefer server data, but keep localStorage name if server doesn't have one
          const existingUser = getStoredUser();
          const userProfile = {
            _id: profile._id,
            email: profile.email,
            name: profile.name || existingUser?.name || 'User',
            gender: profile.gender || existingUser?.gender || 'not-specified',
            avatar: profile.avatar || existingUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || existingUser?.name || 'User')}&background=115E59&color=fff`,
            pillar: profile.pillar || existingUser?.pillar || null,
          };
          setUser(userProfile);
          setRole(profile.role);
          localStorage.setItem('medicare_user', JSON.stringify(userProfile));
          localStorage.setItem('medicare_role', profile.role);
        }
      } catch (err) {
        // Server failed or rejected — keep localStorage session intact
        // User will only be logged out when they explicitly click logout
        console.info('Session check failed, keeping local session:', err.message);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password, selectedRole) => {
    setError(null);
    setLoading(true);
    try {
      let responseData;
      if (selectedRole === 'user') {
        responseData = await api.loginUser(email, password);
      } else if (selectedRole === 'doctor') {
        responseData = await api.loginDoctor(email, password);
      } else if (selectedRole === 'admin') {
        responseData = await api.loginAdmin(email, password);
      } else {
        throw new Error('Invalid login role specified');
      }

      const userProfile = {
        _id: responseData._id,
        email: responseData.email || email,
        name: responseData.name || email.split('@')[0],
        gender: responseData.gender || 'not-specified',
        avatar: responseData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(responseData.name || email.split('@')[0])}&background=115E59&color=fff`,
        pillar: responseData.pillar || null,
      };

      setUser(userProfile);
      setRole(selectedRole);
      
      localStorage.setItem('medicare_user', JSON.stringify(userProfile));
      localStorage.setItem('medicare_role', selectedRole);
      setLoading(false);
      return userProfile;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password, gender, selectedRole, pillar) => {
    setError(null);
    setLoading(true);
    try {
      let responseData;
      if (selectedRole === 'user') {
        responseData = await api.registerUser(name, email, password, gender);
      } else if (selectedRole === 'doctor') {
        responseData = await api.registerDoctor(name, email, password, gender, pillar);
      } else if (selectedRole === 'admin') {
        responseData = await api.registerAdmin(name, email, password);
      } else {
        throw new Error('Invalid registration role specified');
      }

      const userProfile = {
        _id: responseData._id,
        email: responseData.email || email,
        name: responseData.name || name,
        gender: responseData.gender || gender || 'not-specified',
        avatar: responseData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=115E59&color=fff`,
        pillar: responseData.pillar || pillar || null,
      };

      setUser(userProfile);
      setRole(selectedRole);

      localStorage.setItem('medicare_user', JSON.stringify(userProfile));
      localStorage.setItem('medicare_role', selectedRole);
      setLoading(false);
      return userProfile;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
    } catch (err) {
      console.warn("Backend cookie clearance failed: ", err.message);
    } finally {
      setUser(null);
      setRole(null);
      localStorage.removeItem('medicare_user');
      localStorage.removeItem('medicare_role');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, error, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
