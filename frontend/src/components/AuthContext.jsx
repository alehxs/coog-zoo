import React, { createContext, useContext, useState } from 'react';

// Create the context
export const AuthContext = createContext();

// Hook to use the AuthContext in components
export const useAuth = () => useContext(AuthContext);

// Provide the context to the application
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null); // Add userEmail state

  // Function to update login status, role, and email
  const login = (role, email) => {
    setIsAuthenticated(true);
    setUserRole(role); // Set the userRole directly
    setUserEmail(email); // Store the user's email
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null); // Clear the user's email on logout
  };

  // Create a displayRole based on userRole
  const displayRole = userRole === 'Customer' ? 'Customer' : 'Employee';

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userEmail, login, logout, displayRole }}>
      {children}
    </AuthContext.Provider>
  );
};
