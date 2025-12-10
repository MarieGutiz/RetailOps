import TopHeader from "@/components/layout/components/headers/TopHeader"
import UserNotification from "@/features/auth/profile/UserNotification"

const Notifications = () => {
  return (
    <>
    <TopHeader logo={true} />
    <UserNotification />
    </>
  )
}

export default Notifications