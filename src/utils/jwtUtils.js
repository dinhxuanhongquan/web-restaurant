/**
 * Decodes a JWT token without verification
 * @param {string} token - JWT token string
 * @returns {Object} The decoded token payload
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    // JWT structure: header.payload.signature
    const base64Payload = token.split('.')[1];
    // Replace characters and decode base64
    const decodedPayload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    // Parse the JSON payload
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Checks if the token is expired
 * @param {Object} decodedToken - Decoded token payload
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (decodedToken) => {
  if (!decodedToken || !decodedToken.exp) return true;
  
  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

/**
 * Extracts user information from the token
 * @param {string} token - JWT token string
 * @returns {Object} User information including roles
 */
export const extractUserInfo = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    username: decoded.sub,
    isAdmin: decoded.scope && decoded.scope.includes('ADMIN'),
    scope: decoded.scope || [],
    exp: decoded.exp,
    iat: decoded.iat,
  };
};