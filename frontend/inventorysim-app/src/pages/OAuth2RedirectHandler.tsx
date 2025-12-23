import authService from '@/services/auth/authService';
import { useProductStore } from '@/store/inventory/useProductStore';
import { useUserStore } from '@/store/user/useUserStore';
import  { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  //sync products to backend after login
  const setAuthenticated = useProductStore((s) => s.setAuthenticated);
  const syncToBackend = useProductStore((s) => s.syncToBackend);

    const setUser = useUserStore((s) => s.setUser);


   useEffect(() => {
  const params = {
    token: searchParams.get("token"),
    id: searchParams.get("id"),
    email: searchParams.get("email"),
    username: searchParams.get("username"),
    name: searchParams.get("name"),
    role: searchParams.get("role"),
    position: searchParams.get("position") ?? "",
    profileImage: searchParams.get("profileImage") ?? null,
  };

  // ---------- INVALID LOGIN ----------
  if (!params.token || !params.id) {
    navigate("/login", { replace: true });
    setLoading(false);
    return;
  }

  // ---------- SAVE USER ----------
  const user = {
    id: params.id,
    email: params.email,
    username: params.username,
    name: params.name,
    role: params.role,
    position: params.position,
    profileImage: params.profileImage,
  };
  console.log("OAuth2RedirectHandler - user:", user);
  authService.saveAuthData(params.token, user);
  
  // Update user store
  setUser(user);

  // ---------- AUTH + SYNC ----------
  setAuthenticated(true);
  syncToBackend();

  // ---------- DASHBOARD REDIRECT ----------
  navigate("/dashboard", { replace: true });

  setLoading(false);
  }, [searchParams, navigate, setAuthenticated, syncToBackend]);

  if (loading) return <p>Redirecting...</p>;
  return null;
};
export default OAuth2RedirectHandler