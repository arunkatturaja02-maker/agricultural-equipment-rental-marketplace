import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('agri_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('agri_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('agri_user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const authData = response.data;
    setToken(authData.token);
    setUser({
      id: authData.id,
      fullName: authData.fullName,
      email: authData.email,
      role: authData.role,
      phone: authData.phone,
      address: authData.address,
    });
    localStorage.setItem('agri_token', authData.token);
    localStorage.setItem('agri_user', JSON.stringify(authData));
    return authData;
  };

  const register = async (registerData) => {
    const response = await api.post('/auth/register', registerData);
    const authData = response.data;
    setToken(authData.token);
    setUser({
      id: authData.id,
      fullName: authData.fullName,
      email: authData.email,
      role: authData.role,
      phone: authData.phone,
      address: authData.address,
    });
    localStorage.setItem('agri_token', authData.token);
    localStorage.setItem('agri_user', JSON.stringify(authData));
    return authData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('agri_token');
    localStorage.removeItem('agri_user');
  };

  const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!token,
        loading,
        login,
        register,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
