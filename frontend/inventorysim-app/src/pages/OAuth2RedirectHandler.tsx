import  { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
 const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (token && id) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ id, email }));
      navigate(`/profile/${id}`);
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return <p>Logging in with Google...</p>;
}

export default OAuth2RedirectHandler