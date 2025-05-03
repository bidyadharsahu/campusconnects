
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth/auth-context';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, adminOnly = false }) => {
  const { user, isLoading, isAdmin, profile } = useAuth();
  const location = useLocation();

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-campus-gradient">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
          <div className="text-xl text-white font-medium">Loading...</div>
        </div>
      </div>
    );
  }
  
  // No user, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check for admin access if required
  if (adminOnly && !isAdmin) {
    // If admin access is required but user is not admin, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
