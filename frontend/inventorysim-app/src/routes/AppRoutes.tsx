
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
import Prime from '@/components/layout/prime'
import InventoryModuleLayout from '@/components/layout/components/main/outlet/inventory/InventoryModuleLayout'
import InventoryStockModule from '@/components/layout/components/main/outlet/inventory/InventoryStockModule'
import DashboardSettingModule from '@/components/layout/components/main/outlet/dashboard/DashboardSettingModule'
import DashboardOverviewModule from '@/components/layout/components/main/outlet/dashboard/DashboardOverviewModule'
import DashboardModuleLayout from '@/components/layout/components/main/outlet/dashboard/DashboardModuleLayout'
import SimModuleLayout from '@/components/layout/components/main/outlet/simulations/SimModuleLayout'
import NewsvendorModule from '@/components/layout/components/main/outlet/simulations/NewsvendorModule'
import EoqModule from '@/components/layout/components/main/outlet/simulations/EoqModule'
import AbcModule from '@/components/layout/components/main/outlet/simulations/AbcModule'


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
        {/* Dashboard module */}
        <Route element={<DashboardModuleLayout />}>
          {/* DEFAULT: redirect index to settings */}
          <Route index element={<Navigate to="overview" replace />} />
          {/* Sub-pages */}
          <Route path="overview" element={<DashboardOverviewModule />} />
          <Route path="settings" element={<DashboardSettingModule />} />
        </Route>

          {/* Inventory module */}
          <Route path="inventory" element={<InventoryModuleLayout />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductLibraryModule />} />
            <Route path="stock" element={<InventoryStockModule />} />
          </Route>

          {/* Simulation module */}
          <Route path="simulations" element={<SimModuleLayout />}>
            <Route index element={<Navigate to="newsvendor" replace/>}/>
             <Route path="newsvendor" element={<NewsvendorModule />}/>
             <Route path="eoq" element={<EoqModule />}/>    
             <Route path="abc" element={<AbcModule />}/>       
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