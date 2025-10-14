import authService from '@/services/auth/authService';
import type { Account } from '@/types/accounts';
import  { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
 const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
  const id = searchParams.get("id");
  const email = searchParams.get("email");
  const username = searchParams.get("username");
  const name = searchParams.get("name");
  const role = searchParams.get("role");
  const position = searchParams.get("position");
  const user = {id, email, username, name, role, position}
  
  
    if (token && id) {
      authService.saveAuthData(token, user);
      navigate(`/profile/user/${id}`);
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);
   
   toast.success("Getting redirect..");
   return <p>Redirecting...</p>;
}

export default OAuth2RedirectHandler