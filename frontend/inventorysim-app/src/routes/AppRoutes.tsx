
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import RegisterForm from '@/features/auth/RegisterForm'
import Dashboard from '@/pages/Dashboard'

const Approutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />    */}
        <Route path="/dashboard" element={<Dashboard />} />
        
    </Routes>
  
  )
}

export default Approutes