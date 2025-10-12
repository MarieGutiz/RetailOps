
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import RegisterForm from '@/features/auth/RegisterForm'
import Dashboard from '@/pages/Dashboard'
import AnimatedLogo from '@/features/animation/AnimatedLogo'
import ProfilePage from '@/features/auth/profile/[id]'
import ProtectedRoute from './ProtectedRoute '

const Approutes = () => {
  return (
     <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/splash" element={<AnimatedLogo />} />

      {/* Protected Routes */}
      <Route
        path="/profile/user=:userId"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  
  )
}

export default Approutes