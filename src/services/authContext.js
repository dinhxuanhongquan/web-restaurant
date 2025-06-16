import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Enhanced auth state initialization
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUserInfo = localStorage.getItem('userInfo');

        if (savedToken && savedUserInfo) {
          try {
            // Parse saved user info
            const parsedUserInfo = JSON.parse(savedUserInfo);
            
            // Verify token is still valid by making a test request
            const response = await fetch('http://localhost:8000/restaurant/users/me', {
              headers: {
                Authorization: `Bearer ${savedToken}`
              }
            });
            
            if (response.ok) {
              // Token is valid, restore user session
              setToken(savedToken);
              setUser(parsedUserInfo);
              setIsAuthenticated(true);
              
              // Update authService state as well
              authService.setToken(savedToken);
              authService.setUserInfo(parsedUserInfo);
            } else {
              // Token is invalid, clear all auth data
              localStorage.removeItem('token');
              localStorage.removeItem('userInfo');
              authService.clearAuth();
            }
          } catch (parseError) {
            console.error('Error parsing saved user info:', parseError);
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            authService.clearAuth();
          }
        } else {
          // No saved auth data, user needs to login
          authService.clearAuth();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        authService.clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const result = await authService.login(credentials);
      
      // Save to localStorage for persistence
      localStorage.setItem('token', result.token);
      localStorage.setItem('userInfo', JSON.stringify(result.userInfo));
      
      setToken(result.token);
      setUser(result.userInfo);
      setIsAuthenticated(true);
      
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    authService.clearAuth();
    
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (newUserInfo) => {
    setUser(newUserInfo);
    localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
    authService.setUserInfo(newUserInfo);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};