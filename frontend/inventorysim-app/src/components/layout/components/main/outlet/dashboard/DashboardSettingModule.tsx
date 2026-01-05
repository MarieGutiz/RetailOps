import { useUserStore } from "@/store/user/useUserStore";
import DashboardSettings from "./DashboardSettings"

const DashboardSettingModule = () => {
 const { user } = useUserStore();

  return (
    <>
      <h2 className="text-lg font-semibold p-2">Welcome to your dashboard, {user.name || user.username}!</h2>
      <DashboardSettings /> 
    </>
  )
}

export default DashboardSettingModule