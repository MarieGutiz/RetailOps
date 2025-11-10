import { SearchIcon, UserCircleIcon } from 'lucide-react'

const TopHeader = () => {
 
  return (
    <div className="flex items-center justify-between h-10 px-6 border-b bg-white shadow-sm sticky top-0 z-10">
      {/* Left section: search or scenario selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search or select case..."
            className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-200 w-64 text-sm placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right section: auth / user controls */}
      <div className="flex items-center gap-3 text-sm">
        <button className="text-gray-700 hover:text-blue-600 transition-colors">
          Sign Up
        </button>
        <UserCircleIcon className="h-5 w-5 text-gray-700" />
      </div>
    </div>
  )
}

export default TopHeader