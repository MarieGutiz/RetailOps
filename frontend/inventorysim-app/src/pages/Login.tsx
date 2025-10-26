import LoginForm from '../features/auth/LoginForm'
import AuthLayout from '@/layouts/AuthLayout'

const Login = () => {
   return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}


export default Login