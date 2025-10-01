import { useState } from "react";

const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (email: string, password: string) => {
    setLoading(true);
    setTimeout(() => {
      console.log("Logged in:", email);
      setLoading(false);
    }, 1000);
  };

  return { login: handleLogin, loading };
}

export default useLogin;
