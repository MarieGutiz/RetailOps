
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import RegisterForm from '@/features/auth/RegisterForm'
import Dashboard from '@/pages/Dashboard'
import AnimatedLogo from '@/features/animation/AnimatedLogo'
import SplashScreen from '@/pages/SplashScreen'

const Approutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />   
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/splash' element={<AnimatedLogo />} />
        
    </Routes>
  
  )
}

export default Approutes