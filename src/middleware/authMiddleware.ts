import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'moderator';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user } = useAdminAuth();

  if (!user) {
    return React.createElement(Navigate, { to: '/admin/login', replace: true });
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return React.createElement(Navigate, { to: '/admin/forbidden', replace: true });
  }

  return React.createElement(React.Fragment, null, children);
}