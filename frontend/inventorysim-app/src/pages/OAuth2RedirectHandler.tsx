import authService from '@/services/auth/authService';
import  { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const username = searchParams.get("username");
    const name = searchParams.get("name");
    const role = searchParams.get("role");
    const position = searchParams.get("position");

    if (token && id) {
      const user = { id, email, username, name, role, position };
      authService.saveAuthData(token, user);
      //toast.success("Login successful. Redirecting...");
      
      // Navigate after storage is guaranteed
      navigate(`/profile/user/${id}`, { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
    setLoading(false);
  }, [searchParams, navigate]);

  if (loading) return <p>Redirecting...</p>;
  return null;
};
export default OAuth2RedirectHandler