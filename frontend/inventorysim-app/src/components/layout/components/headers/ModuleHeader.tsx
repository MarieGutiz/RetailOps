import type { ReactNode } from "react";
import PrimeBreadcrumb from "../main/PrimeBreadcrumb";
import ModuleHeaderActions from "./ModuleHeaderActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModuleContainerProps {
  title: string
  subtitle?: string
  breadcrumbTrail?: { label: string; path?: string }[]
  userCases?: string[]
    userCasesPlaceholder?: string
  onUserCaseChange?: (value: string) => void
  actions?: ReactNode
}


const ModuleHeader:React.FC<ModuleContainerProps>= ({
      title,
      subtitle,
      breadcrumbTrail,
      userCases = [],
       userCasesPlaceholder = "Select option", 
      onUserCaseChange,
      actions,
}: ModuleContainerProps) => {
  return (
    <>
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 
                space-y-2 sm:space-y-0 w-full">

      {/* Left side */}
      <div className="flex flex-col items-center sm:items-start sm:basis-1/2">
        <h1 className="j-heading j-h1  sm: text-left text-xl whitespace-nowrap">{title}</h1>

        {subtitle && (
          <p className="j-heading j-subtitle text-base sm:text-left">{subtitle}</p>
        )}
      </div>

      {/* Right side → now using the ModuleHeaderActions component */}
      <ModuleHeaderActions>
        {userCases?.length > 0 && (
          <Select onValueChange={(value) => onUserCaseChange?.(value)}>
          <SelectTrigger className="toolbar-element btn-flat-btn toolbar-element-md active w-fit sm:w-auto">
            <SelectValue placeholder={userCasesPlaceholder} />
          </SelectTrigger>

          <SelectContent>
            {userCases.map((uc, i) => (
              <SelectItem key={i} value={uc}>
                {uc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        )}

           {actions}
      </ModuleHeaderActions>

        </div>


       {/* Breadcrumb below header */}
        {breadcrumbTrail && breadcrumbTrail.length > 0 && (
          <div className="mb-4 pt-[3px] sm:pt-0">
            <PrimeBreadcrumb trail={breadcrumbTrail} />
          </div>
        )}
    </div>
       
    </>
  );
}

export default ModuleHeader