import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || '');
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');

  const login = useCallback(({ token: newToken, role, name }) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);
    setToken(newToken);
    setUserRole(role);
    setUserName(name);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('companyInfo');
    setToken(null);
    setUserRole('');
    setUserName('');
  }, []);

  const isAuthenticated = token !== null;

  const value = useMemo(() => ({
    token, userRole, userName, isAuthenticated, login, logout
  }), [token, userRole, userName, isAuthenticated, login, logout]);

  return (
    <AuthContext.Provider value={value}>
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
