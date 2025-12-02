import { useUserPolicy } from '@/context/UserPolicyContext';
import { useProductStore } from '@/store/useProductStore';
import { UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import UserDropdown from './UserDropdown';

const UserMenu = () => {
  const navigate = useNavigate();
  const isAuth = useProductStore((s) => s.isAuthenticated);
  const { username, profileImg } = useUserPolicy();
  console.log("UserMenu - profileImg:", profileImg);
  console.log("UserMenu - profileImg src:", new Image().src = "https://lh3.googleusercontent.com/a/ACg8ocIHV1m1AMWBBCby9FZTZkjPAW84-dF8BGZTY4jhGI8WLyqGELo=s96-c.");

   return (
    <div className="flex items-center gap-2 flex-none">
      {isAuth ? (
        <div className="flex items-center gap-2">
          {/* Smaller text + responsive */}
          <span className="text-gray-200 text-sm sm:text-base truncate max-w-[80px] sm:max-w-none">
            Hello, {username}
          </span>

          {/* Avatar */}
          <UserDropdown>
            <UserAvatar 
              avatar={profileImg || ""}
              username={username || "guest"} 
            />
          </UserDropdown>
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

      {/* Hide default circle when authenticated */}
      {!isAuth && (
        <UserCircle className="h-4 w-4 text-gray-200 hover:text-blue-300 transition-colors" />
      )}
    </div>
  );
}

export default UserMenu