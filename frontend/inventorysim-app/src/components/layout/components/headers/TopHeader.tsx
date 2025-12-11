import { useState } from "react";
import { Search, X } from "lucide-react";
import UserMenu from "../menu/user/UserMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TopHeader({logo}: {logo?:boolean}) {
  const [searchOpen, setSearchOpen] = useState(false);
  //show logo if needed
  return (
   <div
  className={`fixed top-0 left-0 right-0 z-50 ${logo ? "h-11" : "h-10"} px-3 sm:px-5
              flex items-center justify-between
              bg-[#001e2b] border-b shadow-sm`}
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
          id="mobile-search"
          name="mobile-search"
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
    {/* ADD LOGO IF TRUE */}
    {logo && (
          <div
    className="
      relative 
      sm:static 
      w-full sm:w-auto 
      flex justify-center sm:justify-start
    "
  >
    <a
      href="/"
      className="flex items-center gap-2"
    >
      <Avatar className="h-6 w-6 sm:h-8 sm:w-8 rounded-none shrink-0">
        <AvatarImage src="src/assets/range.png" alt="@RetailOps Sim" />
        <AvatarFallback>RS</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <span className="text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
          RetailOps Sim
        </span>

        <span className="text-[8px] sm:text-[10px] text-muted-foreground tracking-wide -mt-1">
          Optimize. Simulate.
        </span>
      </div>
    </a>
  </div>
        )}
      

    {/* DESKTOP SEARCH */}
  <div className="flex-1 align-middle">
  {/* Centered desktop search */}
  {logo && (
    <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px]">
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
  )}

  {/* Original position when logo is false */}
  {!logo && (
    <div className="hidden sm:flex relative w-[220px]">
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
  )}
</div>

    {/* LEFT SECTION ENDS */}
  </div>

  {/* ------------ RIGHT SECTION ------------ */}
  <UserMenu />
</div>


  );
}
