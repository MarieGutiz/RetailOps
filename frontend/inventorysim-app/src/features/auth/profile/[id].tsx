import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { saveToStorage } from '@/utils/storage';

// Profile page flat

interface ProfilePageProps {
  id: string;
  username?: string;
  email?: string;
  name?: string;
  role?: string;
  position?: string;
}

const ProfilePage = () => {
  const userData = JSON.parse(saveToStorage.getItem('user') || '{}');
  const user: ProfilePageProps | null = userData ? userData : null;
  if (!userData) {
    return <div>No user data available...</div>;
  }
  console.log('User profile storage' + user);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="p-6 w-96">
        <CardHeader>
          <CardTitle className="text-xl">Hello, {user?.name}</CardTitle>
          <CardDescription>Email: {user?.email}</CardDescription>
          <CardDescription>Username: {user?.username}</CardDescription>
          <CardDescription>
            Position: {user?.position || 'Student'}
          </CardDescription>
          <CardDescription>ID: {user?.id}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ProfilePage;
