import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../services/store';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  redirectPath = '/login',
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = window.location.pathname;

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check if the route requires admin access
  if (location.startsWith('/admin') && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 