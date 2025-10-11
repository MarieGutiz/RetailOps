import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";

interface ProfilePageProps {
   id: string;
   username?: string;
   email?: string;
   name?: string;
   role?: string;
   position?: string;
}

const ProfilePage = () => {
  const {id} = useParams<{id: string}>();
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const user: ProfilePageProps | null = userData ? userData : null;
  if (!userData) {
    return <div>No user data available...</div>;
  }

  return (
      <div className="flex justify-center items-center h-screen">
      <Card className="p-6 w-96">
        <CardHeader>
          <CardTitle className="text-xl">Hello, {user?.name}</CardTitle>
          <CardDescription>Email: {user?.email}</CardDescription>
          <CardDescription>Username: {user?.username}</CardDescription>
          <CardDescription>Position: {user?.position}</CardDescription>
          <CardDescription>ID: {id}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

export default ProfilePage