// import { data } from 'react-router-dom';
import { decodeToken, extractUserInfo, isTokenExpired } from '../utils/jwtUtils';

/**
 * Handles user login
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} Authentication result with user info
 */
export const loginUser = async (username, password) => {
  try {
    const response = await fetch('/api/auth/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (data.authenticated && data.token) {
      // Store token in localStorage or secure cookie
      localStorage.setItem('authToken', data.token);
      
      // Extract user info from token
      const userInfo = extractUserInfo(data.token);
      
      return { success: true, user: userInfo };
    }
    
    return { success: false, error: 'Authentication failed' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message || 'Login failed' };
  }
};

/**
 * Checks if user is authenticated and gets current user info
 * @returns {Object|null} User information or null if not authenticated
 */
export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const decodedToken = decodeToken(token);

    // Check if token is valid
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      localStorage.removeItem('token');
      return null;
    }

    // Get user info from token
    const isAdmin = decodedToken && 
      ((decodedToken.scope && decodedToken.scope.includes('ADMIN')) || 
      (decodedToken.roles && decodedToken.roles.includes('ADMIN')));
    
    // Check if token is expired
    if (isTokenExpired(decodedToken)) {
      localStorage.removeItem('token');
      return null;
    }
    
    return {
      username: decodedToken.sub || decodedToken.username,
      isAdmin: isAdmin,
      roles: decodedToken.roles || [],
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Logs out the current user
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
};