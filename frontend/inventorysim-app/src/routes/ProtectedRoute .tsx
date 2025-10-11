import { isTokenValid } from '@/utils/auth';
import { saveToStorage } from '@/utils/storage';
import { type JSX } from 'react'
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children:  JSX.Element | JSX.Element[]; 
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    // const token = localStorage.getItem('token');
    const  token = saveToStorage.getItem('token');

    if(!token || isTokenValid(token) === false) {
    // remove stale data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;