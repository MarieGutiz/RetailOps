import { useState } from "react";
import { Search, X, UserCircle } from "lucide-react";

export default function TopHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                h-14 px-4 sm:px-6 border-b bg-white shadow-sm">
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className="flex items-center flex-1 gap-2 sm:gap-3">

          {/* MOBILE: SEARCH ICON */}
          {!searchOpen && (
            <button
              className="sm:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5 text-gray-700" />
            </button>
          )}

          {/* MOBILE: EXPANDED SEARCH */}
          {searchOpen && (
            <div className="relative sm:hidden flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-3 py-2 w-full rounded-lg border border-gray-200
                          focus:ring-1 focus:ring-blue-300 text-sm"
                autoFocus
              />

              {/* Slim Close Button */}
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-[2px]
                          flex items-center justify-center border-l border-gray-200
                          hover:bg-gray-100 rounded-r-lg"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          )}

          {/* DESKTOP/TABLET: ALWAYS SHOW FULL SEARCH W/ LABEL */}
          <div className="hidden sm:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search or select case..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200
                          focus:ring-1 focus:ring-blue-300 text-sm w-full"
              />
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT SECTION ---------------- */}
        <div className="flex items-center gap-3 whitespace-nowrap mr-4 sm:mr-0">
          {/* DESKTOP/TABLET SIGN UP → hidden on mobile */}
          <button className="hidden sm:inline-block text-gray-700 hover:text-blue-600 transition">
            Sign Up
          </button>

          {/* User Icon always visible */}
          <UserCircle className="h-6 w-6 text-gray-700 hover:text-blue-600 transition-colors" />
        </div>
      </div>

  );
}
