
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import RegisterForm from '@/features/auth/RegisterForm'
import Dashboard from '@/pages/Dashboard'
import AnimatedLogo from '@/features/animation/AnimatedLogo'
import ProfilePage from '@/features/auth/profile/[id]'
import ProtectedRoute from './ProtectedRoute '
import ErrorPage from '@/pages/ErrorPage'
import OAuth2RedirectHandler from '@/pages/OAuth2RedirectHandler'
import Notifications from '@/pages/Notifications'

const Approutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/splash" element={<AnimatedLogo />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      <Route path="*" element={<ErrorPage code={404}/>} />

      {/* Protected Routes */}
      <Route
        path="/profile/user/:userId"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      /> */}
    </Routes>  
  )
}

export default Approutes