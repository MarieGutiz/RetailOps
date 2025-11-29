import { useUserPolicy } from '@/context/UserPolicyContext';
import { useProductStore } from '@/store/useProductStore';
import { UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';

const UserMenu = () => {
  const navigate = useNavigate();
  const isAuth = useProductStore((s) => s.isAuthenticated);
  const { username, profileImg } = useUserPolicy();

  return (
    <div className="flex items-center gap-2 flex-none">
      {isAuth ? (
        <div className="flex items-center gap-2">
          <span className="text-gray-200">Hello, {username}</span>
          <UserAvatar avatar={profileImg || ""} username={username || "guest"} />
        </div>
      ) : (
        <div className="hidden sm:block">
          <button
            className="toolbar-element jbtn-flat-btn toolbar-element-md active"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </div>
      )}

      <UserCircle className="h-4 w-4 text-gray-200 hover:text-blue-300 transition-colors" />
    </div>
  );
}

export default UserMenu