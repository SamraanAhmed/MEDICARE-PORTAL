import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'user', 'doctor', or 'admin'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const profile = await api.getCurrentUser();
        if (profile) {
          const userProfile = {
            _id: profile._id,
            email: profile.email,
            name: profile.name || (profile.role === 'doctor' ? 'Dr. Sarah Jenkins' : profile.role === 'admin' ? 'System Administrator' : 'Jane Doe'),
            gender: profile.gender || 'not-specified',
            avatar: profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'User')}&background=115E59&color=fff`,
            pillar: profile.pillar || null,
          };
          setUser(userProfile);
          setRole(profile.role);
          localStorage.setItem('medicare_user', JSON.stringify(userProfile));
          localStorage.setItem('medicare_role', profile.role);
        }
      } catch (err) {
        // Fallback to local storage if server is unreachable (offline mode)
        if (err.message.includes('offline') || err.message.includes('unreachable')) {
          const storedUser = localStorage.getItem('medicare_user');
          const storedRole = localStorage.getItem('medicare_role');
          if (storedUser && storedRole) {
            setUser(JSON.parse(storedUser));
            setRole(storedRole);
          }
        } else {
          // Clear stale local session if server actively rejected
          setUser(null);
          setRole(null);
          localStorage.removeItem('medicare_user');
          localStorage.removeItem('medicare_role');
        }
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

      // If user details (like name) are missing from backend login response due to query selections,
      // fallback to assigning a sensible mock profile matching the role.
      const userProfile = {
        _id: responseData._id,
        email: responseData.email || email,
        name: responseData.name || (selectedRole === 'doctor' ? 'Dr. Consultant' : selectedRole === 'admin' ? 'System Administrator' : 'Patient Member'),
        gender: responseData.gender || 'not-specified',
        avatar: responseData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(responseData.name || 'User')}&background=115E59&color=fff`,
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
