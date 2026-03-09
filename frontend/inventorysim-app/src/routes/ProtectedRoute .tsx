import ErrorPage from '@/pages/ErrorPage';
import type { JSX } from 'react';
import { jwtDecode } from 'jwt-decode';
import { saveToStorage } from '@/utils/storage';

// This component checks if the user is authenticated and has the required role
//  before rendering the protected content.

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const storedUser = saveToStorage.getItem('user');
  console.log('stored user in protected route ' + storedUser);
  if (!storedUser) {
    return (
      <ErrorPage code={401} message="You need to log in to access this page." />
    );
  }

  let user;
  try {
    user = JSON.parse(storedUser);
  } catch {
    return <ErrorPage code={500} message="Invalid user data format." />;
  }

  const token = saveToStorage.getItem('token');
  if (!token) {
    return <ErrorPage code={401} message="Missing authentication token." />;
  }

  try {
    const decoded: any = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      saveToStorage.removeItem('user');
      return (
        <ErrorPage
          code={401}
          message="Your session has expired. Please log in again."
        />
      );
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return (
        <ErrorPage
          code={403}
          message="You don’t have permission to view this page."
        />
      );
    }

    return children;
  } catch (err) {
    return (
      <ErrorPage code={500} message="Error decoding authentication token." />
    );
  }
};

export default ProtectedRoute;
