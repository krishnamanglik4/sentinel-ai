import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('sentinel_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('sentinel_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await getMeApi();
          setUser(userData);
          localStorage.setItem('sentinel_user', JSON.stringify(userData));
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginApi({ email, password });
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('sentinel_token', data.access_token);
    localStorage.setItem('sentinel_user', JSON.stringify(data.user));
    return data;
  };

  const register = async (email, password, full_name) => {
    const data = await registerApi({ email, password, full_name });
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('sentinel_token', data.access_token);
    localStorage.setItem('sentinel_user', JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sentinel_token');
    localStorage.removeItem('sentinel_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
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
