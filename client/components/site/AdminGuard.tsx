import React, { useEffect, useState, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface Props {
  children: ReactNode;
}

export default function AdminGuard({ children }: Props) {
  const { user, token, loading } = useAuth();
  
  if (loading) return <p className="text-center py-10">Loading...</p>;
  
  // Check if user is authenticated and is an admin
  const isAdmin = token && user && user.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
