import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  if (auth.isLoading) return <div>Loading...</div>;

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
