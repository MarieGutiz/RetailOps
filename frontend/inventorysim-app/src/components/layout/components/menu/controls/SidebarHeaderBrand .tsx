import { usePrimeLayoutStore } from "@/components/layout/hooks/usePrimeLayout";
import Brand from "../../headers/Brand";

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
        <Brand
          asChild
          variant="nav"
          collapsed={isCollapsed}       // your existing state
          imgSrc="src/assets/range.jpg" // nav image (different file)
          imgAlt="@RetailOps Sim"
        />

      </a>
    </div>
  );
}

export default SidebarHeaderBrand 