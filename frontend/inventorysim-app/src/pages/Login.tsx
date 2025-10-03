import { useEffect } from 'react'
import LoginForm from '../features/auth/LoginForm'
import AuthLayout from '@/layouts/AuthLayout'

const Login = () => {
   return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}

// export default Login
//   }, [])

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       {/* LoginForm here */}
//     </div>
//   )
// }

export default Login