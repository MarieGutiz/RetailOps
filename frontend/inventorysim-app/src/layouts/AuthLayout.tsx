import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    React.useEffect(() => {
        // add body class for auth pages
        document.body.classList.add("auth-body");

        // cleanup when leaving auth pages
        return () => {
            document.body.classList.remove("auth-body");
        };
    }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      {children}
    </div>
  )
}

export default AuthLayout