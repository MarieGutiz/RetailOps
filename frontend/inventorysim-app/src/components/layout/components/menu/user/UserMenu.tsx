import { useUserPolicy } from '@/context/UserPolicyContext';
import { useProductStore } from '@/store/useProductStore';
import {  MoreVerticalIcon, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import UserDropdown from './UserDropdown';
import { Button } from '@/components/ui/Button';

const UserMenu = () => {
  const navigate = useNavigate();
  const isAuth = useProductStore((s) => s.isAuthenticated);
  const { username, profileImg, name } = useUserPolicy();
  console.log("UserMenu - profileImg:", profileImg);
  console.log("UserMenu - profileImg src:", new Image().src = "https://lh3.googleusercontent.com/a/ACg8ocIHV1m1AMWBBCby9FZTZkjPAW84-dF8BGZTY4jhGI8WLyqGELo=s96-c.");

   return (
    <div className="flex items-center gap-2 flex-none">
      {isAuth ? (
        <div className="flex items-center gap-2">
          {/* Smaller text + responsive */}
          <span className="
          text-gray-300
            text-xs           /* mobile */
            sm:text-sm        /* small screens */
            md:text-sm      /* medium and up */
            whitespace-nowrap ">
            Hello, {name || username}
          </span>          
          
          <UserDropdown>
            <Button
            className="
                flex items-center justify-center
                gap-px 
                h-10 w-15      /* width adapts to content */
                sm:h-9
                rounded-md
                hover:bg-accent hover:text-accent-foreground
                transition-colors
            "
            >
              {/* Avatar */}
            <UserAvatar 
              avatar={profileImg || ""}
              username={name || username || "Guest"} 
            />
            <MoreVerticalIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          </Button>
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
      <Link to="/register" className="p-1 group">
        <UserCircle
          className="
            h-4 w-4 
            text-gray-200 
            group-hover:text-blue-300 
            transition-colors
          "
        />
      </Link>
      )}
    </div>
  );
}

export default UserMenu