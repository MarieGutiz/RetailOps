import { useState } from "react";
import { Search, X, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopHeader({isAuth, username}: {isAuth?: boolean, username?: string}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
   <div
  className="fixed top-0 left-0 right-0 z-50 h-10 px-3 sm:px-5
             flex items-center justify-between
             bg-[#001e2b] border-b shadow-sm"
>
  {/* ------------ LEFT SECTION ------------ */}
  <div className="flex items-center gap-1 sm:gap-2 flex-none">

    {/* MOBILE SEARCH ICON */}
    {!searchOpen && (
      <button
      className="sm:hidden p-1.5 flex items-center justify-center 
             jbtn-warning-sm rounded-md text-white"
      onClick={() => setSearchOpen(true)}
    >
      <Search className="h-4 w-4" />
    </button>
    )}

    {/* MOBILE EXPANDED SEARCH */}
    {searchOpen && (
      <div className="relative sm:hidden">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

        <input
          type="text"
          placeholder="Search..."
          className="pl-7 pr-8 py-[5px] rounded-md
                     bg-white/90 border border-gray-300
                     text-gray-800 placeholder:text-gray-500
                     focus:ring-2 focus:ring-blue-400
                     w-[180px] text-sm transition-all"
          autoFocus
        />

        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1
                    jbtn-warning-sm rounded-md"
          onClick={() => setSearchOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )}

    {/* DESKTOP SEARCH */}
    <div className="hidden sm:flex">
      <div className="relative w-[220px]">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

        <input
          type="text"
          placeholder="Search or select case..."
          className="pl-7 pr-3 py-[5px] rounded-md
                     bg-white/90 border border-gray-300
                     text-gray-800 placeholder:text-gray-500
                     focus:ring-2 focus:ring-blue-400
                     w-full text-sm transition-all"
        />
      </div>
    </div>
  </div>

  {/* ------------ RIGHT SECTION ------------ */}
  <div className="flex items-center gap-2 flex-none">
    {isAuth ? ( <>
    <div className="flex items-center gap-2">
        <span className="text-gray-200">Hello, {username}</span></div> </>
      ):<>
      <div className="hidden sm:block">
      <button className="toolbar-element jbtn-flat-btn toolbar-element-md active"
      onClick={() => {navigate('/register')}}>
        Sign Up
      </button>
    </div>
      
      </>}
    

    <UserCircle className="h-4 w-4 text-gray-200 hover:text-blue-300 transition-colors" />
  </div>
</div>


  );
}
