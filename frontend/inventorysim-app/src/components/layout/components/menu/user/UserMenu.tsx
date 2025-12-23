import { useUserPolicy } from '@/context/UserPolicyContext';
import { useProductStore } from '@/store/inventory/useProductStore';
import {  MoreVerticalIcon, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import UserDropdown from './UserDropdown';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/user/useUserStore';

const UserMenu = () => {
  const navigate = useNavigate();
  const isAuth = useProductStore((s) => s.isAuthenticated);
  const { user } = useUserStore();
  // console.log("UserMenu - profileImg:", profileImg);

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
            Hello, {user.name || user.username}
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
              avatar={user.profileImg || ""}
              username={user.name || user.username || "Guest"} 
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