import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserProvider';

const ProtectedRoute = () => {
  const { session } = useUser();

  // If there is no session, redirect to the welcome page.
  if (!session) {
    return <Navigate to="/welcome" replace />;
  }

  // If there is a session, render the main application.
  return <Outlet />;
};

export default ProtectedRoute;
