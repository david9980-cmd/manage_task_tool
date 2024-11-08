// src/utils/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

interface PrivateRouteProps {
  allowedRoles: Array<'admin' | 'manager' | 'employee'>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized if the user's role is not allowed
    return <Navigate to="/unauthorized" />;
  }

  // Allow access to child components
  return <Outlet />;
};

export default PrivateRoute;
