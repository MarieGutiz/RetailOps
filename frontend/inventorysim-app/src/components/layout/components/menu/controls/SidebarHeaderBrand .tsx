import { usePrimeLayoutStore } from "@/components/layout/hooks/usePrimeLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const SidebarHeaderBrand  = () => {
    const isCollapsed = !usePrimeLayoutStore((l) => l.open)
  return (
    <div
      className={`flex flex-col items-start transition-all duration-300 overflow-hidden
        ${isCollapsed ? "px-1.5" : "px-3"}`}
    >
      <a
        href="/"
        className={`flex items-center gap-2 transition-all duration-300
          ${isCollapsed ? "justify-center" : "justify-start"}`}
      >
        <Avatar className="h-8 w-8 rounded-lg shrink-0">
          <AvatarImage src="src/assets/range.jpg" alt="@RetailOps Sim" />
          <AvatarFallback>RS</AvatarFallback>
        </Avatar>

        {/* Brand text */}
        <div
          className={`flex flex-col transition-opacity duration-300
            ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}
        >
          <span className="text-base font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            RetailOps Sim
          </span>
          <span className="text-[10px] text-muted-foreground tracking-wide mt-0.5">
            Optimize. Simulate.
          </span>
        </div>
      </a>
    </div>
  );
}

export default SidebarHeaderBrand 