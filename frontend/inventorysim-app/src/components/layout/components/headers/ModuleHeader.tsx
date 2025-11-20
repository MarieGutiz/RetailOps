import type { ReactNode } from "react";
import PrimeBreadcrumb from "../main/PrimeBreadcrumb";

interface ModuleContainerProps {
  title: string
  subtitle?: string
  breadcrumbTrail?: { label: string; path?: string }[]
  userCases?: string[]
  onUserCaseChange?: (value: string) => void
  actions?: ReactNode
}


const ModuleHeader:React.FC<ModuleContainerProps>= ({
      title,
      subtitle,
      breadcrumbTrail,
      userCases = [],
      onUserCaseChange,
      actions,
}: ModuleContainerProps) => {
  return (
    <>
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
        {/* Left section: Title and subtitle */}
        <div>
          <h1 className="j-heading j-h1 text-lg sm:text-2xl">{title}</h1>
          {subtitle && <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>}
        </div>

        {/* Right section: User cases dropdown + actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
          {userCases && userCases.length > 0 && (
            <select
              className="toolbar-element jcombo-box toolbar-element-md w-full sm:w-auto"
              onChange={(e) => onUserCaseChange?.(e.target.value)}
            >
              {userCases.map((uc, i) => (
                <option key={i} value={uc}>
                  {uc}
                </option>
              ))}
            </select>
          )}
          {actions && actions}
        </div>
      </div>

        {/* Breadcrumb below header */}
        {breadcrumbTrail && breadcrumbTrail.length > 0 && (
          <div className="mb-4">
            <PrimeBreadcrumb trail={breadcrumbTrail} />
          </div>
        )}
    </>
  );
}

export default ModuleHeader