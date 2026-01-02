
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import RegisterForm from '@/features/auth/RegisterForm'
import AnimatedLogo from '@/features/animation/AnimatedLogo'
import ProfilePage from '@/features/auth/profile/[id]'
import ProtectedRoute from './ProtectedRoute '
import ErrorPage from '@/pages/ErrorPage'
import OAuth2RedirectHandler from '@/pages/OAuth2RedirectHandler'
import Notifications from '@/pages/Notifications'
import ForgotPassword from '@/features/auth/ForgotPassword'
import PrimeContent from '@/components/layout/components/main/PrimeContent '
import ProductLibraryModule from '@/components/layout/components/main/outlet/inventory/ProductLibraryModule'
import DashboardModule from '@/components/layout/components/main/outlet/dashboard/DashboardModule'
import Prime from '@/components/layout/prime'
import InventoryModuleLayout from '@/components/layout/components/main/outlet/dashboard/InventoryModuleLayout'
import InventoryStockModule from '@/components/layout/components/main/outlet/inventory/InventoryStockModule'


const Approutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/dashboard" element={<Prime />}>
      <Route element={<PrimeContent />}>
        {/* Index route shows by default */}
        <Route index element={<DashboardModule />} />
        <Route path="overview" element={<DashboardModule />} />


            {/* Inventory module */}
            <Route path="inventory" element={<InventoryModuleLayout />}>
              {/* DEFAULT VIEW */}
              <Route index element={<Navigate to="products" replace />} />

              {/* Sub-views */}
              <Route path="products" element={<ProductLibraryModule />} />
              <Route path="stock" element={<InventoryStockModule />} />
            </Route>

      </Route>
    </Route>


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
    </Routes>  
  )
}

export default Approutes